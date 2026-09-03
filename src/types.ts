import type { RefObject } from "react";

export interface InputProps {
    updatePreview: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export interface OutputPreviewProps {
    optPianoChords: boolean;
    optFlatsKeyLabel: boolean;
    optFlatsSongChords: boolean;

    previewRef: RefObject<HTMLElement | null>;
}

export interface OutputControlProps {
    setOptPianoChords: (e: boolean) => void;
    setOptFlatsKeyLabel: (e: boolean) => void;
    setOptFlatsSongChords: (e: boolean) => void;

    optPianoChords: boolean;
    optFlatsKeyLabel: boolean;
    optFlatsSongChords: boolean;

    previewRef: RefObject<HTMLElement | null>;
}

