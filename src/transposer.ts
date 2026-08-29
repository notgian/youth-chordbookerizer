const NOTES_SHARPS = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
];

const NOTES_FLATS = [
    'C',
    'Db',
    'D',
    'Eb',
    'E',
    'F',
    'Gb',
    'G',
    'Ab',
    'A',
    'Bb',
    'B'
];

// Utility functions

/**
 * Converts a sharp note to a flat
 *
 * @param {string} note - The note to convert from sharp to flat
 * @return {string} The converted note. If the note is not an accidental or not a note, it returns the input
 */
function sharpToFlat(note: string): string {
    switch (note) {
        case 'C#':
            return 'Db';
        case 'D#':
            return 'Eb';
        case 'F#':
            return 'Gb';
        case 'G#':
            return 'Ab';
        case 'A#':
            return 'Bb';
        default:
            return note;
    }
}

/**
 * Converts a flat note to a sharp
 *
 * @param {string} note - The note to convert from flat to sharp
 * @return {string} The converted note. If the note is not an accidental or not a note, it returns the input
 */
function flatToSharp(note: string): string {
    switch (note) {
        case 'Db':
            return 'C#';
        case 'Eb':
            return 'D#';
        case 'Gb':
            return 'F#';
        case 'Ab':
            return 'G#';
        case 'Bb':
            return 'A#';
        default:
            return note;
    }
}

// Main transposition functions

/** 
 * Transposes an individual chord given a transposition factor (one unit of this factor is equivalent to a half step)
 *
 * @param {string} chord - the chord to transpose
 * @param {number} transposeFactor - the factor of which to transpose the chord (i.e. -2, +2 is whole step down or up)
 * @param {boolean} [outputFlat=false] - Optional. If true, accidental notes will be formatted as flats (b). If false, sharps (#) will be used.
 * @returns {string|undefined} The transposed chord string, or `undefined` if the input chord is invalid.
 */
function transposeChord(chord: string, transposeFactor: number, outputFlat: boolean = false): string | undefined {
    // force trim the chord 
    chord = chord.trim()
    let note = chord.substring(0, 2)
    let isAccidental = true;
    let isFlat = false;
    // if not sharp or flat, only the first char is the note
    if (note[1] != '#' && note[1] != 'b') {
        note = note[0];
        isAccidental = false;
    } 
    // if sharp/flat, check if flat; convert flat to sharp
    else if (note[1] == 'b') {
        note = flatToSharp(note);
        isFlat = true;
    }
    
    // edge case: passed chord does not have a valid note
    if (!NOTES_SHARPS.includes(note) && !NOTES_FLATS.includes(note))
        return undefined
    
    // return if transposed chord will be the same
    transposeFactor %= 12
    if (transposeFactor == 0)
        return chord;


    let transposedOffset = (NOTES_SHARPS.indexOf(note) + transposeFactor) % 12;
    if (transposedOffset < 0)
        transposedOffset += 12;

    note = NOTES_SHARPS[transposedOffset]
    
    // convert sharp back to flat if necessary
    if (note.length > 1 && note[1] == '#' && outputFlat) {
        note = sharpToFlat(note);
    }

    let chordSuffix = chord.substring(isAccidental ? 2 : 1);

    // if there is a bass note, transpose this too
    if (chordSuffix.includes('/')) {
        const slashSplit = chordSuffix.split('/')
        if (slashSplit.length > 1 && (NOTES_SHARPS.includes(slashSplit[1]) || NOTES_FLATS.includes(slashSplit[1]))) {
            let bassNote = slashSplit[1];

            let transposedOffset = (NOTES_SHARPS.indexOf(bassNote) + transposeFactor) % 12;
            if (transposedOffset < 0)
                transposedOffset += 12;

            bassNote = NOTES_SHARPS[transposedOffset]
            chordSuffix = slashSplit[0] + '/' + bassNote
        }
        
    }
    return note + chordSuffix;
} 

/** 
 * Transposes an line of chords, doing its best to preserve spacing, given a transposition factor (one unit of this factor is equivalent to a half step)
 *
 * @param {string} chord - the chord to transpose
 * @param {number} transposeFactor - the factor of which to transpose the chord (i.e. -2, +2 is whole step down or up)
 * @param {boolean} [outputFlat=false] - Optional. If true, accidental notes will be formatted as flats (b). If false, sharps (#) will be used.
 * @returns {string|undefined} The transposed chord line string, or `undefined` if one of the input chords is invalid.
 */
function transposeLine(line: string, transposeFactor: number, outputFlat: boolean = false) {
    // get the converted chords of each first
    let startsWithSpace = false;
    let chords = line.split(/[\s]+/)
    if (chords.length > 0 && chords[0].trim() === "") {
        chords = chords.splice(1)
        startsWithSpace = true;
    }
    const initialChords = chords
    const convertedChords = initialChords.map(chord => transposeChord(chord, transposeFactor, outputFlat))
    
    let fullMatch = true
    for (let i = 0; i < initialChords.length; i++) {
        // if one of the converted chords is undefined, return early
        if (convertedChords[i] == undefined)
            return initialChords
        else if (initialChords[i] != convertedChords[i]) {
            fullMatch = false;
            break;
        }
    }
    
    // return the same line if the transposed chords are exactly the same
    if (fullMatch)
        return line;

    const spaces = line.match(/[\s]+/g);
    let newLine = startsWithSpace && spaces ? spaces[0] : "";
    const spaceOffset = startsWithSpace ? 1: 0;
    for (let i = 0; i < convertedChords.length; i++) {
        const currChord = convertedChords[i] ?? ''
        const currPreChord = initialChords[i] ?? ''
        const currSpace = spaces && spaces[i + spaceOffset] ? spaces[i + spaceOffset] : ' ';
        const spaceDiff = currPreChord.length - currChord.length ;
        if (spaceDiff == 0)
            newLine += currChord + currSpace
        else {
            let newSpaceLen = currSpace.length + spaceDiff
            // require that there be at least 1 space
            if (newSpaceLen <= 0)
                newSpaceLen = 1

            newLine += currChord + ' '.repeat(newSpaceLen)
        }
    }

    return newLine.trimEnd();
}


export {
    transposeChord,
    transposeLine,
    flatToSharp,
    sharpToFlat,
}
