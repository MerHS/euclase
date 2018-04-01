/* eslint-disable no-unused-vars */

import { Coord, NoteIndex, Rect, EditMode, Note, LaneIndex } from '../../utils/scoreTypes';
import { MP_LEN, MP_POS, ScoreGetters, MeasureFraction } from './score';
import { binarySearch, mergeSortedList, binarySearchIndex } from '../../utils/noteUtil';
import Fraction from '../../utils/fraction';
import { RootState } from '..';

import { theme, ThemeState, ThemeGetters } from './theme';
import { panel, PanelState  } from './panel';
import { note, NoteState } from './note';
import { score, MeasurePulse, ScoreState } from './score';
import * as R from 'ramda';
import { MutationTree, ActionTree, GetterTree, Module } from 'vuex';

export interface DragZoneState {
  // ctrl + drag
  isExclusive: boolean;
  showDragZone: boolean;
  // mouseDown Start Coord
  dragStartPos: Coord;
  // [bottom-left Coord, [width, height]]
  dragRect: Rect;
}

interface PreviewNoteState {
  isVisible: boolean;
  laneIndex: LaneIndex;
  pulse: number;
}

export interface EditorState {
  editMode: EditMode;
  /** value of editMode when drag is started */
  dragStartEditMode: EditMode;
  dragZone: DragZoneState;
  selectedNotes: Array<NoteIndex>;
  previewNoteValue: PreviewNoteState;
}

interface EditorGetterState extends EditorState {
  theme: ThemeState;
  panel: PanelState;
  note: NoteState;
  score: ScoreState;
}

export const state: EditorState = {
  editMode: EditMode.SELECT_MODE,
  dragStartEditMode: EditMode.SELECT_MODE,
  dragZone: {
    isExclusive: false,
    showDragZone: false,
    dragStartPos: [0, 0],
    dragRect: [[0, 0], [0, 0]],
  },
  selectedNotes: [],
  previewNoteValue: {
    isVisible: false,
    laneIndex: 0,
    pulse: 0,
  },
};

export interface CanvasInfo {
  widthPixel: number;
  heightPixel: number;
  laneXList: Array<number>;
  laneEditableList: Array<boolean>;
  measureYList: Array<number>; // TODO: array to calculation function
  mainGridYList: Array<number>; // TODO: array to calculation function
  subGridYList: Array<number>; // TODO: array to calculation function
}

export interface EditorGetters extends CanvasInfo, ScoreGetters, ThemeGetters {
  yPixelToGridPulse: (yPixel: number) => number;
  yPixelToPulse: (yPixel: number) => number;
  pulseToYPixel: (pulse: number) => number;
  canvasInfo: CanvasInfo;
  laneWidthList: number[];
}

export const getters: GetterTree<EditorState, RootState> = {
  laneXList(_state: EditorState): CanvasInfo['laneXList'] {
    const state = _state as EditorGetterState;
    const horizontalZoom = state.panel.horizontalZoom;
    const laneStyles = state.theme.currentTheme.laneStyles;
    return R.scan((sum, style) => sum + style.width * horizontalZoom, 0, laneStyles);
  },
  laneWidthList(_state: EditorState, getters: EditorGetters): EditorGetters['laneWidthList'] {
    const state = _state as EditorGetterState;
    const horizontalZoom = state.panel.horizontalZoom;
    const laneStyles = state.theme.currentTheme.laneStyles;
    return laneStyles.map(style => style.width * horizontalZoom);
  },
  laneEditableList(_state: EditorState, getters: EditorGetters): CanvasInfo['laneEditableList'] {
    const state = _state as EditorGetterState;
    const laneStyles = state.theme.currentTheme.laneStyles;
    return laneStyles.map(style => style.editGroup >= 0);
  },
  measureYList(state: EditorState, getters: EditorGetters): CanvasInfo['measureYList'] {
    const
      measurePulseList: Array<MeasurePulse> = getters.measurePulseList,
      pulseToYPixel: (pulse: number) => number = getters.pulseToYPixel;

    return measurePulseList.map(pulse => pulseToYPixel(pulse[MP_POS]));
  },
  mainGridYList(_state: EditorState, getters: EditorGetters): CanvasInfo['mainGridYList'] {
    const state = _state as EditorGetterState;
    const
      mainFrac = new Fraction(1, state.panel.mainGrid),
      resolution: number = getters.resolution,
      measureFracList: Array<MeasureFraction> = getters.measureFracList,
      pulseToYPixel: (pulse: number) => number = getters.pulseToYPixel;
    
    // R.chain === _.flatMap
    return R.chain(([no, len, pos]) => {
      const gridCount = len.div(mainFrac).floorValue();
      return R.range(1, gridCount).map(n => pos.add(mainFrac.mulInt(n)));
    }, measureFracList).map(
      (frac: Fraction) => pulseToYPixel(frac.mulInt(resolution).value()),
    );
  },
  subGridYList(_state: EditorState, getters: EditorGetters): CanvasInfo['subGridYList'] {
    const state = _state as EditorGetterState;
    const
      subFrac = new Fraction(1, state.panel.subGrid),
      resolution: number = getters.resolution,
      measureFracList: Array<MeasureFraction> = getters.measureFracList,
      pulseToYPixel: (pulse: number) => number = getters.pulseToYPixel;

    return R.chain(([no, len, pos]) => {
      const gridCount = len.div(subFrac).floorValue();
      return R.range(1, gridCount).map(n => pos.add(subFrac.mulInt(n)));
    }, measureFracList).map(
      (frac: Fraction) => pulseToYPixel(frac.mulInt(resolution).value()),
    );
  },
  widthPixel(_state: EditorState, getters: EditorGetters): CanvasInfo['widthPixel'] {
    const state = _state as EditorGetterState;
    const
      totalWidth: number = getters.totalWidth,
      horizontalZoom = state.panel.horizontalZoom;

    return totalWidth * horizontalZoom;
  },
  heightPixel(_state: EditorState, getters: EditorGetters): CanvasInfo['heightPixel'] {
    const state = _state as EditorGetterState;
    const
      resolution: number = getters.resolution,
      maxPulse: number = getters.maxPulse,
      defaultHeight = state.panel.defaultHeight,
      verticalZoom = state.panel.verticalZoom;

    return defaultHeight * verticalZoom * (maxPulse / resolution);
  },
  canvasInfo(state: EditorState, getters: EditorGetters): CanvasInfo {
    const { laneXList, laneEditableList, measureYList,
      mainGridYList, subGridYList, widthPixel, heightPixel } = getters;

    return {
      laneXList,
      laneEditableList,
      measureYList,
      mainGridYList,
      subGridYList,
      widthPixel,
      heightPixel,
    };
  },
  yPixelToPulse(state: EditorState, getters: EditorGetters): (yPixel: number) => number {
    const
      maxPulse: number = getters.maxPulse,
      heightPixel = getters.heightPixel;

    return (yPixel: number) => maxPulse * (yPixel / heightPixel);
  },
  pulseToYPixel(state: EditorState, getters: EditorGetters): (pulse: number) => number {
    const
      maxPulse: number = getters.maxPulse,
      heightPixel = getters.heightPixel;

    return (pulse: number) => heightPixel * (pulse / maxPulse);
  },
  yPixelToGridPulse(state: EditorState, getters: EditorGetters): (yPixel: number) => number {
    const
      subGridYList = getters.subGridYList,
      yPixelToPulse = getters.yPixelToPulse;

    return (yPixel: number) => {
      const gridPixel = binarySearch(subGridYList, pixel => pixel >= yPixel);

      return (gridPixel == null) ? 0 : yPixelToPulse(gridPixel);
    };
  },
  previewNoteStyle(_state: EditorState, getters: EditorGetters): Partial<CSSStyleDeclaration> {
    const state = _state as EditorGetterState;
    const laneIndex = state.previewNoteValue.laneIndex;
    const laneStyles = state.theme.currentTheme.laneStyles 
    
    // invalid laneIndex -> do not display
    if (laneIndex < 0 || laneIndex >= laneStyles.length) {
      return {
        display: 'none',
      };
    }

    const yPixel = getters.pulseToYPixel(state.previewNoteValue.pulse);

    return {
      left: `${getters.laneXList[laneIndex]}px`,
      bottom: `${yPixel}px`,
      width: `${getters.laneWidthList[laneIndex]}px`,
      height: `${state.note.noteHeight}px`,
      border: `0.5px solid ${state.note.borderColor}`,
      background: `${laneStyles[laneIndex].noteColor}`,
      display: state.previewNoteValue.isVisible ? 'block' : 'none',
    };
  }
};


const mutations: MutationTree<EditorState> = {
  dragStart(state: EditorState, payload: { coord: Coord, isExclusive: boolean }) {
    state.dragStartEditMode = state.editMode;

    if (state.editMode === EditMode.SELECT_MODE) {
      state.dragZone.showDragZone = true;
    }
    state.dragZone.dragStartPos = [payload.coord[0], payload.coord[1]];
    state.dragZone.dragRect = [[payload.coord[0], payload.coord[1]], [0, 0]];
    state.dragZone.isExclusive = payload.isExclusive;

    if (state.editMode === EditMode.WRITE_MODE) {
      // TODO: add previewNote
    }
  },
  dragMove(state: EditorState, coord: Coord) {
    const [fromX, fromY] = state.dragZone.dragStartPos; // bottom-left point 
    const [toX, toY] = coord; // top-right point
    
    const x = (fromX < toX) ? fromX : toX;
    const y = (fromY < toY) ? fromY : toY;
    const w = (fromX < toX) ? (toX - fromX) : (fromX - toX);
    const h = (fromY < toY) ? (toY - fromY) : (fromY - toY);

    state.dragZone.dragRect = [[x, y], [w, h]];

    if (state.dragStartEditMode === EditMode.WRITE_MODE) {
      // TODO: calculate LN Note
    }
  },
  dragEnd(state: EditorState, coord: Coord) {
    state.dragZone.showDragZone = false;

    // TODO: if previewNote != null, commit previewNote to noteManager
  },
  changeMode(state: EditorState, mode: EditMode) {
    state.editMode = mode;

    if (mode !== EditMode.SELECT_MODE) {
      state.dragZone.showDragZone = false;
    }

    if (mode === EditMode.WRITE_MODE) {
      state.previewNoteValue.isVisible = true;
    } else {
      state.previewNoteValue.isVisible = false;
    }
  },
  setPreviewNoteStyle(
    state: EditorState,
    position: { pulse: number, laneIndex: number },
  ) {
    state.previewNoteValue.pulse = position.pulse;
    state.previewNoteValue.laneIndex = position.laneIndex;
  },
};


type EditorActions = {
  state: EditorState,
  getters: EditorGetters,
  commit: Function,
  dispatch: Function,
};

const actions: ActionTree<EditorState, RootState> = {
  addNote({ state, getters, commit }: EditorActions, coord: Coord) {
    
  },
  setPreviewNote({ state, getters, commit }: EditorActions, coord: Coord) {
    const yPixelToGridPulse = getters.yPixelToGridPulse;

    const pulse = yPixelToGridPulse(coord[1]);
    const laneIndex = binarySearchIndex(getters.laneXList, laneX => laneX >= coord[0]) - 1;
    
    if (laneIndex != null) {
      commit('setPreviewNoteStyle', { pulse, laneIndex });
    }
  },
};


export const editor: Module<EditorState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    theme,
    panel,
    note,
    score,
  },
};
