import { useEffect, useRef, useState } from "react";
import { Modal } from "../ui/Modal";
import { BigButton } from "../ui/BigButton";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
};

type Phase = "idle" | "recording" | "recorded" | "denied";

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function VoiceRecorder({ open, onClose, onSave }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const previewRef = useRef<HTMLAudioElement | null>(null);

  // Reset when the modal opens; clean up mic on close.
  useEffect(() => {
    if (open) {
      setPhase("idle");
      setDataUrl(null);
      chunksRef.current = [];
    } else {
      stopStream();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        const url = await blobToDataUrl(blob);
        setDataUrl(url);
        setPhase("recorded");
        stopStream();
      };
      recorderRef.current = rec;
      rec.start();
      setPhase("recording");
      // Safety cap: auto-stop after 10 s.
      window.setTimeout(() => {
        if (recorderRef.current && recorderRef.current.state === "recording") {
          recorderRef.current.stop();
        }
      }, 10000);
    } catch {
      setPhase("denied");
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
  }

  function playPreview() {
    if (!dataUrl) return;
    if (!previewRef.current) previewRef.current = new Audio();
    previewRef.current.src = dataUrl;
    void previewRef.current.play();
  }

  function reset() {
    setDataUrl(null);
    setPhase("idle");
    chunksRef.current = [];
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2>🎤 Record your voice</h2>

      {phase === "idle" && (
        <>
          <p className="confirm-text">Tap the red button and say something!</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <BigButton icon="🔴" label="Record" variant="accent" onClick={startRecording} />
          </div>
        </>
      )}

      {phase === "recording" && (
        <>
          <p className="confirm-text rec-blink">🔴 Listening… say something!</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <BigButton icon="⏹️" label="Stop" variant="info" onClick={stopRecording} />
          </div>
        </>
      )}

      {phase === "recorded" && (
        <>
          <p className="confirm-text">Great! Listen to it 👂</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <BigButton icon="▶️" label="Listen" variant="info" onClick={playPreview} />
            <BigButton icon="🔁" label="Again" variant="ghost" onClick={reset} />
          </div>
        </>
      )}

      {phase === "denied" && (
        <p className="confirm-text">
          I couldn't use the microphone. Please allow it and try again. 🎤
        </p>
      )}

      <div className="modal-actions">
        <BigButton icon="✕" label="Cancel" variant="ghost" onClick={onClose} />
        <BigButton
          icon="✓"
          label="Use it"
          variant="good"
          disabled={phase !== "recorded" || !dataUrl}
          onClick={() => {
            if (dataUrl) onSave(dataUrl);
          }}
        />
      </div>
    </Modal>
  );
}
