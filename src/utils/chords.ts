export const Notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

const flatAliases = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
} as const;

export type SharpNote = (typeof Notes)[number];
export type FlatNote = keyof typeof flatAliases;
export type Note = SharpNote | FlatNote;

const getNoteIndex = (note: Note): number => {
  const canonical = note in flatAliases ? flatAliases[note as FlatNote] : note;
  return Notes.indexOf(canonical as SharpNote);
};

export const wholeStep = (note: Note): SharpNote => {
  const index = getNoteIndex(note);
  return Notes[(index + 2) % Notes.length];
};

export const halfStep = (note: Note): SharpNote => {
  const index = getNoteIndex(note);
  return Notes[(index + 1) % Notes.length];
};

export const nSteps = (note: Note, n: number): SharpNote => {
  const index = getNoteIndex(note);
  return Notes[(index + n) % Notes.length];
};

export const assureSharp = (note: Note): SharpNote => {
  return Notes[getNoteIndex(note)];
};

export const chordQualities = [
  "",
  "m",
  "maj",
  "min",
  "-",
  "aug",
  "+",
  "dim",
  "o",
  "sus2",
  "sus4",
  "sus",
  "5",
] as const;
export type ChordQuality = (typeof chordQualities)[number];

export const chordExtensions = [
  "2",
  "4",
  "6",
  "6/9",
  "7",
  "maj7",
  "Maj7",
  "M7",
  "9",
  "maj9",
  "M9",
  "11",
  "maj11",
  "13",
  "maj13",
  "add2",
  "add4",
  "add9",
  "dim7",
  "m7b5",
  "ø",
  "7b5",
  "7#5",
  "7b9",
  "7#9",
  "9#11",
  "13b9",
] as const;
export type ChordExtension = (typeof chordExtensions)[number];

export type ChordSuffix = `${ChordQuality}${ChordExtension}` | ChordQuality;

export class Chord {
  private readonly note_: Note;
  private readonly suffix_: ChordSuffix;

  constructor(note_: Note, suffix_: ChordSuffix) {
    this.note_ = note_;
    this.suffix_ = suffix_;
  }

  // Automatically handles string conversion
  toString(): string {
    return `${this.note_}${this.suffix_}`;
  }

  // Makes it serialize cleanly to a string if passed to JSON.stringify
  toJSON(): string {
    return this.toString();
  }

  get note(): Note {
    return this.note_;
  }

  get suffix(): ChordSuffix {
    return this.suffix_;
  }
}

// Handles most chords. Idk if there are testcases for rlly weird chords
// but this works fine as is
const CHORD_REGEX = /^[A-G][b#]?(m|maj|min|dim|aug|sus|add|[0-9])*(?:\/[A-G][b#]?)?$/i;

export const containsChords = (line: string): boolean => {
  const trimmed = line.trim();

  // empty lines and stuff like [Chorus], not chords
  if (!trimmed || trimmed.startsWith("[") || trimmed.startsWith("(")) {
    return false;
  }

  const tokens = trimmed.split(/\s+/);
  let chordCount = 0;
  for (const token of tokens) {
    // Strip common punctuation around chords like brackets or parentheses
    const cleanToken = token.replaceAll(/[()[\]{},]/g, "");

    if (CHORD_REGEX.test(cleanToken)) {
      chordCount++;
    }
  }

  // Check if most of the line are chords
  const chordRatio = chordCount / tokens.length;
  return chordRatio >= 0.5;
};

const chordSectionKeywords = [
  "VERSE",
  "PRECHORUS",
  "PRE-CHORUS",
  "PRE CHORUS",
  "CHORUS",
  "BRIDGE",
  "INSTRUMENTAL",
  "INTERLUDE",
  "TAG",
  "INTRO",
  "OUTRO",
];

// Build the pattern for matching of each
// chord section keyword
const chordSectionKeywordPatterns: RegExp[] = [];

for (const keyword of chordSectionKeywords) {
  const pattern = String.raw`(\s[\d]+)?`;
  chordSectionKeywordPatterns.push(new RegExp(keyword + pattern));
}

/**
 * Checks if the given line is a chords section
 * @param {string} line - the line to check whether it is a chord section
 * @returns undefined if the line is not a chords section, or the chord section text if it is
 */
export const containsChordsSection = (line: string): string | undefined => {
  const lineTrim = line.trim();
  // Common Case: First and last char are []
  if (lineTrim.startsWith("[") && lineTrim.endsWith("]")) {
    return lineTrim.slice(1, -1);
  }

  // Second case: checks for any of the defined
  // keywords and checks if majority of the line
  // is of this keyword, which identifies the line as a
  // chord section
  for (const pattern of chordSectionKeywordPatterns) {
    const matchedText = new RegExp(pattern).exec(lineTrim.toUpperCase());

    if (matchedText && matchedText.length > 0) {
      // I only really care about one, since
      // the line would supposedly only have one
      const [word] = matchedText;
      const ratio = word.length / lineTrim.length;
      if (ratio >= 0.75) {
        return word;
      }
    }
  }

  return undefined;
};
