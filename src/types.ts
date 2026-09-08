import type { RefObject } from "react";

export class ReactStateController<T>{
    private setFunc: (e:T) => void;
    value: T;

    constructor(myvar: T, func: (e:T)=>void) {
        this.value = myvar;
        this.setFunc = func;
    }

    set(val: T) {
        this.setFunc(val);
    }
}

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
    optPianoChordsController: ReactStateController<boolean>;
    optFlatsKeyLabelController: ReactStateController<boolean>;
    optFlatsSongChordsController: ReactStateController<boolean>;

    previewRef: RefObject<HTMLElement | null>;
}

