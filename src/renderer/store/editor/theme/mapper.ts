//  
import R from 'ramda';

import { defaultGridColor, defaultLaneStyle } from '../../../utils/themeConst';
import {
  GridColors, LaneStyleSettings, LaneStyleSettingPart,
  LaneStylePreset, LaneTheme, LaneStyles, LaneStylePart,
} from '../../../utils/types/themeTypes';

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
    mergedStyle = R.merge(defaultStyle, laneStyle),
    mergedOption = styleSetting[2] != null ? R.merge(mergedStyle, styleSetting[2]) : mergedStyle;

  return R.merge(mergedOption, { caption: styleSetting[0] });
}

export function laneStateListToTheme(
  laneStyleSettings: LaneStyleSettings,
  laneStylePreset: LaneStylePreset = defaultLaneStylePreset,
  gridColors: GridColors = defaultGridColor,
): LaneTheme {
  const mappedStyle: LaneStyles =
    laneStyleSettings.map(styleSetting => laneStateMapper(styleSetting, laneStylePreset));
  return {
    gridColors: R.merge(defaultGridColor, gridColors),
    laneStyles: mappedStyle,
  };
}
