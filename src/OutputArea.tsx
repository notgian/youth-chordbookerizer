import type { CSSProperties } from 'react'
import { useSyncExternalStore } from 'react';
import './App.css'

const outputstyles: Record<string, CSSProperties> = {
    h1: {fontSize: '18pt', textAlign: 'center', margin: 0},
    h2: {fontSize: '12pt', textAlign: 'center', textDecoration: 'underline', margin: 0},
    h3: {fontSize: '12pt', margin: 0},
    chords : {fontSize: '11pt', whiteSpace: 'pre-wrap', margin: 0, color: '#4a86e8'},
    text: {fontSize: '11pt', margin: 0},
    section: {fontSize: '11pt', textDecoration: 'underline', margin: 0}
}

// Handles most chords. Idk if there are testcases for rlly weird chords
// but this works fine as is
const CHORD_REGEX = /^[A-G][b#]?(m|maj|min|dim|aug|sus|add|[0-9])*(?:\/[A-G][b#]?)?$/i;

const containsChords = (line: String) => {
    const trimmed = line.trim();

    // empty lines and stuff like [Chorus], not chords
    if (!trimmed || trimmed.startsWith('[') || trimmed.startsWith('('))
        return false;

    const tokens = trimmed.split(/\s+/);
    let chordCount = 0;
    for (const token of tokens) {
        // Strip common punctuation around chords like brackets or parentheses
        const cleanToken = token.replace(/[()[\]{},]/g, '');

        if (CHORD_REGEX.test(cleanToken))
            chordCount++;
    }

    // Check if most of the line are chords
    const chordRatio = chordCount / tokens.length;
    return chordRatio >= 0.5;
}

const chordSectionKeywords = [
    'VERSE',
    'PRECHORUS',
    'PRE-CHORUS',
    'PRE CHORUS',
    'CHORUS',
    'BRIDGE',
    'INSTRUMENTAL',
    'INTERLUDE',
    'TAG',
    'INTRO',
    'OUTRO'
]

// Build the pattern for matching of each
// chord section keyword
const chordSectionKeywordPatterns: RegExp[] = []

for (let keyword of chordSectionKeywords) {
    const pattern = '(\\s[\\d]+)?';
    chordSectionKeywordPatterns.push(new RegExp(keyword + pattern));
}

/**
 * Checks if the given line is a chords section
 * @param {string} line - the line to check whether it is a chord section
 * @returns null if the line is not a chords section, or the chord section text if it is
 */
const containsChordsSection = (line: String) => {
    let lineTrim = line.trim()
    // Common Case: First and last char are []
    if (lineTrim[0] == '[' && lineTrim[lineTrim.length-1] == ']') {
        return lineTrim.substring(1, lineTrim.length - 1)
    }
    
    // Second case: checks for any of the defined
    // keywords and checks if majority of the line
    // is of this keyword, which identifies the line as a
    // chord section
    for (let pattern of chordSectionKeywordPatterns) {
        let matchedText = lineTrim.toUpperCase().match(new RegExp(pattern))

        if (matchedText && matchedText.length > 0) {
            // I only really care about one, since
            // the line would supposedly only have one
            const word = matchedText[0];
            const ratio = word.length / lineTrim.length;
            console.log(matchedText, word.length, lineTrim.length, ratio, pattern)
            if (ratio >= 0.75)
                return word
        }
    }

    return null
}

// For the sync external store 
function subscribe(callback: () => void) {
    window.addEventListener('update-preview', callback);
    return () => window.removeEventListener('update-preview', callback);
}

let cachedSnapshot = {
    title: '',
    chords: ''
}

const getRawTextSnapshot = () => {
    const titleInput = document.getElementById("inputarea")?.getElementsByClassName("input-title").item(0) as HTMLInputElement | null; 
    const title = titleInput?.value ?? '';

    const textarea = document.getElementById("inputarea")?.getElementsByClassName("input-chords").item(0) as HTMLTextAreaElement | null; 
    const chords = textarea?.value ?? '';

    if (cachedSnapshot.title !== title || cachedSnapshot.chords !== chords) {
        cachedSnapshot = { title, chords };
    }

    return cachedSnapshot
};

// Component
const OutputArea = () => {
    const snapshot = useSyncExternalStore(subscribe, getRawTextSnapshot);
    const titleText = snapshot.title;
    const chordsText = snapshot.chords;


    const renderPreview = () => {
        if (!chordsText && !titleText) return null;

        let preview: React.JSX.Element[] = [];

        if (titleText)
            preview.push(<h3 key='title' style={outputstyles.h3}>{titleText}</h3>)

        let chords = chordsText.split('\n').map((line, index) => {
            if (line.trim() === '') {
                return <br key={index} />;
            }
            else if (containsChordsSection(line)) {
                // const label = line.trim().slice(1, -1).toUpperCase();
                const label: string = containsChordsSection(line) ?? '';
                return <p key={index} style={outputstyles.section}>{label.toUpperCase()}</p>;
            }
            else if (containsChords(line)) {
                return <p key={index} style={outputstyles.chords}>{line}</p>;
            }
            return <p key={index} style={outputstyles.text}>{line}</p>;
        });
        
        if (preview.length > 0)
            preview.push(<br key='top-br' />);
        preview = preview.concat(chords);

        return preview;
    };

    return (
        <div id="outputarea" className="content-area">
            <span className="output-controls">
                <h2>Preview</h2>
            </span>
            <span className="output-preview">
                { renderPreview() }
            </span>
        </div>

    )
}

export default OutputArea;
