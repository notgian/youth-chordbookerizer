import type { OutputControlProps } from "../types";

const OutputControls: React.FC<OutputControlProps> = ({ 
        setOptFlatsKeyLabel, setOptFlatsSongChords, setOptPianoChords, optFlatsKeyLabel, optFlatsSongChords, optPianoChords, previewRef
    }) => 
    {

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


    return (

        <div className="output-controls">
            <span className="output-controls-checkboxes">
                <label className="checkbox-container">
                    Preview Piano Chords
                    <input
                        type="checkbox" 
                        checked={optPianoChords}
                        onChange={(e) => setOptPianoChords(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                </label>

                <label className="checkbox-container">
                    Flats in Song Key Label
                    <input
                        type="checkbox" 
                        checked={optFlatsKeyLabel}
                        onChange={(e) => setOptFlatsKeyLabel(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                </label>

                <label className="checkbox-container">
                    Flats in Chords
                    <input
                        type="checkbox" 
                        checked={optFlatsSongChords}
                        onChange={(e) => setOptFlatsSongChords(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                </label>

            </span>

            <button 
                className="copy-preview-button" 
                onClick={handleCopyPreview}
            >Copy Chords</button>
        </div>
    );
}

export {
    OutputControls
}
