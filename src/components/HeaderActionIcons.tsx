import React from 'react';

/** Filled play — matches common “run code” control (Heroicons-style). */
export function IconRunPlay({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V19.89a1.5 1.5 0 0 0 2.3 1.269l11.344-7.89a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
    </svg>
  );
}

/** Sparkles — four-point / magic assistant (Heroicons solid sparkles, simplified single path). */
export function IconAiSparkles({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.698l.258 6.653a.75.75 0 0 1-.728.727l-6.653.258a.75.75 0 0 1-.728-.728l-.258-6.653a.75.75 0 0 1 .728-.727l6.653-.258Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
