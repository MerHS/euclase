import { BPMNote, Note, NoteIndex, StopNote, TimeSignature, TrackIndex,
  EventNoteProps, MusicNoteProps, PlayNote, PlayNoteProps } from './scoreTypes';

import * as _ from 'lodash';

export function binarySearchIndex<T>(list: Array<T>, matcher: (item: T) => boolean): number {
  let
    start = 0,
    end = list.length,
    index = Math.floor((start + end) / 2);

  while (start < end) {
    if (matcher(list[index])) {
      end = index;
    } else {
      start = index + 1;
    }

    index = Math.floor((start + end) / 2);
  }

  return index >= list.length ? -1 : index;
}
export function binarySearchItemIndex<T>(list: Array<T>, item: T): number {
  return binarySearchIndex(list, testItem => testItem === item);
}

export function binarySearch<T>(list: Array<T>, matcher: (item: T) => boolean): T | undefined {
  const index = binarySearchIndex(list, matcher);

  return index < 0 ? undefined : list[index];
}

export function mergeSortedList<T>(
  la: Array<T>, lb: Array<T>, comparator: (item1: T, item2: T) => boolean,
): Array<T> {
  const list: Array<T> = [];

  let
    ia = 0,
    ib = 0,
    lastItem;
  while (ia < la.length && ib < lb.length) {
    const
      itemA = la[ia],
      itemB = lb[ib];
    if (comparator(itemA, itemB)) {
      if (lastItem !== itemA) {
        list.push(itemA);
        lastItem = itemA;
      }
      ia += 1;
    } else {
      if (lastItem !== itemB) {
        lastItem = itemB;
        list.push(itemB);
      }
      ib += 1;
    }
  }

  if (ia < la.length) {
    for (; ia < la.length; ia += 1) {
      if (lastItem !== la[ia]) {
        list.push(la[ia]);
        lastItem = la[ia];
      }
    }
  } else if (ib < lb.length) {
    for (; ib < lb.length; ib += 1) {
      if (lastItem !== lb[ib]) {
        list.push(lb[ib]);
        lastItem = lb[ib];
      }
    }
  }

  return list;
}

export class NoteFactory {
  nextIndex: number;
  currTrack: TrackIndex;
  musicNotePropTemplate: MusicNoteProps;
  eventNotePropTemplate: EventNoteProps;

  constructor() {
    this.nextIndex = 0;
    this.currTrack = '';
    this.musicNotePropTemplate = new MusicNoteProps();
    this.eventNotePropTemplate = new EventNoteProps();
  }

  getNextIndex(props: PlayNoteProps): NoteIndex {
    const index = `${props.propType}${this.nextIndex}`;
    this.nextIndex += 1;
    return index;
  }

  // makeNote(props: PlayNoteProps, pos: NoteTime): PlayNote {
  //   const index = this.getNextIndex(props);
  //   const factoryValue: Object = { index, props, pos };
  //   let newNote: PlayNote;
  //
  //   if (props instanceof MusicNoteProps) {
  //     newNote = this.musicNoteFactory(factoryValue);
  //   } else if (props instanceof EventNoteProps) {
  //     newNote = this.eventNoteFactory(factoryValue);
  //   } else {
  //     throw Error(`NoteFactory getNote Failed: not compatible note type
  //       noteProps ${JSON.stringify(props)}`);
  //   }
  //
  //   return newNote;
  // }
}

export class NoteManager {
  bpm: number;
  resolution: number;
  allNotes: { [index: string]: Note };
  playNoteList: Array<PlayNote>; // sorted by pulse
  bpmNoteList: Array<BPMNote>; // sorted by pulse
  stopNoteList: Array<StopNote>; // sorted by pulse
  dirtyNotes: Set<NoteIndex>;
  dirtyPulse: number;
  timeSignatures: Array<TimeSignature>; // sorted by measureNo

  constructor(bpm: number, resolution: number) {
    this.bpm = bpm;
    this.resolution = resolution;
    this.allNotes = {};
    this.playNoteList = [];
    this.dirtyNotes = new Set();
    this.dirtyPulse = -1;
    this.bpmNoteList = [];
    this.stopNoteList = [];
    this.timeSignatures = [{
      measureNo: 0,
      meter: [4, 4],
    }, {
      measureNo: 3,
      meter: [3, 4], // TODO: temporary!
    }];
  }

  setMainBpm(bpm: number) {
    const oldBpm = this.bpm;
    this.bpm = bpm;
    if (oldBpm !== bpm) {
      this._recalculateNoteTime();
    }
  }

  setResolution(resolution: number) {
    const oldResolution = this.resolution;
    this.resolution = resolution;
    if (oldResolution !== resolution) {
      this._recalculateNoteTime();
    }
  }

  getNote(noteIndex: NoteIndex): Note {
    const note = this.allNotes[noteIndex];

    if (!note) {
      throw Error(`getNote Failed: noteIndex does not exist
        noteIndex: ${noteIndex}`);
    }

    return note;
  }

  getLastNote(): Note | undefined {
    // TODO
    const lastPlayNote = _.last(this.playNoteList);
    const lastBPMNote = _.last(this.bpmNoteList);
    const lastStopNote = _.last(this.stopNoteList);

    let lastNote: Note | undefined = lastPlayNote;

    [lastBPMNote, lastStopNote].forEach((note: Note | undefined) => {
      if (!lastNote) {
        lastNote = note;
      } else if (note != null && lastNote.time.pulse < note.time.pulse) {
        lastNote = note;
      }
    });

    return lastNote;
  }

  setNote(note: Note): void {
    const index = note.index;

    this._setDirty(note);
    this._addNoteIndex(index);
    this.allNotes[index] = note;
    this._resolveDirty();
  }

  setNoteList(noteList: Array<Note>): void {
    // TODO: implement this
  }

  // TODO: setScoreNote

  deleteNote(noteIndex: NoteIndex): void {
    const note: Note | undefined = this.allNotes[noteIndex];

    if (note) {
      this._setDirty(note);
      this._deleteNoteIndex(noteIndex);
      // this.allNotes.splice(binarySearchItemIndex(), 1); // TODO: ??
      this._resolveDirty();
    }
  }

  deleteNoteList(noteIndex: NoteIndex): void {
    // TODO: implement this
  }

  pulseToSecond(pulse: number): number {
    // TODO: implement this
    return 1;
  }

  secondToPulse(second: number): number {
    // TODO: implement this
    return 1;
  }

  optimizeIndices(): void {
    // TODO: implement this
  }

  // PRIVATE FUNCTIONS

  _resolveDirty(): void {
    // TODO: implement this
  }

  _recalculateNoteTime(): void {
    // TODO: implement this
  }

  _setDirty(note: Note): void {
    // set dirtyPulse when note is a bpm or stop note
    if (!(note instanceof PlayNote)) {
      let pulse: number;
      if (note.time.isFixedTime) {
        pulse = note.time.pulse;
      } else {
        pulse = this.secondToPulse(note.time.second);
      }

      if (this.dirtyPulse === -1) {
        this.dirtyPulse = pulse;
      } else {
        this.dirtyPulse = this.dirtyPulse < pulse ? this.dirtyPulse : pulse;
      }
    } else {
      // if the note is a normal note, just add noteIndex to dirtyNotes
      this.dirtyNotes = this.dirtyNotes.add(note.index);
    }
  }

  _addNoteIndex(noteIndex: NoteIndex): void {
    // if (noteIndex.length === 0) {
    //   throw Error(`addNoteIndex FAILED:
    //     noteIndex: ${noteIndex}`);
    // }
    //
    // if (noteIndex.startsWith('m')) {
    //   this.musicNoteIndices = this.musicNoteIndices.add(noteIndex);
    // } else if (noteIndex.startsWith('e')) {
    //   this.eventNoteIndices = this.eventNoteIndices.add(noteIndex);
    // } else {
    //   throw Error(`addNoteIndex Failed: not compatible NoteIndex type
    //     noteIndex: ${noteIndex}`);
    // }
  }

  _deleteNoteIndex(noteIndex: NoteIndex): void {
    // if (noteIndex.length === 0) {
    //   throw Error(`deleteNoteIndex FAILED:
    //     noteIndex: ${noteIndex}`);
    // }
    //
    // if (noteIndex.startsWith('m')) {
    //   this.musicNoteIndices = this.musicNoteIndices.delete(noteIndex);
    // } else if (noteIndex.startsWith('e')) {
    //   this.eventNoteIndices = this.eventNoteIndices.delete(noteIndex);
    // } else {
    //   throw Error(`deleteNoteIndex Failed: not compatible NoteIndex type
    //     noteIndex: ${noteIndex}`);
    // }
  }
}
