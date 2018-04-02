/**  
 * editor/theme - style settings of timeline
 * This state should be able to import and export.
 */
import R from 'ramda';
import { GetterTree, Module } from 'vuex';

import { GridColors, LaneStyles, LaneTheme } from '../../../utils/types/themeTypes';
import themePresets from './preset';
import { RootState } from '../..';

export interface ThemeState {
  currentTheme: LaneTheme,
  usePreset: boolean
}

export const state: ThemeState = {
  currentTheme: themePresets.defaultTheme,
  usePreset: true,
};

export interface ThemeGetters {
  currGridColors: GridColors,
  currLaneStyles: LaneStyles,
  totalWidth: number,
}

export const getters: GetterTree<ThemeState, RootState> = {
  currGridColors(state: ThemeState): GridColors {
    return state.currentTheme.gridColors;
  },
  currLaneStyles(state: ThemeState): LaneStyles {
    return state.currentTheme.laneStyles;
  },
  totalWidth(state: ThemeState, getters: { currLaneStyles: LaneStyles }): number {
    return R.sum(R.map(R.prop('width'), getters.currLaneStyles));
  },
};

export const theme: Module<ThemeState, RootState> = {
  state,
  getters,
};
