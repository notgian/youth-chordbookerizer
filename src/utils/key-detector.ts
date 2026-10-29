import { containsChords, Chord, Notes, assureSharp, halfStep, wholeStep } from "./chords";
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

  minorKeys[note] = keyChords;
}

const accidentalSymbols = new Set(["#", "b"]);
export const extractChordLines = (rawChords: string): Chord[][] => {
  const chordLines = rawChords
    .split("\n")
    .filter((line) => containsChords(line))
    .map((line) => {
      const tokens = line.trim().split(/\s+/);

      return tokens
        .filter((token) => token.length > 0)
        .map((chord) => {
          const chordTrim = chord.trim();
          if (chordTrim.length === 1) {
            return new Chord(chordTrim as Note, "");
          }

          const isAccidental = accidentalSymbols.has(chordTrim.charAt(1));
          const note = isAccidental ? chordTrim.slice(0, 2) : chordTrim.charAt(0);
          const suffix = isAccidental ? chordTrim.slice(2) : chordTrim.slice(1);

          return new Chord(assureSharp(note as Note), suffix as ChordSuffix);
        });
    });

  return chordLines;
};

function main() {
  // const testLines = "C  D  Em  F\nNot chords Line\nA   F#m    D";
  // const chordLines = extractChordLines(testLines);
  // for (const line of chordLines) {
  //   console.log(line.toString());
  // }
}

main();
