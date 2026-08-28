

const InputArea = () => {
    const updatePreview = () => {
        window.dispatchEvent(new CustomEvent('update-preview'));
    } 

    return (
        <div id="inputarea" className="content-area">
            <input 
                onChange={updatePreview}
                placeholder="Song Title" 
                className="input-title"
            />
            <span className="input-key-and-signature input-double-group">
                <span className="input-key">
                    <label>Song Key: </label>
                    <select
                        onChange={updatePreview}
                        className="input-key-name"
                    >
                        <option disabled selected>Key</option>
                        <option>C</option>
                        <option>C#/Db</option>
                        <option>D</option>
                        <option>D#/Eb</option>
                        <option>E</option>
                        <option>F</option>
                        <option>F#/Gb</option>
                        <option>G</option>
                        <option>G#/Ab</option>
                        <option>A</option>
                        <option>A#/Bb</option>
                        <option>B</option>
                    </select>

                    <select
                        onChange={updatePreview}
                        className="input-key-major-minor"
                    >
                        <option selected>Major</option>
                        <option>Minor</option>
                    </select>
                </span>

                <span className="input-time-signature">
                    <label>Time Signature: </label>
                    <span className="input-signature-block">
                        <input 
                            onChange={updatePreview}
                            className="input-signature input-signature-top"
                            type="number"
                            value="4"
                        />
                        <span className="input-signature-sep">/</span>
                        <input 
                            onChange={updatePreview}
                            className="input-signature input-signature-bot"
                            type="number"
                            value="4"
                        />
                    </span>
                </span>
            </span>

            <span className="input-capo-and-transpose input-double-group">
                <span className="input-capo-container">
                    <label>Capo: </label>
                    <input
                        onChange={updatePreview}
                        className="input-capo"
                        type="number"
                        placeholder="0"
                        min="0"
                    />
                </span>

                <span className="input-transpose-container">
                    <label>Transpose: </label>
                    <span id="transpose-number-display"></span>
                    <input type="hidden" id="transpose-number" value="0" />
                    <span className="input-transpose-block input-block">
                        <button 
                            className="input-transpose-button"
                        >-</button> 
                        <button 
                            className="input-transpose-button"
                        >+</button> 
                    </span>
                </span>
            </span>
            <textarea 
                onChange={updatePreview}
                placeholder="Place the song chords here" 
                className="input-chords"
            />
        </div>
    );
}

export default InputArea;
