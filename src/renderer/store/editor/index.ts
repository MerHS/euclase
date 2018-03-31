/* eslint-disable no-unused-vars */

import { Coord, NoteIndex, Rect, EditMode } from '../../utils/scoreTypes';
import { MP_LEN, MP_POS, ScoreGetters, MeasureFraction } from './score';
import { binarySearch, mergeSortedList } from '../../utils/noteUtil';
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

export interface EditorState {
  editMode: EditMode;
  dragZone: DragZoneState;
  selectedNotes: Array<NoteIndex>;
}

interface EditorGetterState extends EditorState {
  theme: ThemeState;
  panel: PanelState;
  notes: NoteState;
  score: ScoreState;
}

export const state: EditorState = {
  editMode: EditMode.SELECT_MODE,
  dragZone: {
    isExclusive: false,
    showDragZone: false,
    dragStartPos: [0, 0],
    dragRect: [[0, 0], [0, 0]],
  },
  selectedNotes: [],
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
}

export const getters: GetterTree<EditorState, RootState> = {
  laneXList(_state: EditorState): CanvasInfo['laneXList'] {
    const state = _state as EditorGetterState;
    const horizontalZoom = state.panel.horizontalZoom;
    const laneStyles = state.theme.currentTheme.laneStyles;
    return R.scan((sum, style) => sum + style.width * horizontalZoom, 0, laneStyles);
  },
  laneEditableList(state: EditorState, getters: Object): CanvasInfo['laneEditableList'] {
    return [];
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
      const gridPixel = binarySearch(subGridYList, pixel => pixel <= yPixel);

      return (gridPixel == null) ? 0 : yPixelToPulse(gridPixel);
    };
  },
};


const mutations: MutationTree<EditorState> = {
  dragStart(state: EditorState, payload: { coord: Coord, isExclusive: boolean }) {
    if (state.editMode === EditMode.SELECT_MODE) {
      state.dragZone.showDragZone = true;
    }
    state.dragZone.dragStartPos = [payload.coord[0], payload.coord[1]];
    state.dragZone.dragRect = [[payload.coord[0], payload.coord[1]], [0, 0]];
    state.dragZone.isExclusive = payload.isExclusive;
  },
  dragMove(state: EditorState, coord: Coord) {
    const [fromX, fromY] = state.dragZone.dragStartPos; // bottom-left point 
    const [toX, toY] = coord; // top-right point
    
    const x = (fromX < toX) ? fromX : toX;
    const y = (fromY < toY) ? fromY : toY;
    const w = (fromX < toX) ? (toX - fromX) : (fromX - toX);
    const h = (fromY < toY) ? (toY - fromY) : (fromY - toY);

    state.dragZone.dragRect = [[x, y], [w, h]];
  },
  dragEnd(state: EditorState, coord: Coord) {
    state.dragZone.showDragZone = false;
  },
  changeMode(state: EditorState, mode: EditMode) {
    state.editMode = mode;
  },
};


type EditorActions = {
  state: EditorState,
  getters: EditorGetters,
  commit: Function,
  dispatch: Function,
};

// function assignStateAndSetDirty(
//   commit: Function, mutationPath: string, payload: Partial<PanelState>,
// ) {
//   commit(mutationPath, payload);
//   for (let i = 0; i < PANEL_DIRTY_PROPS.length; i++) {
//     const panelProp = PANEL_DIRTY_PROPS[i];
//     if (panelProp in payload) {
//       commit('setPanelDirty', true);
//       break;
//     }
//   }
// }

const actions: ActionTree<EditorState, RootState> = {
  addNote({ state, getters, commit }: EditorActions, coord: Coord) {
    
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
