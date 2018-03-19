/** @flow
 * editor/score - score settings
 */

import type {
  Beat, EventType, NoteIndex, NoteType, ScoreMetaData,
  SoundIndex, SoundSprite, SoundType, TimeSignature,
} from '@/utils/scoreTypes';
import { NoteFactory, NoteManager } from '@/utils/noteUtil';

import _ from 'lodash';
import R from 'ramda';
import Fraction from '@/utils/fraction';

/**
 * measureNo is zero-starting
 * [measureNo, meterPulseLength, measurePulsePosition]
 */
export type MeasurePulse = [number, number, number];
export const [MP_NO, MP_LEN, MP_POS] = [0, 1, 2];


export type ScoreState = {
  metaData: ScoreMetaData,
  noteManager: NoteManager,
  soundTypes: { [SoundIndex]: SoundType }, // 'AA'-'ZZ': SoundType
  noteTypes: { [string]: NoteType },
  eventTypes: { [string]: EventType },
  soundSprites: { [string]: SoundSprite },
  noteFactory: NoteFactory,
}

export const state: () => ScoreState = () => ({
  metaData: {
    title: 'New Project',
    artist: '',
    extra: {},
  },
  noteManager: new NoteManager(120, 32 * 3 * 5),
  soundTypes: {},
  noteTypes: {}, // TODO: Make Default BMS NoteTypes / EventTypes
  eventTypes: {},
  soundSprites: {},
  noteFactory: new NoteFactory(),
});


export type ScoreGetters = {
  resolution: number,
  bpm: number,
  maxMeasureNo: number,
  maxPulse: number,
  pulseToTime: number => number,
  timeToPulse: number => number,
  timeSignaturePulseList: Array<MeasurePulse>,
  measurePulseList: Array<MeasurePulse>,
  measureFracList: Array<[number, Fraction, Fraction]>,
  pulseToMeasureNo: number => number,
};

const getters = {
  resolution(state: ScoreState): number {
    return state.noteManager.resolution;
  },

  bpm(state: ScoreState): number {
    return state.noteManager.bpm;
  },

  maxMeasureNo(state: ScoreState, getters: ScoreGetters): number {
    const maxTSMeasure = _.maxBy(state.noteManager.timeSignatures, 'measureNo').measureNo;
    const lastNote = state.noteManager.getLastNote();
    const lastNoteMeasureNo: number = lastNote ? getters.pulseToMeasureNo(lastNote.time.pulse) : 0;

    return R.max(maxTSMeasure + 5, lastNoteMeasureNo + 5);
  },

  maxPulse(state: ScoreState, getters: ScoreGetters): number {
    const { measurePulseList } = getters;
    const lastPulse: ?MeasurePulse = _.last(measurePulseList);
    return lastPulse ? lastPulse[MP_LEN] + lastPulse[MP_POS] : 0;
  },

  /**
   * return list of [Measure Number, Pulse Length of Meter, Pulse Position of this Measure]
   * @param state: ScoreState
   * @param getters: ScoreGetters
   * @return MeasurePulse list of each TimeSignatures
   */
  timeSignaturePulseList(state: ScoreState, getters: ScoreGetters): Array<MeasurePulse> {
    const timeSignatures = state.noteManager.timeSignatures;
    const measureNoList = timeSignatures.map(ts => ts.measureNo);
    const meterLenList = timeSignatures.map(
      ts => (ts.meter[0] * getters.resolution) / ts.meter[1],
    );

    const noLenList: Array<[number, number]> = _.zip(measureNoList, meterLenList);
    const noLenTwins = R.aperture(2, noLenList); // Array<[[no, len], [no, len]]>;

    const meterPosList: Array<number> = R.scan(
      (acc, [prev, next]) => acc + ((next[MP_NO] - prev[MP_NO]) * prev[MP_LEN]), 0, noLenTwins);

    return R.zipWith(([no, len], pos) => [no, len, pos], noLenList, meterPosList);
  },

  measurePulseList(state: ScoreState, getters: ScoreGetters): Array<MeasurePulse> {
    // const { timeSignaturePulseList, maxMeasureNo } = getters;
    //
    // let lastPulse: ?MeasurePulse = R.last(timeSignaturePulseList);
    // if (!lastPulse) {
    //   throw new Error('measurePulseList returned empty list');
    // }
    //
    // const pulseList = [...timeSignaturePulseList];
    // if (lastPulse[MP_NO] < maxMeasureNo) {
    //   const tempPulse = lastPulse;
    //   lastPulse = [0, 0, 0];
    //   lastPulse[MP_NO] = maxMeasureNo;
    //   lastPulse[MP_LEN] = tempPulse[MP_LEN];
    //   lastPulse[MP_POS] = tempPulse[MP_POS] +
    //     (tempPulse[MP_LEN] * (maxMeasureNo - tempPulse[MP_NO]));
    //   pulseList.push(lastPulse);
    // }
    //
    // return _.flatten(
    //   R.map(
    //     ([prev, next]) => R.range(prev[MP_NO], next[MP_NO])
    //       .map(no => [no, prev[MP_LEN], prev[MP_POS] + (prev[MP_LEN] * (no - prev[MP_NO]))]),
    //     R.aperture(2, pulseList),
    //   ));
    const resolution = getters.resolution;
    const measureFracList = getters.measureFracList;

    return measureFracList.map(([no, len, pos]) =>
      [no, len.mulInt(resolution).value(), pos.mulInt(resolution).value()]);
  },

  measureFracList(state: ScoreState, getters: ScoreGetters): Array<[number, Fraction, Fraction]> {
    const maxMeasureNo = getters.maxMeasureNo;
    const timeSignatures = state.noteManager.timeSignatures;
    const measureNoList = timeSignatures.map(ts => ts.measureNo);
    const meterFracList = timeSignatures.map(ts => Fraction.ofArr(ts.meter));

    const noFracList: Array<[number, Fraction]> = _.zip(measureNoList, meterFracList);
    const noLenTwins = R.aperture(2, noFracList); // Array<[[no, frac], [no, frac]]>;

    const meterFracPosList: Array<Fraction> = R.scan(
      (acc, [prev, next]) => acc.add(prev[1].mulInt(next[0] - prev[0])),
      Fraction.ofInt(0),
      noLenTwins,
    );

    const tsFraclist: Array<[number, Fraction, Fraction]> =
      R.zipWith(([no, len], pos) => [no, len, pos], noFracList, meterFracPosList);

    let lastFrac: ?[number, Fraction, Fraction] = R.last(tsFraclist);
    if (!lastFrac) {
      throw new Error('measureFracList returned empty list');
    }

    if (lastFrac[MP_NO] < maxMeasureNo) {
      const tempFrac = lastFrac;
      lastFrac = [0, Fraction.ofInt(0), Fraction.ofInt(0)];
      lastFrac[MP_NO] = maxMeasureNo;
      lastFrac[MP_LEN] = tempFrac[MP_LEN];
      lastFrac[MP_POS] =
        tempFrac[MP_POS].add(tempFrac[MP_LEN].mulInt(maxMeasureNo - tempFrac[MP_NO]));
      tsFraclist.push(lastFrac);
    }

    return _.flatten(
      R.map(
        ([prev, next]) => R.range(prev[MP_NO], next[MP_NO])
          .map(no => [no, prev[MP_LEN], prev[MP_POS].add(prev[MP_LEN].mulInt(no - prev[MP_NO]))]),
        R.aperture(2, tsFraclist),
      ));
  },

  pulseToMeasureNo(state: ScoreState, getters: ScoreGetters): number => number {
    return (pulse: number) => {
      const { measurePulseList } = getters;

      const pulsePred = (m: MeasurePulse) => (m[MP_POS] <= pulse);
      const rightMeasure: ?MeasurePulse = R.findLast(pulsePred, measurePulseList);

      if (rightMeasure) {
        const [no, len, pos] = rightMeasure;

        return no + Math.floor((pulse - pos) / len);
      }

      // pulse is non-negative number
      return Math.floor(pulse / measurePulseList[0][MP_LEN]);
    };
  },
};

const mutations = {
  SET_MAIN_BPM(state: ScoreState, bpm: number) {
    state.noteManager.setMainBpm(bpm);
  },

  SET_TIME_SIGNATURE(state: ScoreState, timeSignature: TimeSignature) {
    // TODO: make this
  },

  SET_RESOLUTION(state: ScoreState, resolution: number) {
    state.noteManager.setResolution(resolution);
  },

  // ADD_PLAY_NOTE(state: ScoreState, props: PlayNoteProps, time: NoteTime, extra: Object) {
  //   state.noteManager.setNote(state.noteFactory.makeNote(props, time));
  // },
  //
  // ADD_SCORE_NOTE(state: ScoreState, props: ScoreNoteProps, time: NoteTime, extra: Object) {
  //   state.noteManager.setNote(state.noteFactory.makeNote(props, time));
  // },what

  // UPDATE_NOTE_EXTRA(state: ScoreState, noteIndex: NoteIndex, extra: Object) {
  //
  // },

  DELETE_NOTE(state: ScoreState, noteIndex: string) {
    state.noteManager.deleteNote(noteIndex);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
