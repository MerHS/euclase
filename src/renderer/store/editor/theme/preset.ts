import { LaneStylePreset, LaneStyleSettings, LaneTheme, LaneStyleSettingPart } from '../../../utils/types/themeTypes';
import { colorStr, transparent, cyan, red, defaultLaneStyle } from '../../../utils/themeConst';
import { laneStateListToTheme } from './mapper';

const iidxLaneStylePreset: LaneStylePreset = {
  defaultStyle: defaultLaneStyle,
  measure: {
    width: 52,
    editGroup: 2,
    noteColor: transparent,
    noteLabelColor: cyan,
    longNoteColor: transparent,
    longNoteLabelColor: cyan,
    laneBackgroundColor: transparent,
  },
  bpm: {
    width: 50,
    editGroup: 3,
    noteColor: transparent,
    noteLabelColor: red,
    longNoteColor: transparent,
    longNoteLabelColor: red,
    laneBackgroundColor: transparent,
  },
  stop: {
    width: 50,
    editGroup: 9,
    noteColor: transparent,
    noteLabelColor: red,
    longNoteColor: transparent,
    longNoteLabelColor: red,
    laneBackgroundColor: transparent,
  },
  bga: {
    width: 40,
    editGroup: 4,
    noteColor: colorStr(140, 215, 138),
    longNoteColor: colorStr(144, 211, 142),
  },
  poor: {
    width: 40,
    editGroup: 6,
    noteColor: colorStr(140, 215, 138),
    longNoteColor: colorStr(144, 211, 142),
  },
  layer: {
    width: 40,
    editGroup: 7,
    noteColor: colorStr(140, 215, 138),
    longNoteColor: colorStr(144, 211, 142),
  },
  division: {
    width: 5,
    editGroup: -1,
  },
  scratch: {
    width: 60,
    editGroup: 0,
    noteColor: colorStr(245, 89, 89),
    longNoteColor: colorStr(230, 104, 104),
    laneBackgroundColor: colorStr(191, 64, 64, 20),
  },
  whiteLane: {
    width: 40,
    editGroup: 0,
    noteColor: colorStr(170, 170, 170),
    longNoteColor: colorStr(192, 192, 192),
    laneBackgroundColor: colorStr(128, 128, 128, 40),
  },
  blueLane: {
    width: 30,
    editGroup: 0,
    noteColor: colorStr(98, 137, 255),
    longNoteColor: colorStr(114, 145, 239),
    laneBackgroundColor: colorStr(61, 61, 194, 21),
  },
};

// TODO: Mark as 1P
const iidxLane1P: LaneStyleSettings = [
  ['Measure', 'measure', null],
  ['BPM', 'bpm', null],
  ['STOP', 'stop', null],
  ['', 'division', null],
  ['A1', 'scratch', null],
  ['A2', 'whiteLane', null],
  ['A3', 'blueLane', null],
  ['A4', 'whiteLane', null],
  ['A5', 'blueLane', null],
  ['A6', 'whiteLane', null],
  ['A7', 'blueLane', null],
  ['A8', 'whiteLane', null],
  ['', 'division', null],
  ['BGA', 'bga', null],
  ['LAYER', 'layer', null],
  ['POOR', 'poor', null],
  ['', 'division', null],
  ['B1', 'defaultStyle', null],
  ['B2', 'defaultStyle', null],
  ['B3', 'defaultStyle', null],
  ['B4', 'defaultStyle', null],
  ['B5', 'defaultStyle', null],
  ['B6', 'defaultStyle', null],
  ['B7', 'defaultStyle', null],
  ['B8', 'defaultStyle', null],
  ['B9', 'defaultStyle', null],
  ['B10', 'defaultStyle', null],
  ['B11', 'defaultStyle', null],
  ['B12', 'defaultStyle', null],
  ['B13', 'defaultStyle', null],
  ['B14', 'defaultStyle', null],
  ['B15', 'defaultStyle', null],
];

const iidx1PTheme: LaneTheme = laneStateListToTheme(iidxLane1P, iidxLaneStylePreset);

export default {
  defaultTheme: iidx1PTheme,
  iidx1PTheme,
  // iidx2PTheme,
  // iidx5KTheme,
  // iidx10KTheme,
};
