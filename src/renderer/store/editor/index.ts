/* eslint-disable no-unused-vars */

import { Coord, NoteIndex, Rect, EditMode } from '../../utils/scoreTypes';
import { MP_LEN, MP_POS, ScoreGetters, MeasureFraction } from './score';
import { binarySearch, mergeSortedList } from '../../utils/noteUtil';
import Fraction from '../../utils/fraction';
import { RootState } from '..';

import { theme, ThemeState, ThemeGetters } from './theme';
import { panel, PanelState, PANEL_DIRTY_PROPS  } from './panel';
import { note, NoteState } from './note';
import { score, MeasurePulse, ScoreState } from './score';
import * as R from 'ramda';
import { MutationTree, ActionTree, GetterTree, Module } from 'vuex';

export interface DragZoneState {
  isDragging: boolean;
  isExclusive: boolean; // ctrl + drag
  dragRect: Rect;
}

export interface EditorState {
  isPanelDirty: boolean;
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
  isPanelDirty: false,
  editMode: EditMode.SELECT_MODE,
  dragZone: {
    isDragging: false,
    isExclusive: false,
    dragRect: [[0, 0], [0, 0]],
  },
  selectedNotes: [],
};

export interface CanvasInfo {
  widthPixel: number;
  heightPixel: number;
  laneXList: Array<number>;
  laneEditableList: Array<boolean>;
  editGroupList: Array<number>;
  panelYList: Array<number>;
  mainGridYList: Array<number>;
  subGridYList: Array<number>;
  gridYList: Array<number>;
}

export interface EditorGetters extends CanvasInfo, ScoreGetters, ThemeGetters {
  yPixelToGridPulse: (yPixel: number) => number;
  yPixelToPulse: (yPixel: number) => number;
  pulseToYPixel: (pulse: number) => number;
  canvasInfo: CanvasInfo;
}

/*
type NoteRenderInfo
들어가야 할 것 :
depends on: noteHeight / laneX / laneGroup / timeSignatures / notes
 */

export const getters: GetterTree<EditorState, RootState> = {
  laneXList(_state: EditorState): CanvasInfo['laneXList'] {
    const state = _state as EditorGetterState;
    const laneStyles = state.theme.currentTheme.laneStyles;
    return R.scan((sum, style) => sum + style.width, 0, laneStyles);
  },
  laneEditableList(state: EditorState, getters: Object): CanvasInfo['laneEditableList'] {
    return [];
  },
  editGroupList(state: EditorState): CanvasInfo['editGroupList'] {
    return [];
  },
  panelYList(
    state: EditorState, getters: EditorGetters,
  ): CanvasInfo['panelYList'] {
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
  gridYList(state: EditorState, getters: EditorGetters): CanvasInfo['gridYList'] {
    const mainGridYList = getters.mainGridYList;
    const subGridYList = getters.subGridYList;

    return mergeSortedList(mainGridYList, subGridYList, (a, b) => a < b);
  },
  widthPixel(_state: EditorState, getters: EditorGetters): CanvasInfo['widthPixel'] {
    const state = _state as EditorGetterState;
    const
      totalWidth: number = getters.totalWidth,
      verticalZoom = state.panel.verticalZoom;

    return totalWidth * verticalZoom;
  },
  heightPixel(_state: EditorState, getters: EditorGetters): CanvasInfo['heightPixel'] {
    const state = _state as EditorGetterState;
    const
      resolution: number = getters.resolution,
      maxPulse: number = getters.maxPulse,
      defaultHeight = state.panel.defaultHeight,
      horizontalZoom = state.panel.horizontalZoom;

    return defaultHeight * horizontalZoom * (maxPulse / resolution);
  },
  canvasInfo(state: EditorState, getters: EditorGetters): CanvasInfo {
    const { laneXList, laneEditableList, editGroupList, panelYList,
      mainGridYList, subGridYList, gridYList, widthPixel, heightPixel } = getters;

    return {
      laneXList,
      laneEditableList,
      editGroupList,
      panelYList,
      mainGridYList,
      subGridYList,
      gridYList,
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
  noteRenderInfo(state: EditorState): Array<Object> {
    // TODO: Draw By Layers
    return [];
  },
  yPixelToGridPulse(state: EditorState, getters: EditorGetters): (yPixel: number) => number {
    const
      gridYList = getters.gridYList,
      yPixelToPulse = getters.yPixelToPulse;

    return (yPixel: number) => {
      const gridPixel = binarySearch(gridYList, pixel => pixel <= yPixel);

      return (gridPixel == null) ? 0 : yPixelToPulse(gridPixel);
    };
  },
};


const mutations: MutationTree<EditorState> = {
  setPanelDirty(state: EditorState, isPanelDirty: boolean) {
    state.isPanelDirty = isPanelDirty;
  },
  DRAGZONE_START(state: EditorState, option: any) {

  },
  DRAGZONE_MOVE(state: EditorState) {

  },
  DRAGZONE_END(state: EditorState) {

  },
  CHANGE_MODE(state: EditorState, mode: EditMode) {
    state.editMode = mode;
  },
};


type EditorActions = {
  state: EditorState,
  getters: EditorGetters,
  commit: Function,
  dispatch: Function,
};

function assignStateAndSetDirty(
  commit: Function, mutationPath: string, payload: Partial<PanelState>,
) {
  commit(mutationPath, payload);
  for (let i = 0; i < PANEL_DIRTY_PROPS.length; i++) {
    const panelProp = PANEL_DIRTY_PROPS[i];
    if (panelProp in payload) {
      commit('setPanelDirty', true);
      break;
    }
  }
}

const actions: ActionTree<EditorState, RootState> = {
  addNote({ state, getters, commit }: EditorActions, coord: Coord) {
    
  },
  assignPanelState({ state, commit }: EditorActions, payload: Partial<PanelState>) {
    assignStateAndSetDirty(commit, 'assignState', payload);
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
