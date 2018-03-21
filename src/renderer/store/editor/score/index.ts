/**  
 * editor/score - score settings
 */

import {
  Beat, EventType, NoteIndex, NoteType, ScoreMetaData,
  SoundIndex, SoundSprite, SoundType, TimeSignature,
} from '../../../utils/scoreTypes';
import { NoteFactory, NoteManager } from '../../../utils/noteUtil';
import Fraction from '../../../utils/fraction';
import { RootState } from '../..';

import * as _ from 'lodash';
import R from 'ramda';
import { MutationTree, ActionTree, GetterTree, Module } from 'vuex';
/**
 * measureNo is zero-starting
 * [measureNo, meterPulseLength, measurePulsePosition]
 */
export type MeasurePulse = [number, number, number];
export type MeasureFrac = [number, Fraction, Fraction];
export const MP_NO = 0;
export const MP_LEN = 1;
export const MP_POS = 2;

export interface ScoreState {
  metaData: ScoreMetaData,
  noteManager: NoteManager,
  soundTypes: { [index: string]: SoundType }, // 'AA'-'ZZ': SoundType
  noteTypes: { [index: string]: NoteType },
  eventTypes: { [index: string]: EventType },
  soundSprites: { [index: string]: SoundSprite },
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


export interface ScoreGetters {
  resolution: number,
  bpm: number,
  maxMeasureNo: number,
  maxPulse: number,
  pulseToTime: (pulse: number) => number,
  timeToPulse: (time: number) => number,
  timeSignaturePulseList: Array<MeasurePulse>,
  measurePulseList: Array<MeasurePulse>,
  measureFracList: Array<[number, Fraction, Fraction]>,
  pulseToMeasureNo: (pulse: number) => number,
};

const getters: GetterTree<ScoreState, RootState> = {
  resolution(state: ScoreState): number {
    return state.noteManager.resolution;
  },

  bpm(state: ScoreState): number {
    return state.noteManager.bpm;
  },

  maxMeasureNo(state: ScoreState, getters: ScoreGetters): number {
    const maxTS = _.maxBy(state.noteManager.timeSignatures, 'measureNo');
    if (maxTS === undefined) {
      return 5;
    }
    const maxTSMeasure = maxTS.measureNo;
    const lastNote = state.noteManager.getLastNote();
    const lastNoteMeasureNo: number = lastNote ? getters.pulseToMeasureNo(lastNote.time.pulse) : 0;

    return R.max(maxTSMeasure + 5, lastNoteMeasureNo + 5);
  },

  maxPulse(state: ScoreState, getters: ScoreGetters): number {
    const { measurePulseList } = getters;
    const lastPulse: MeasurePulse | undefined = _.last(measurePulseList);
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

    const noLenList: Array<[number, number]> = _.zip(measureNoList, meterLenList) as Array<[number, number]>;
    const noLenTwins = R.aperture(2, noLenList); // Array<[[no, len], [no, len]]>;

    const meterPosList: Array<number> = R.scan(
      (acc, [prev, next]) => acc + ((next[MP_NO] - prev[MP_NO]) * prev[MP_LEN]), 0, noLenTwins);

    return R.zipWith(([no, len], pos) => [no, len, pos] as MeasurePulse, noLenList, meterPosList);
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
      [no, len.mulInt(resolution).value(), pos.mulInt(resolution).value()] as MeasurePulse);
  },

  measureFracList(state: ScoreState, getters: ScoreGetters): Array<MeasureFrac> {
    const maxMeasureNo = getters.maxMeasureNo;
    const timeSignatures = state.noteManager.timeSignatures;
    const measureNoList = timeSignatures.map(ts => ts.measureNo);
    const meterFracList = timeSignatures.map(ts => Fraction.ofArr(ts.meter));

    const noFracList: Array<[number, Fraction]> = _.zip(measureNoList, meterFracList) as Array<[number, Fraction]>;
    const noLenTwins = R.aperture(2, noFracList); // Array<[[no, frac], [no, frac]]>;

    const meterFracPosList: Array<Fraction> = R.scan(
      (acc, [prev, next]) => acc.add(prev[1].mulInt(next[0] - prev[0])),
      Fraction.ofInt(0),
      noLenTwins,
    );

    const tsFraclist: Array<MeasureFrac> =
      R.zipWith(([no, len], pos) => [no, len, pos] as MeasureFrac, noFracList, meterFracPosList);

    let lastFrac: MeasureFrac | undefined = R.last(tsFraclist);
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
          .map(no =>
            [no, prev[MP_LEN], prev[MP_POS].add(prev[MP_LEN].mulInt(no - prev[MP_NO]))] as MeasureFrac),
        R.aperture(2, tsFraclist),
      ));
  },

  pulseToMeasureNo(state: ScoreState, getters: ScoreGetters): (pulse: number) => number {
    return (pulse: number) => {
      const { measurePulseList } = getters;

      const pulsePred = (m: MeasurePulse) => (m[MP_POS] <= pulse);
      const rightMeasure: MeasurePulse | undefined = R.findLast(pulsePred, measurePulseList);

      if (rightMeasure) {
        const [no, len, pos] = rightMeasure;

        return no + Math.floor((pulse - pos) / len);
      }

      // pulse is non-negative number
      return Math.floor(pulse / measurePulseList[0][MP_LEN]);
    };
  },
};

const mutations: MutationTree<ScoreState> = {
  SET_MAIN_BPM(state: ScoreState, bpm: number) {
    state.noteManager.setMainBpm(bpm);
  },

  SET_TIME_SIGNATURE(state: ScoreState, timeSignature: TimeSignature) {
    // TODO: make this
  },

  SET_RESOLUTION(state: ScoreState, resolution: number) {
    state.noteManager.setResolution(resolution);
  },

  DELETE_NOTE(state: ScoreState, noteIndex: string) {
    state.noteManager.deleteNote(noteIndex);
  },
};

export const score: Module<ScoreState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
};
