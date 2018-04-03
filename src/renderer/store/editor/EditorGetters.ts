import { Coord, NoteIndex, Rect, EditMode, Note, LaneIndex } from '../../utils/types/scoreTypes';
import Fraction from '../../utils/fraction';
import { RootState } from '..';
import { EditorState } from '.';

import { MP_LEN, MP_POS, ScoreGetters, MeasureFracPos, MeasurePulsePos, ScoreState } from './score';
import { ThemeState, ThemeGetters } from './theme';
import { PanelState  } from './panel';
import { NoteState } from './note';

import * as R from 'ramda';
import { GetterTree } from 'vuex';


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

interface EditorGetterState extends EditorState {
  theme: ThemeState;
  panel: PanelState;
  note: NoteState;
  score: ScoreState;
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
      measurePulsePosList: Array<MeasurePulsePos> = getters.measurePulsePosList,
      pulseToYPixel: (pulse: number) => number = getters.pulseToYPixel;

    return measurePulsePosList.map(pulse => pulseToYPixel(pulse[MP_POS]));
  },
  mainGridYList(_state: EditorState, getters: EditorGetters): CanvasInfo['mainGridYList'] {
    const state = _state as EditorGetterState;
    const
      mainFrac = new Fraction(1, state.panel.mainGrid),
      resolution: number = getters.resolution,
      measureFracPosList: Array<MeasureFracPos> = getters.measureFracPosList,
      pulseToYPixel: (pulse: number) => number = getters.pulseToYPixel;
    
    // R.chain === _.flatMap
    return R.chain(([no, len, pos]) => {
      const gridCount = len.div(mainFrac).floorValue();

      return R.range(1, gridCount)
        .map(n => pos.add(mainFrac.mulInt(n)));
    }, measureFracPosList).map(
      (frac: Fraction) => pulseToYPixel(frac.mulInt(resolution).value()),
    );
  },
  subGridYList(_state: EditorState, getters: EditorGetters): CanvasInfo['subGridYList'] {
    const state = _state as EditorGetterState;
    const
      subFrac = new Fraction(1, state.panel.subGrid),
      resolution: number = getters.resolution,
      measureFracPosList: Array<MeasureFracPos> = getters.measureFracPosList,
      pulseToYPixel: (pulse: number) => number = getters.pulseToYPixel;

    // R.chain === _.flatMap
    return R.chain(([no, len, pos]) => {
      const gridCount = len.div(subFrac).floorValue();

      return R.range(1, gridCount)
        .map(n => pos.add(subFrac.mulInt(n)));
    }, measureFracPosList).map(
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
  yPixelToGridPulse(_state: EditorState, getters: EditorGetters): (yPixel: number) => number {
    const state = _state as EditorGetterState;
    const
      measurePulsePosList = getters.measurePulsePosList,
      measurePulseList = measurePulsePosList.map(mp => mp[MP_POS]),
      yPixelToPulse = getters.yPixelToPulse,
      subGridPulse = getters.resolution / state.panel.subGrid;

    return (yPixel: number) => {
      const yPulse = yPixelToPulse(yPixel);
      
      let measureIndex = measurePulseList.binaryFindFloorIndex(yPulse);
      if (measureIndex < 0) {
        measureIndex = 0;
      }

      const measurePulsePos = measurePulsePosList[measureIndex];
      const yPulseRemainder = yPulse - measurePulsePos[MP_POS];
      const gridPulse =
        measurePulsePos[MP_POS] + subGridPulse * Math.floor(yPulseRemainder / subGridPulse);

      return gridPulse;
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

