import type { OutputControlProps } from "../types";

const OutputControls: React.FC<OutputControlProps> = ({ 
        optFlatsKeyLabelController, optFlatsSongChordsController, optPianoChordsController, optOverallTransposeFactorController, 
        previewRef
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

    const handleTranspose = (factor: number) => {
        if (factor === 0) {
            return
        }

        const currentValue = optOverallTransposeFactorController.value;
        let newValue = currentValue + factor;
        if (newValue < -11 || newValue > 11)
            newValue = 0;

        optOverallTransposeFactorController.set(newValue);

    }


    return (

        <div className="output-controls">
            <span className="output-controls-checkboxes">
                <label className="checkbox-container">
                    Preview Piano Chords
                    <input
                        type="checkbox" 
                        checked={optPianoChordsController.value}
                        onChange={(e) => optPianoChordsController.set(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                </label>

                <label className="checkbox-container">
                    Flats in Song Key Label
                    <input
                        type="checkbox" 
                        checked={optFlatsKeyLabelController.value}
                        onChange={(e) => optFlatsKeyLabelController.set(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                </label>

                <label className="checkbox-container">
                    Flats in Chords
                    <input
                        type="checkbox" 
                        checked={optFlatsSongChordsController.value}
                        onChange={(e) => optFlatsSongChordsController.set(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                </label>
            </span>

            <span className="transpose-controls-container">
                <span>
                    <span>
                        <b>
                            Transpose
                        </b>
                    </span>
                    <span className="transpose-controls-value">
                        <sup>
                            {(() => {
                                const transposeFactor = optOverallTransposeFactorController.value;
                                if (transposeFactor === 0) return ''
                                else if (transposeFactor > 0) return '+'
                                else return '-'
                            })()}
                        </sup>
                        {(() => {
                            const transposeFactor = optOverallTransposeFactorController.value;
                            if (transposeFactor === 0) return ''
                            else return Math.abs(transposeFactor)
                        })()}
                    </span>
                </span>

                <span className="transpose-controls-buttons">
                    <button
                        onClick={() => handleTranspose(-1)}
                    >-</button>
                    <button
                        onClick={() => handleTranspose(1)}
                    >+</button>
                </span>

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
