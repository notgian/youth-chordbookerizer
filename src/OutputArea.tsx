import type { CSSProperties } from 'react'
import { useSyncExternalStore, useState, useRef} from 'react';
import './App.css'
import { sharpToFlat, sharpToFlatChord, transposeLine } from './transposer';

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
    key: '',
    keySig: '',
    capo: '',
    chords: ''
}

const getRawTextSnapshot = () => {
    const titleInput = document.getElementById("input-title") as HTMLInputElement | null; 
    const title = titleInput?.value ?? '';

    const textarea = document.getElementById("input-chords") as HTMLTextAreaElement | null; 
    const chords = textarea?.value ?? '';

    const keyName = document.getElementById("input-key-name") as HTMLSelectElement | null; 
    const keyType = document.getElementById("input-key-type") as HTMLSelectElement | null; 
    const key = keyName && keyName.value.trim() && keyType ? keyName.value.trim() + ' ' + keyType.value.trim() : '';
    
    const keySigTop = document.getElementById("input-signature-top") as HTMLSelectElement | null; 
    const keySigBot = document.getElementById("input-signature-bot") as HTMLSelectElement | null; 
    const keySig = keySigTop && keySigTop.value.trim() && keySigBot && keySigBot.value.trim() ? 
        keySigTop.value.trim() + '/' + keySigBot.value.trim() : '';

    const capoInput = document.getElementById("input-capo") as HTMLInputElement | null; 
    const capo = capoInput && Number(capoInput.value?.trim()) > 0 ? capoInput.value.trim() : '';
    
    let cs = cachedSnapshot;
    if (cs.title !== title || cs.chords !== chords || cs.key !== key || cs.keySig !== keySig || cs.capo !== capo ) {
        cachedSnapshot = { title, key, chords, keySig, capo};
    }

    return cachedSnapshot
};

// Component
const OutputArea = () => {
    const snapshot = useSyncExternalStore(subscribe, getRawTextSnapshot);
    const titleText = snapshot.title;
    const key = snapshot.key;
    const keySig = snapshot.keySig;
    const capo = snapshot.capo;
    const chordsText = snapshot.chords;
    
    // Output options
    const [showPianoChords, setShowPianoChords] = useState<boolean>(false);
    const [showFlatsKeyLabel, setShowFlatsKeyLabel] = useState<boolean>(false);
    const [showFlatsSongChords, setShowFlatsSongChords] = useState<boolean>(false);

    // For copying
    const previewRef = useRef<HTMLElement>(null);

    const handleCopyPreview = async () => {
        if (!previewRef.current) {
            alert('Failed to copy chords! Please try again.');
            return
        }

        try {
            const htmlBlob = new Blob([previewRef.current.innerHTML], { type: 'text/html' });

            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': htmlBlob,
                }),
            ]);

            alert('Copied chords to clipboard. Paste directly into Google Docs!');
        } catch (err) {
            alert('Failed to copy chords! Please try again.');
        }
    }


    const renderPreview = () => {
        let preview: React.JSX.Element[] = [];

        if (titleText)
            preview.push(<h3 key='title' style={outputstyles.h3}>{capo && !showPianoChords ? titleText + ' (CAPO ' + capo + ')' : titleText}</h3>)
        if (key) {
            let keyLabel;
            if (!showFlatsKeyLabel)
                keyLabel = key;
            else {
                let keySplit = key.split(' ')
                keyLabel = sharpToFlat(keySplit[0]) + ' ' + keySplit[1];
            }
            preview.push(<p key='key' style={outputstyles.text}>Key: {keyLabel}</p>)
        
        }
        if (keySig)
            preview.push(<p key='keySig' style={outputstyles.text}>{keySig}</p>)
        if (capo && !showPianoChords)
            preview.push(<p key='capo' style={outputstyles.text}>Capo {capo}</p>)

        // Add a space before chords IFF title/other stuff
        // precede the chords
        if (preview.length > 0)
            preview.push(<br key='top-br' />);

        if (chordsText) {
            let chords = chordsText.split('\n').map((line, index) => {
                if (line.trim() === '') {
                    return <br key={index} />;
                }
                
                const chordSectionLabel: string = containsChordsSection(line) ?? '';
                if (chordSectionLabel) {
                    return <p key={index} style={outputstyles.section}>{chordSectionLabel.toUpperCase()}</p>;
                }
                else if (containsChords(line)) {
                    if (showPianoChords && Number(capo) > 0) {
                        let t = transposeLine(line, Number(capo), showFlatsSongChords)
                        return <p key={index} style={outputstyles.chords}>{t}</p>;
                    }
                    else if (showFlatsSongChords) {
                        let flatsLine = line;
                        let tokens = flatsLine.split(/[\s]+/g);
                        for (let token of tokens) {
                            if (token === "" || token.length < 1) continue
                            flatsLine = flatsLine.replace(token, sharpToFlatChord(token))
                        }
                        return <p key={index} style={outputstyles.chords}>{flatsLine}</p>;
                    }
                    else
                        return <p key={index} style={outputstyles.chords}>{line}</p>;
                }
                return <p key={index} style={outputstyles.text}>{line}</p>;
            });
            preview = preview.concat(chords);
        }
        

        return preview;
    };

    return (
        <div id="outputarea" className="content-area">
            <span className="output-controls">
                <label className="checkbox-container">
                    Preview Piano Chords
                    <input
                        type="checkbox" 
                        checked={showPianoChords}
                        onChange={(e) => setShowPianoChords(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                </label>

                <label className="checkbox-container">
                    Flats in Song Key Label
                    <input
                        type="checkbox" 
                        checked={showFlatsKeyLabel}
                        onChange={(e) => setShowFlatsKeyLabel(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                </label>

                <label className="checkbox-container">
                    Flats in Chords
                    <input
                        type="checkbox" 
                        checked={showFlatsSongChords}
                        onChange={(e) => setShowFlatsSongChords(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                </label>

            </span>

            <button 
                className="copy-preview-button" 
                onClick={handleCopyPreview}
            >Copy Chords</button>

            <span className="output-preview" ref={previewRef}>
                { renderPreview() }
            </span>
        </div>

    )
}

export default OutputArea;
