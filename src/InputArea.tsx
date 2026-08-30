

const InputArea = () => {
    const updatePreview = () => {
        window.dispatchEvent(new CustomEvent('update-preview'));
    } 

    return (
        <div id="inputarea" className="content-area">
            <input 
                onChange={updatePreview}
                placeholder="Song Title" 
                id="input-title"
            />
            <span className="input-key-and-signature input-double-group">
                <span className="input-key">
                    <label>Song Key: </label>
                    <select
                        onChange={updatePreview}
                        id="input-key-name"
                    >
                        <option value="" disabled selected>Key</option>
                        <option value="C">C</option>
                        <option value="C#">C#/Db</option>
                        <option value="D">D</option>
                        <option value="D#">D#/Eb</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="F#">F#/Gb</option>
                        <option value="G">G</option>
                        <option value="G#">G#/Ab</option>
                        <option value="A">A</option>
                        <option value="A#">A#/Bb</option>
                        <option value="B">B</option>
                    </select>

                    <select
                        onChange={updatePreview}
                        id="input-key-type"
                    >
                        <option value="Major" selected>Major</option>
                        <option value="Minor">Minor</option>
                    </select>
                </span>

                <span className="input-time-signature">
                    <label>Time Signature: </label>
                    <span className="input-signature-block">
                        <input 
                            onChange={updatePreview}
                            className="input-signature"
                            id="input-signature-top"
                            type="number"
                        />
                        <span className="input-signature-sep">/</span>
                        <input 
                            onChange={updatePreview}
                            className="input-signature"
                            id="input-signature-bot"
                            type="number"
                        />
                    </span>
                </span>
            </span>

            <span className="input-capo-and-transpose input-double-group">
                <span className="input-capo-container">
                    <label>Capo: </label>
                    <input
                        onChange={updatePreview}
                        id="input-capo"
                        type="number"
                        placeholder="0"
                        min="0"
                    />
                </span>
                
                {/* NOTE: currently commenting this out as this feature may or may not be used

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

                */}
            </span>
            <textarea 
                onChange={updatePreview}
                placeholder="Place the song chords here" 
                id="input-chords"
            />
        </div>
    );
}

export default InputArea;
