import type { CSSProperties } from 'react'
import './App.css'

const outputstyles: Record<string, CSSProperties> = {
    h1: {fontSize: '18pt', textAlign: 'center', margin: 0},
    h2: {fontSize: '12pt', textAlign: 'center', textDecoration: 'underline', margin: 0},
    h3: {fontSize: '12pt', margin: 0},
    chords : {fontSize: '11pt', whiteSpace: 'pre-wrap', margin: 0, color: '#4a86e8'},
    text: {fontSize: '11pt', margin: 0},
    section: {fontSize: '11pt', textDecoration: 'underline', margin: 0}
}

const OutputArea = () => {
    return (
        <div id="outputarea" className="content-area">
            <span className="output-preview">


<h1 style={outputstyles.h1}>Saturday</h1>
<h2 style={outputstyles.h2}>MORNING WORSHIP</h2>
<h3 style={outputstyles.h3}>DEAR GOD</h3>
<p style={outputstyles.text}>4/4</p>
<p style={outputstyles.text}>Key: D#</p>
<br />
<p style={outputstyles.section}>INTRO</p>
<p style={outputstyles.chords}>D#</p>
<br/ >
<p style={outputstyles.section}>VERSE 1         </p>
<p style={outputstyles.chords}>     D#                                                    </p>
<p style={outputstyles.text}>Dear God     </p>
<p style={outputstyles.chords}>            Gm                                            G#                                                </p>
<p style={outputstyles.text}>I've been trying awful hard to make You proud of me    	</p>

            </span>
        </div>

    )
}

export default OutputArea;
