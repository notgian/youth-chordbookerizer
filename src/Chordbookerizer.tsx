import InputArea from './InputArea'
import OutputArea from './OutputArea'
import { InputControls } from './InputControls.tsx';
import { OutputControls } from './OutputControls.tsx';
import { useRef, useState } from 'react';

const Chordbookerizer = () => {
    const [showPianoChords, setShowPianoChords] = useState<boolean>(false);
    const [showFlatsKeyLabel, setShowFlatsKeyLabel] = useState<boolean>(false);
    const [showFlatsSongChords, setShowFlatsSongChords] = useState<boolean>(false);
    // For copying
    const previewRef = useRef<HTMLElement>(null);

    return (
        <div className="chordbookerizer">
            <h3>Song Info/Chords</h3>
            <h3>Preview</h3>

            <InputControls />
            <OutputControls 
                optPianoChords={showPianoChords}
                optFlatsKeyLabel={showFlatsKeyLabel}
                optFlatsSongChords={showFlatsSongChords}
                setOptPianoChords={setShowPianoChords}
                setOptFlatsKeyLabel={setShowFlatsKeyLabel}
                setOptFlatsSongChords={setShowFlatsSongChords}
                previewRef={previewRef}
            />

            <InputArea />
            <OutputArea 
                optPianoChords={showPianoChords}
                optFlatsKeyLabel={showFlatsKeyLabel}
                optFlatsSongChords={showFlatsSongChords}
                previewRef={previewRef}
            />
        </div>
    )
}

export default Chordbookerizer
