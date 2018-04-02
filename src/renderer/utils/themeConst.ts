//  
import { ColorString, GridColors, LaneStylePart } from './types/themeTypes';

// 'rgba(1, 2, 3, 4)' => ' 4'
const alphaNumber = /,([^,]+)\)/;

function clamp(n: number, min: number, max: number): number {
  n = Math.round(n);
  // eslint-disable-next-line no-nested-ternary
  return n < min ? min : (n > max ? max : n);
}

export function colorStr(r: number, g: number, b: number, a?: number): ColorString {
  r = clamp(r, 0, 255);
  g = clamp(g, 0, 255);
  b = clamp(b, 0, 255);
  return (a === undefined) ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}

export const black = colorStr(0, 0, 0);
export const white = colorStr(255, 255, 255);
export const transparent = colorStr(0, 0, 0, 0);
export const red = colorStr(255, 0, 0);
export const green = colorStr(0, 255, 0);
export const blue = colorStr(0, 0, 255);
export const cyan = colorStr(0, 255, 255);

export const defaultGridColor: GridColors = {
  lineWidth: 0.5,
  selectionColor: colorStr(255, 255, 255, 192),
  backgroundColor: black,
  verticalLineColor: colorStr(110, 110, 110),
  sectionBorderColor: colorStr(110, 110, 110),
  mainGridColor: colorStr(58, 58, 58, 200),
  subGridColor: colorStr(58, 58, 58, 125),
  captionColor: green,
  sectionNumberColor: cyan,
};

export const defaultLaneStyle: LaneStylePart = {
  caption: 'NOTE',
  width: 40,
  editGroup: 0,
  isVisible: true,
  noteColor: colorStr(220, 128, 128),
  noteLabelColor: white,
  longNoteColor: colorStr(220, 133, 133),
  longNoteLabelColor: white,
  laneBackgroundColor: transparent,
};
