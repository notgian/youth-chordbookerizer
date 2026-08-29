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
function transposeChord(chord: string, transposeFactor: number, outputFlat: boolean = true): string | undefined {
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
    if (isAccidental && isFlat && !outputFlat) {
        note = sharpToFlat(note);
    }

    const chordSuffix = chord.substring(isAccidental ? 2 : 1);
    return note + chordSuffix;
} 

function transposeLine(line: string, transposeFactor: number) {
    if (transposeFactor % 12 == 0)
        return line
}


export {
    transposeChord,
    transposeLine,
    flatToSharp,
    sharpToFlat,
}
