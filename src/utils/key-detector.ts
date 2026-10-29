import { containsChords } from "./chords";

export const extractChordLines = (rawChords: string): string[][] => {
  const chordLines = rawChords
    .split("\n")
    .filter((line) => containsChords(line))
    .map((line) => line.trim().split(/\s+/));

  return chordLines;
};

function main() {
  const testLines = "C  D  Em  F\nNot chords Line\nA   F#m    D";
  const chordLines = extractChordLines(testLines);
  console.log(chordLines);
}

main();
