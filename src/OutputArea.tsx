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

const containsChordsSection = (line: String) => {
    let lineTrim = line.trim()
    // Common Case: First and last char are []
    if (lineTrim[0] == '[' && lineTrim[lineTrim.length-1] == ']') {
        return true
    }
    return false
}

// For the sync external store 
function subscribe(callback: () => void) {
    window.addEventListener('update-preview', callback);
    return () => window.removeEventListener('update-preview', callback);
}

const getRawTextSnapshot = () => {
    const textarea = document.getElementById("inputarea")?.getElementsByTagName("textarea").item(0);
    return textarea?.value ?? '';
};

// Component
const OutputArea = () => {
    const rawText = useSyncExternalStore(subscribe, getRawTextSnapshot);

    const renderPreview = () => {
        if (!rawText) return null;

        return rawText.split('\n').map((line, index) => {
            if (line.trim() === '') {
                return <br key={index} />;
            }
            if (containsChordsSection(line)) {
                const label = line.trim().slice(1, -1).toUpperCase();
                return <p key={index} style={outputstyles.section}>{label}</p>;
            }
            if (containsChords(line)) {
                return <p key={index} style={outputstyles.chords}>{line}</p>;
            }
            return <p key={index} style={outputstyles.text}>{line}</p>;
        });
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
