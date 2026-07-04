"use client";

import { useId, useRef, useState } from "react";

interface FileDropProps {
  label: string;
  accept: string;
  hint: string;
  fileName?: string;
  onLoad: (name: string, content: string) => void;
  onClear: () => void;
}

export function FileDrop({ label, accept, hint, fileName, onLoad, onClear }: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputId = useId();

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onLoad(file.name, String(reader.result ?? ""));
    reader.readAsText(file);
  }

  const state = dragOver
    ? "border-brand bg-brand-soft"
    : fileName
      ? "border-moat bg-moat-soft"
      : "border-hairline bg-surface hover:border-brand/50";

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={`rounded-xl border-2 border-dashed p-5 text-center transition-colors ${state}`}
      >
        {fileName ? (
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" className="text-moat" aria-hidden="true">
              <path
                d="M3 8.5l3 3 7-7"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-medium text-ink">{fileName}</span>
            <button
              type="button"
              onClick={() => {
                onClear();
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="text-xs text-ink-soft underline hover:text-ink"
            >
              remove
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-ink-soft">
              Drag &amp; drop, or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-semibold text-brand underline"
              >
                browse
              </button>
            </p>
            <p className="mt-1 text-xs text-ink-soft">{hint}</p>
          </>
        )}
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
    </div>
  );
}
