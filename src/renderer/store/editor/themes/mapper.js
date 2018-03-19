// @flow
import { merge } from 'ramda';

import { defaultGridColor, defaultLaneStyle } from '@/utils/themeConst';
import type {
  GridColors, LaneStyleSettings, LaneStyleSettingPart,
  LaneStylePreset, LaneTheme, LaneStyles, LaneStylePart,
} from '@/utils/themeTypes';

const defaultLaneStylePreset: LaneStylePreset = {
  defaultStyle: defaultLaneStyle,
};

export function laneStateMapper(
  styleSetting: LaneStyleSettingPart,
  stylePreset: LaneStylePreset,
): LaneStylePart {
  const
    defaultStyle = stylePreset.defaultStyle ? stylePreset.defaultStyle : defaultLaneStyle,
    laneStyle = stylePreset[styleSetting[1]] ? stylePreset[styleSetting[1]] : {},
    mergedStyle = merge(defaultStyle, laneStyle),
    mergedOption = styleSetting[2] != null ? merge(mergedStyle, styleSetting[2]) : mergedStyle;

  return merge(mergedOption, { caption: styleSetting[0] });
}

export function laneStateListToTheme(
  laneStyleSettings: LaneStyleSettings,
  laneStylePreset: LaneStylePreset = defaultLaneStylePreset,
  gridColors: GridColors = defaultGridColor,
): LaneTheme {
  const mappedStyle: LaneStyles =
    laneStyleSettings.map(styleSetting => laneStateMapper(styleSetting, laneStylePreset));
  return {
    gridColors: merge(defaultGridColor, gridColors),
    laneStyles: mappedStyle,
  };
}
