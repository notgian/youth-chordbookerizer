import type { InputProps } from './types.ts';

const InputArea: React.FC<InputProps> = ({updatePreview}) => {
    return (
        <textarea 
            onChange={updatePreview}
            placeholder="Place the song chords here" 
            id="input-chords"
        />
    );
}

export default InputArea;
