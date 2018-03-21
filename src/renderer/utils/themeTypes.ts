export type ColorString = string;

export interface GridColors {
  lineWidth: number;
  selectionColor: ColorString;
  backgroundColor: ColorString;
  verticalLineColor: ColorString;
  sectionBorderColor: ColorString;
  mainGridColor: ColorString;
  subGridColor: ColorString;
  captionColor: ColorString;
  sectionNumberColor: ColorString;
};

export interface LaneStyleOption {
  width?: number;
  caption?: string;
  editGroup?: number;
  isVisible?: boolean;
  noteColor?: ColorString;
  noteLabelColor?: ColorString;
  longNoteColor?: ColorString;
  longNoteLabelColor?: ColorString;
  laneBackgroundColor?: ColorString;
}

export interface LaneStylePart {
  width: number;
  caption: string;
  editGroup: number;
  isVisible: boolean;
  noteColor: ColorString;
  noteLabelColor: ColorString;
  longNoteColor: ColorString;
  longNoteLabelColor: ColorString;
  laneBackgroundColor: ColorString;
}

export interface LaneStylePreset {
  defaultStyle: LaneStylePart;
  [styleOption: string]: LaneStyleOption;
};
export type LaneStyleSettingPart = [string, string, Object | null];
export type LaneStyleSettings = Array<LaneStyleSettingPart>;
export type LaneStyles = Array<LaneStylePart>;

export interface LaneTheme {
  gridColors: GridColors;
  laneStyles: LaneStyles;
};
