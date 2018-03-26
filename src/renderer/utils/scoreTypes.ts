export type Coord = [number, number];
/**
 * [bottom-left Coord, [width, height]]
 */
export type Rect = [Coord, Coord];
export type Beat = [number, number];
export type NoteIndex = string;
export type SoundIndex = string;
export type LaneIndex = string;
export type TrackIndex = string;

export interface ScoreMetaData {
  title: string;
  artist: string; // TODO: TO BMSMetaData?
  fileName?: string;
  resourcePath?: string;
  extra: Object;
};

// pulse and second should be calculated when to use it.
export class NoteTime {
  beat: Beat;
  pulse: number;
  second: number;
  isFixedTime: boolean; // default: false

  constructor(pulse: number, isFixedTime: boolean = false) {
    this.beat = [0, 4];
    this.pulse = pulse;
    this.second = 0;
    this.isFixedTime = isFixedTime;
  }
}

export interface NoteLayer {
  index: TrackIndex;
  name: string;
  isLocked: boolean;
  isVisible: boolean;
  editableLaneIndex: Array<LaneIndex>; // use all if empty
};

export interface TimeSignature {
  measureNo: number;
  meter: Beat;
};

export interface NoteType {
  index: string;
  typeName: string;
  BMSChannel?: number;
};

export interface EventType {
  index: string;
  BMSChannel?: number;
};

export interface MIDIValue {
  length: number; // second scale
  intensity: number; // normalized to 0-1
  pitch: number; // midi scale
};

export interface SoundSprite {
  fileName: string;
  useWhole: boolean; // default true
  interval?: [number, number]; // second scale
}

export interface SoundType {
  index: SoundIndex;
  midiValue?: MIDIValue;
  soundSpriteIndex?: string;
};

// export interface LaneType {
//   noteType: NoteType,
// };

export enum EditMode {
  TIME_SELECT_MODE, SELECT_MODE, WRITE_MODE
}

export class PlayNoteProps {
  propType: 'm' | 'e' = 'm';
  laneIndex: LaneIndex; // Position X
  trackIndex: TrackIndex;
  lnPrevPart: NoteIndex | null;
  lnNextPart: NoteIndex | null;

  constructor() {
    this.laneIndex = '';
    this.trackIndex = '';
    this.lnPrevPart = null;
    this.lnNextPart = null;
  }
}

export class MusicNoteProps extends PlayNoteProps {
  soundIndex: SoundIndex;
  noteTypeIndex: string;
  constructor() {
    super();
    this.soundIndex = '';
    this.noteTypeIndex = '';
  }
}

export class EventNoteProps extends PlayNoteProps {
  propType: 'm' | 'e' = 'e';
  eventTypeIndex: string;
  constructor() {
    super();
    this.eventTypeIndex = '';
  }
}

export class Note {
  index: NoteIndex;
  time: NoteTime; // Y Position
  isLocked: boolean;

  constructor(index: NoteIndex, time: NoteTime) {
    this.index = index;
    this.time = time;
    this.isLocked = false;
  }
}

export class PlayNote extends Note {
  isBackground: boolean;
  // DO NOT MANIPULATE IT! props are used as euclase core properties only
  props: PlayNoteProps;
  // this extra value is for users
  extra: Object;

  constructor(indexNo: number, time: NoteTime, props: PlayNoteProps) {
    super(`${props.propType}${indexNo}`, time);
    this.isBackground = false;
    this.props = props;
    this.extra = {};
  }
}

export class BPMNote extends Note {
  bpm: number;
  isLocked: boolean;

  constructor(indexNo: number, pulse: number, bpm: number) {
    super(`b${indexNo}`, new NoteTime(pulse));
    this.bpm = bpm;
    this.isLocked = false;
  }
}

export class StopNote extends Note {
  duration: NoteTime;
  isLocked: boolean;

  constructor(indexNo: number, positionPulse: number, durationPulse: number) {
    super(`s${indexNo}`, new NoteTime(positionPulse));
    this.duration = new NoteTime(durationPulse);
    this.isLocked = false;
  }
}

// time is always fixed by pulse
export type ScoreNote = BPMNote | StopNote;
