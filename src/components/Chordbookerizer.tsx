import { useRef, useState } from "react";

import { ReactStateController } from "../types.ts";
import InputArea from "./InputArea";
import { InputControls } from "./InputControls.tsx";
import { OutputControls } from "./OutputControls.tsx";
import OutputPreview from "./OutputPreview";

const updatePreview = () => {
  globalThis.dispatchEvent(new CustomEvent("update-preview"));
};

const Chordbookerizer = (): React.JSX.Element => {
  const [showPianoChords, setShowPianoChords] = useState<boolean>(false);
  const [showFlatsKeyLabel, setShowFlatsKeyLabel] = useState<boolean>(false);
  const [showFlatsSongChords, setShowFlatsSongChords] = useState<boolean>(false);
  const [overallTransposeFactor, setOverallTransposeFactor] = useState<number>(0);
  // For copying
  const previewRef = useRef<HTMLElement>(undefined);

  return (
    <div className="chordbookerizer">
      <span>
        <h3>Song Info/Chords</h3>
        <hr />
      </span>

      <span>
        <h3>Preview</h3>
        <hr />
      </span>

      <InputControls updatePreview={updatePreview} />
      <OutputControls
        optPianoChordsController={new ReactStateController(showPianoChords, setShowPianoChords)}
        optFlatsKeyLabelController={
          new ReactStateController(showFlatsKeyLabel, setShowFlatsKeyLabel)
        }
        optFlatsSongChordsController={
          new ReactStateController(showFlatsSongChords, setShowFlatsSongChords)
        }
        optOverallTransposeFactorController={
          new ReactStateController(overallTransposeFactor, setOverallTransposeFactor)
        }
        previewRef={previewRef}
      />

      <InputArea updatePreview={updatePreview} />
      <OutputPreview
        optPianoChords={showPianoChords}
        optFlatsKeyLabel={showFlatsKeyLabel}
        optFlatsSongChords={showFlatsSongChords}
        optOverallTransposeFactor={overallTransposeFactor}
        previewRef={previewRef}
      />
    </div>
  );
};

export default Chordbookerizer;
