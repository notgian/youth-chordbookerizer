

const InputArea = () => {
    const updatePreview = () => {
        window.dispatchEvent(new CustomEvent('update-preview'));
    } 

    return (
        <div id="inputarea" className="content-area">
            <input 
                onChange={updatePreview}
                placeholder="Song Title" 
                className=""
            />
            <textarea 
                onChange={updatePreview}
                placeholder="Place the song chords here" 
                className=""
            />
        </div>
    );
}

export default InputArea;
