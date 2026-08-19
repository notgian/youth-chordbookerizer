import type { CSSProperties, JSX } from 'react'
import { useEffect, useState } from 'react'
import './App.css'

const outputstyles: Record<string, CSSProperties> = {
    h1: {fontSize: '18pt', textAlign: 'center', margin: 0},
    h2: {fontSize: '12pt', textAlign: 'center', textDecoration: 'underline', margin: 0},
    h3: {fontSize: '12pt', margin: 0},
    chords : {fontSize: '11pt', whiteSpace: 'pre-wrap', margin: 0, color: '#4a86e8'},
    text: {fontSize: '11pt', margin: 0},
    section: {fontSize: '11pt', textDecoration: 'underline', margin: 0}
}

const containsChords = (line: String) => {
    return false
}

const containsChordsSection = (line: String) => {
    let lineTrim = line.trim()
    if (lineTrim[0] == '[' && lineTrim[lineTrim.length-1] == ']') {
        return true
    }
    return false
}

const renderPreview = () => {
    const previewElements: JSX.Element[] = []

    const chordsTextarea = document.getElementById("inputarea")?.getElementsByTagName("textarea").item(0)
    if (chordsTextarea?.value) {
        const chordLines = chordsTextarea.value.split('\n')
        for (let line of chordLines) {
            if (line.trim() == '') {
                previewElements.push(<br />) 
                continue
            }
            else if (containsChordsSection(line)) {
                let lineTrim = line.trim()
                lineTrim = lineTrim.substring(1, lineTrim.length-1)
                lineTrim = lineTrim.toUpperCase()
                previewElements.push(<p style={outputstyles.section}>{lineTrim}</p>) 
                continue
            }
            else if (containsChords(line)) {
                previewElements.push(<p style={outputstyles.chords}>{line}</p> ) 
                continue
            }
            else {
                previewElements.push(<p style={outputstyles.text}>{line}</p> ) 
                continue
            }
        }
    }

    console.log(previewElements)
    
    return (previewElements)
}

const OutputArea = () => {
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const handleCustomEvent = (event: Event) => {
            setTick((prev) => prev + 1);
        };

        window.addEventListener('update-preview', handleCustomEvent);

        return () => {
            window.removeEventListener('update-preview', handleCustomEvent);
        };
    }, []);

    return (
        <div id="outputarea" className="content-area">
        <span className="output-preview">
        { renderPreview() }
        </span>
        </div>

    )
}

export default OutputArea;
