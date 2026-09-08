import InputArea from './InputArea'
import OutputPreview from './OutputPreview'
import { InputControls } from './InputControls.tsx';
import { OutputControls } from './OutputControls.tsx';
import { useRef, useState } from 'react';
import { ReactStateController } from '../types.ts';

const Chordbookerizer = () => {
    const [showPianoChords, setShowPianoChords] = useState<boolean>(false);
    const [showFlatsKeyLabel, setShowFlatsKeyLabel] = useState<boolean>(false);
    const [showFlatsSongChords, setShowFlatsSongChords] = useState<boolean>(false);
    // For copying
    const previewRef = useRef<HTMLElement>(null);

    const updatePreview = () => {
        window.dispatchEvent(new CustomEvent('update-preview'));
    } 

    return (
        <div className="chordbookerizer">
            <span>
                <h3>Song Info/Chords</h3>
                <hr />
            </span>

            <span>
                <h3>Preview</h3>
                <hr />
            </span>


            <InputControls updatePreview={updatePreview}/>
            <OutputControls 
                optPianoChordsController={new ReactStateController(showPianoChords, setShowPianoChords)}
                optFlatsKeyLabelController={new ReactStateController(showFlatsKeyLabel, setShowFlatsKeyLabel)}
                optFlatsSongChordsController={new ReactStateController(showFlatsSongChords, setShowFlatsSongChords)}
                previewRef={previewRef}
            />

            <InputArea updatePreview={updatePreview}/>
            <OutputPreview
                optPianoChords={showPianoChords}
                optFlatsKeyLabel={showFlatsKeyLabel}
                optFlatsSongChords={showFlatsSongChords}
                previewRef={previewRef}
            />
        </div>
    )
}

export default Chordbookerizer
