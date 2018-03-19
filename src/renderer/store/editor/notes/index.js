/** @flow
 * editor/note - default / custom note settings
 * This state should be able to import and export.
 */
import type { ColorString } from '@/utils/themeTypes';
import { green, red, transparent, cyan } from '../../../utils/themeConst';


export type NoteState = {
  noteHeight: number,
  hiddenNoteOpacity: number,
  borderColor: ColorString,
  borderColorOnMouseOver: ColorString,
  borderColorOnSelection: ColorString,
  borderColorOnMouseOverLN: ColorString,
};

const state = {
  noteHeight: 10,
  hiddenNoteOpacity: 0.5,
  borderColor: transparent,
  borderColorOnMouseOver: green,
  borderColorOnSelection: red,
  borderColorOnMouseOverLN: cyan,
};

export default {
  namespaced: true,
  state,
};
