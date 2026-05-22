"use client";

import { useEffect, useState } from "react";

const FULL_TEXT = "Can You Beat Rizal?";
const PLAIN_LENGTH = "Can You Beat ".length;

export default function TypingHeading() {
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && count < FULL_TEXT.length) {
      timeout = setTimeout(() => setCount((c) => c + 1), 80);
    } else if (!deleting && count === FULL_TEXT.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && count > 0) {
      timeout = setTimeout(() => setCount((c) => c - 1), 45);
    } else {
      timeout = setTimeout(() => setDeleting(false), 600);
    }

    return () => clearTimeout(timeout);
  }, [count, deleting]);

  const visible = FULL_TEXT.slice(0, count);
  const plain = visible.slice(0, Math.min(count, PLAIN_LENGTH));
  const rizal = count > PLAIN_LENGTH ? visible.slice(PLAIN_LENGTH) : "";

  return (
    <>
      {plain}
      {rizal && (
        <span className="text-primary-container italic">{rizal}</span>
      )}
      <span
        aria-hidden
        className="typing-cursor inline-block w-[3px] bg-primary-container ml-1 align-middle"
      />
    </>
  );
}
