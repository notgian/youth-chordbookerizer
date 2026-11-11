import type { RefObject } from "react";

export class ReactStateController<T> {
  private readonly setFunc: (e: T) => void;
  value: T;

  constructor(myvar: T, func: (e: T) => void) {
    this.value = myvar;
    this.setFunc = func;
  }

  set(val: T): void {
    this.setFunc(val);
  }
}

export type InputProps = {
  updatePreview: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
};

export type OutputPreviewProps = {
  optPianoChords: boolean;
  optFlatsKeyLabel: boolean;
  optFlatsSongChords: boolean;
  optOverallTransposeFactor: number;

  previewRef: RefObject<HTMLSpanElement>;
};

export type OutputControlProps = {
  optPianoChordsController: ReactStateController<boolean>;
  optFlatsKeyLabelController: ReactStateController<boolean>;
  optFlatsSongChordsController: ReactStateController<boolean>;
  optOverallTransposeFactorController: ReactStateController<number>;

  previewRef: RefObject<HTMLSpanElement>;
};
