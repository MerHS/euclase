import { state } from '@/store/editor/score';

describe('store/score', function () {
  let defaultState;

  beforeEach(function () {
    defaultState = state();
  });

  describe('mutations', function () {
    it('ADD_NOTE');
    it('DELETE_NOTE');
  });

  describe('PlayNote Lists', function () {
    beforeEach(function () {

    });

    it('playNoteList', function () {

    });

    it('allNoteList', function () {

    });

    it('musicNoteList', function () {

    });

    it('maxMeasureNo', function () {

    });
  });

  describe('Pulse <-> Measure', function () {
    beforeEach(function () {

    });

    it('timeSignaturePulseList', function () {

    });

    it('pulseToMeasureNo', function () {

    });
  });

  describe('Pulse <-> Time', function () {
    it('pulseToTime');
    it('timeToPulse');
  });
});
