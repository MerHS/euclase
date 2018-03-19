// @flow

export type ColorString = string;

export type GridColors = {
  lineWidth: number,
  selectionColor: ColorString,
  backgroundColor: ColorString,
  verticalLineColor: ColorString,
  sectionBorderColor: ColorString,
  mainGridColor: ColorString,
  subGridColor: ColorString,
  captionColor: ColorString,
  sectionNumberColor: ColorString,
};

export type LaneStyleOption = {
  width?: number,
  caption?: string,
  editGroup?: number,
  isVisible?: boolean,
  noteColor?: ColorString,
  noteLabelColor?: ColorString,
  longNoteColor?: ColorString,
  longNoteLabelColor?: ColorString,
  laneBackgroundColor?: ColorString,
}

export type LaneStylePart = {
  width: number,
  caption: string,
  editGroup: number,
  isVisible: boolean,
  noteColor: ColorString,
  noteLabelColor: ColorString,
  longNoteColor: ColorString,
  longNoteLabelColor: ColorString,
  laneBackgroundColor: ColorString,
}

export type LaneStylePreset = {
  defaultStyle: LaneStylePart,
  [string]: LaneStyleOption,
};
export type LaneStyleSettingPart = [string, string, ?Object];
export type LaneStyleSettings = Array<LaneStyleSettingPart>;
export type LaneStyles = Array<LaneStylePart>;

export type LaneTheme = {
  gridColors: GridColors,
  laneStyles: LaneStyles,
};
