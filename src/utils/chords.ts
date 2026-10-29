// Handles most chords. Idk if there are testcases for rlly weird chords
// but this works fine as is
const CHORD_REGEX = /^[A-G][b#]?(m|maj|min|dim|aug|sus|add|[0-9])*(?:\/[A-G][b#]?)?$/i;

export const containsChords = (line: string) => {
  const trimmed = line.trim();

  // empty lines and stuff like [Chorus], not chords
  if (!trimmed || trimmed.startsWith("[") || trimmed.startsWith("(")) return false;

  const tokens = trimmed.split(/\s+/);
  let chordCount = 0;
  for (const token of tokens) {
    // Strip common punctuation around chords like brackets or parentheses
    const cleanToken = token.replace(/[()[\]{},]/g, "");

    if (CHORD_REGEX.test(cleanToken)) chordCount++;
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

for (let keyword of chordSectionKeywords) {
  const pattern = "(\\s[\\d]+)?";
  chordSectionKeywordPatterns.push(new RegExp(keyword + pattern));
}

/**
 * Checks if the given line is a chords section
 * @param {string} line - the line to check whether it is a chord section
 * @returns null if the line is not a chords section, or the chord section text if it is
 */
export const containsChordsSection = (line: string) => {
  let lineTrim = line.trim();
  // Common Case: First and last char are []
  if (lineTrim[0] == "[" && lineTrim[lineTrim.length - 1] == "]") {
    return lineTrim.substring(1, lineTrim.length - 1);
  }

  // Second case: checks for any of the defined
  // keywords and checks if majority of the line
  // is of this keyword, which identifies the line as a
  // chord section
  for (let pattern of chordSectionKeywordPatterns) {
    let matchedText = lineTrim.toUpperCase().match(new RegExp(pattern));

    if (matchedText && matchedText.length > 0) {
      // I only really care about one, since
      // the line would supposedly only have one
      const word = matchedText[0];
      const ratio = word.length / lineTrim.length;
      if (ratio >= 0.75) return word;
    }
  }

  return null;
};
