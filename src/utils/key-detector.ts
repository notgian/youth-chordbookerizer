import { containsChords, Chord } from "./chords";
import type { Note, ChordSuffix } from "./chords";

// Formula for Major Keys:
// I – ii – iii – IV – V – vi – vii°
// Formula for Major Scale:
// W – W – H – W – W – W – (H)

// Formula for Minor Keys:
// i – ii° – III – iv – v – VI – VII
// W – H – W – W – H – W – (W)

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

          return new Chord(note as Note, suffix as ChordSuffix);
        });
    });

  return chordLines;
};

function main() {
  const testLines = "C  D  Em  F\nNot chords Line\nA   F#m    D";
  const chordLines = extractChordLines(testLines);
  for (const line of chordLines) {
    console.log(line.toString());
  }
}

main();
