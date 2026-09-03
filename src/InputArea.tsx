

const InputArea = () => {
    const updatePreview = () => {
        window.dispatchEvent(new CustomEvent('update-preview'));
    } 

    return (
        <div id="inputarea" className="content-area">
            <label>Song Title: </label>
            <input 
                onChange={updatePreview}
                placeholder="Song Title" 
                id="input-title"
            />

            <label>Song Key: </label>
            <span className="input-key">
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

            <label>Time Signature: </label>
            <span className="input-time-signature">
                <input 
                    onChange={updatePreview}
                    className="input-signature"
                    id="input-signature-top"
                    type="number"
                    placeholder="4"
                />
                <span className="input-signature-sep">/</span>
                <input 
                    onChange={updatePreview}
                    className="input-signature"
                    id="input-signature-bot"
                    type="number"
                    placeholder="4"
                />
            </span>

            <label>Capo: </label>
            <span className="input-capo-container">
                <input
                    onChange={updatePreview}
                    id="input-capo"
                    type="number"
                    placeholder="0"
                    min="0"
                    max="11"
                />
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
