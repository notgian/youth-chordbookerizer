import { updatePreview } from './InputControls.tsx'

const InputArea = () => {
    return (
            
        <textarea 
            onChange={updatePreview}
            placeholder="Place the song chords here" 
            id="input-chords"
        />
    );
}

export default InputArea;
