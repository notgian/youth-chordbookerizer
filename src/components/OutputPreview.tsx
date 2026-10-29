import type { CSSProperties } from "react";
import { Fragment, useSyncExternalStore } from "react";

import type { OutputPreviewProps } from "../types";
import { containsChords, containsChordsSection } from "../utils/chords";
import {
  sharpToFlat,
  sharpToFlatChord,
  transposeChord,
  transposeLine,
} from "../utils/transposer.ts";

/* constants for styles*/
const chordColor = "#4a86e8";
const chordsFont = "Arial";

const outputstyles: Record<string, CSSProperties> = {
  h1: {
    fontSize: "18pt",
    textAlign: "center",
    margin: 0,
    color: "#000",
    fontFamily: chordsFont,
  },
  h2: {
    fontSize: "12pt",
    textAlign: "center",
    textDecoration: "underline",
    margin: 0,
    color: "#000",
    fontFamily: chordsFont,
  },
  h3: { fontSize: "12pt", margin: 0, color: "#000", fontFamily: chordsFont },
  chords: {
    fontSize: "11pt",
    whiteSpace: "pre-wrap",
    margin: 0,
    color: chordColor,
    fontFamily: chordsFont,
  },
  text: {
    fontSize: "11pt",
    margin: 0,
    color: "#000",
    fontFamily: chordsFont,
  },
  section: {
    fontSize: "11pt",
    textDecoration: "underline",
    margin: 0,
    color: "#000",
    fontFamily: chordsFont,
  },
};

// For the sync external store
function subscribe(callback: () => void) {
  globalThis.addEventListener("update-preview", callback);
  return () => globalThis.removeEventListener("update-preview", callback);
}

let cachedSnapshot = {
  title: "",
  keyNote: "",
  keyType: "",
  keySig: "",
  capo: "",
  chords: "",
};

const getRawTextSnapshot = () => {
  const titleInput = document.querySelector("#input-title");
  const title = titleInput instanceof HTMLInputElement ? titleInput.value : "";

  const textarea = document.querySelector("#input-chords");
  const chords = textarea instanceof HTMLTextAreaElement ? textarea.value : "";

  const keyNoteEl = document.querySelector("#input-key-name");
  const keyTypeEl = document.querySelector("#input-key-type");

  const keyNote =
    keyNoteEl instanceof HTMLSelectElement && keyNoteEl && keyNoteEl.value.trim()
      ? keyNoteEl.value.trim()
      : "";
  const keyType =
    keyTypeEl instanceof HTMLSelectElement && keyTypeEl && keyTypeEl.value.trim()
      ? keyTypeEl.value.trim()
      : "";

  const keySigTop = document.querySelector("#input-signature-top");
  const keySigBot = document.querySelector("#input-signature-bot");
  const keySig =
    keySigTop instanceof HTMLSelectElement &&
    keySigBot instanceof HTMLSelectElement &&
    keySigTop &&
    keySigTop.value.trim() &&
    keySigBot &&
    keySigBot.value.trim()
      ? `${keySigTop.value.trim()}/${keySigBot.value.trim()}`
      : "";

  const capoInput = document.querySelector("#input-capo");
  const capo =
    capoInput instanceof HTMLInputElement && capoInput && Number(capoInput.value?.trim()) > 0
      ? capoInput.value.trim()
      : "";

  const cs = cachedSnapshot;
  if (
    cs.title !== title ||
    cs.chords !== chords ||
    cs.keyNote !== keyNote ||
    cs.keyType !== keyType ||
    cs.keySig !== keySig ||
    cs.capo !== capo
  ) {
    cachedSnapshot = { title, keyNote, keyType, chords, keySig, capo };
  }

  return cachedSnapshot;
};

// Component
const OutputPreview: React.FC<OutputPreviewProps> = ({
  optPianoChords,
  optFlatsKeyLabel,
  optFlatsSongChords,
  optOverallTransposeFactor,
  previewRef,
}) => {
  const snapshot = useSyncExternalStore(subscribe, getRawTextSnapshot);
  const titleText = snapshot.title;
  const { keyNote } = snapshot;
  const { keyType } = snapshot;
  const { keySig } = snapshot;
  const { capo } = snapshot;
  const chordsText = snapshot.chords;
  const additionalTranspose = optOverallTransposeFactor;

  // Output options

  const renderPreview = (): React.JSX.Element[] => {
    let preview: React.JSX.Element[] = [];

    if (titleText) {
      preview.push(
        <h3 key="title" style={outputstyles.h3}>
          {capo && !optPianoChords ? `${titleText} (CAPO ${capo})` : titleText}
        </h3>,
      );
    }
    if (keyNote && keyType) {
      let note = keyNote;
      if (additionalTranspose) {
        note = transposeChord(note, additionalTranspose) ?? "";
      }

      note = optFlatsKeyLabel ? sharpToFlat(note) : note;
      preview.push(
        <p key="key" style={outputstyles.text}>
          Key: {`${note} ${keyType}`}
        </p>,
      );
    }
    if (keySig) {
      preview.push(
        <p key="keySig" style={outputstyles.text}>
          {keySig}
        </p>,
      );
    }
    if (capo && !optPianoChords) {
      preview.push(
        <p key="capo" style={outputstyles.text}>
          Capo {capo}
        </p>,
      );
    }

    // Add a space before chords IFF title/other stuff
    // precede the chords
    if (preview.length > 0) {
      preview.push(<br key="top-br" />);
    }

    if (chordsText) {
      const chords = chordsText.split("\n").flatMap((lineRaw, index) => {
        if (lineRaw.trim() === "") {
          return [];
        }

        const chordSectionLabel: string = containsChordsSection(lineRaw) ?? "";
        if (chordSectionLabel) {
          const spaces: React.JSX.Element[] = [];

          const spaceCount = 2;
          for (let i = 0; i < spaceCount; i++) {
            spaces.push(<br key={`space-${index}-${i}`} />);
          }

          return (
            <Fragment key={`section-${index}`}>
              {spaces}
              <p style={outputstyles.section}>{chordSectionLabel.toUpperCase()}</p>
            </Fragment>
          );
        }
        if (containsChords(lineRaw)) {
          const line = optOverallTransposeFactor
            ? transposeLine(lineRaw, optOverallTransposeFactor)
            : lineRaw;
          if (optPianoChords && Number(capo) > 0) {
            const t = transposeLine(line, Number(capo), optFlatsSongChords);
            return (
              <p key={index} style={outputstyles.chords}>
                {t}
              </p>
            );
          }
          if (optFlatsSongChords) {
            let flatsLine = line;
            const tokens = flatsLine.split(/[\s]+/g);
            for (const token of tokens) {
              if (token === "" || token.length === 0) {
                continue;
              }
              flatsLine = flatsLine.replace(token, sharpToFlatChord(token));
            }
            return (
              <p key={index} style={outputstyles.chords}>
                {flatsLine}
              </p>
            );
          }
          return (
            <p key={index} style={outputstyles.chords}>
              {line}
            </p>
          );
        }

        return (
          <p key={index} style={outputstyles.text}>
            {lineRaw}
          </p>
        );
      });

      preview = [...preview, ...chords];
    }

    return preview;
  };

  return (
    <span id="output-preview" className="output-preview" ref={previewRef}>
      {renderPreview()}
    </span>
  );
};

export default OutputPreview;
