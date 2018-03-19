/** @flow
 * editor/timeline - style settings of timeline
 * This state should be able to import and export.
 */
import { map, prop, sum } from 'ramda';

import type { GridColors, LaneStyles, LaneTheme } from '@/utils/themeTypes';
import themePresets from './preset';

export type ThemeState = {
  currentTheme: LaneTheme,
  usePreset: boolean
};

export const state: ThemeState = {
  currentTheme: themePresets.defaultTheme,
  usePreset: true,
};

export const getters = {
  currGridColors(state: ThemeState): GridColors {
    return state.currentTheme.gridColors;
  },
  currLaneStyles(state: ThemeState): LaneStyles {
    return state.currentTheme.laneStyles;
  },
  totalWidth(state: ThemeState, getters: { currLaneStyles: LaneStyles }): number {
    return sum(map(prop('width'), getters.currLaneStyles));
  },
};

export default {
  namespaced: true,
  state,
  mutations: {
    // setLaneOrder(state, payload) {
    //
    // },
  },
  getters,
};
