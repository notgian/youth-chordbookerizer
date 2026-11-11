import { containsChords, Chord, Notes, assureSharp, halfStep, wholeStep, nSteps } from "./chords";
import type { Note, ChordSuffix } from "./chords";

const noteSteps = ["W", "H"] as const;
type NoteSteps = (typeof noteSteps)[number];

// Formula for Major Keys:
// I – ii – iii – IV – V – vi – vii°
// Formula for Major Scale:
// W – W – H – W – W – W – (H)
const majorKeys: Record<string, Chord[]> = {};
const majorScaleStepPattern: NoteSteps[] = ["W", "W", "H", "W", "W", "W", "H"];
const majorScaleSuffixPattern: ChordSuffix[] = ["", "m", "m", "", "", "m", "dim"];

for (const rawNote of Notes) {
  const note = rawNote as Note;
  let currentNote = note;
  const keyChords: Chord[] = [];

  for (let i = 0; i < majorScaleStepPattern.length; i++) {
    const currentSuffix = majorScaleSuffixPattern[i];
    keyChords.push(new Chord(currentNote, currentSuffix));

    const nextStep = majorScaleStepPattern[i];
    if (nextStep === "W") {
      currentNote = wholeStep(currentNote);
    } else if (nextStep === "H") {
      currentNote = halfStep(currentNote);
    }
  }

  majorKeys[note] = keyChords;
}

// Formula for Minor Keys:
// i – ii° – III – iv – v – VI – VII
// W – H – W – W – H – W – (W)
const minorKeys: Record<string, Chord[]> = {};
const minorScaleStepPattern: NoteSteps[] = ["W", "H", "W", "W", "H", "W", "W"];
const minorScaleSuffixPattern: ChordSuffix[] = ["m", "dim", "", "m", "m", "", ""];

for (const rawNote of Notes) {
  const note = rawNote as Note;
  let currentNote = note;
  const keyChords: Chord[] = [];

  for (let i = 0; i < minorScaleStepPattern.length; i++) {
    const currentSuffix = minorScaleSuffixPattern[i];
    keyChords.push(new Chord(currentNote, currentSuffix));

    const nextStep = majorScaleStepPattern[i];
    if (nextStep === "W") {
      currentNote = wholeStep(currentNote);
    } else if (nextStep === "H") {
      currentNote = halfStep(currentNote);
    }
  }

  minorKeys[`${note}m`] = keyChords;
}

const keyWeightsMajors = [1, 0.2, 0.09, 0.45, 0.6, 0.25, 0.07];
const keyWeightsMinors = [1, 0.22, 0.18, 0.38, 0.65, 0.33, 0.18];

const accidentalSymbols = new Set(["#", "b"]);

export const extractChordLines = (
  rawChords: string,
  transposeBy = 0,
  simplify = false,
): Chord[] => {
  const chordLines = rawChords
    .split("\n")
    .filter((line) => containsChords(line))
    .flatMap((line) => {
      const tokens = line.trim().split(/\s+/);

      return tokens
        .filter((token) => token.length > 0)
        .map((chord) => {
          const chordTrim = chord.trim();

          const hasSuffix = chordTrim.length > 1;
          const isAccidental = hasSuffix && accidentalSymbols.has(chordTrim.charAt(1));

          let rawNote: string;

          if (!hasSuffix) {
            rawNote = chordTrim;
          } else if (isAccidental) {
            rawNote = chordTrim.slice(0, 2);
          } else {
            rawNote = chordTrim.charAt(0);
          }

          const noteRaw = rawNote as Note;

          const suffixRaw = isAccidental ? chordTrim.slice(2) : chordTrim.slice(1);

          const simpleMatch = /(m|dim)$/.exec(suffixRaw);
          const simpleSuffix = simpleMatch ? simpleMatch[0] : "";

          const suffix = simplify ? simpleSuffix : suffixRaw;

          const note = nSteps(assureSharp(noteRaw), transposeBy);
          return new Chord(assureSharp(note), suffix as ChordSuffix);
        });
    });

  return chordLines;
};

type KeyPrediction = {
  musicKey: string;
  score: number;
};

export const predictKey = (
  rawChords: string,
  capoRaw = 0,
  predictions = 1,
  simplify = true,
): KeyPrediction[] => {
  const capo = Math.max(capoRaw, 0);
  const chordLines = extractChordLines(rawChords, capo, simplify);

  // const keyScores = new Map();
  const keyScores: KeyPrediction[] = [];

  for (const musicKey of Object.keys(majorKeys)) {
    const musicKeyChords = majorKeys[musicKey];
    let score = 0;

    for (const chord of chordLines) {
      for (let i = 0; i < musicKeyChords.length; i++) {
        const keyChord = musicKeyChords[i];
        if (keyChord.toString() === chord.toString()) {
          score += keyWeightsMajors[i];
          break;
        }
      }
    }
    keyScores.push({ musicKey, score });
  }

  for (const musicKey of Object.keys(minorKeys)) {
    const musicKeyChords = minorKeys[musicKey];
    let score = 0;

    for (const chord of chordLines) {
      for (let i = 0; i < musicKeyChords.length; i++) {
        const keyChord = musicKeyChords[i];
        if (keyChord.toString() === chord.toString()) {
          score += keyWeightsMinors[i];
          break;
        }
      }
    }
    keyScores.push({ musicKey, score });
  }

  keyScores.sort((a, b) => b.score - a.score);

  const prediction_slice = predictions < 1 ? 1 : Math.min(24, predictions);

  return keyScores.slice(0, prediction_slice);
};
