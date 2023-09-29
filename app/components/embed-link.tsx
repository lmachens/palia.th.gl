"use client";

import { useEffect, useState } from "react";

export default function EmbedLink() {
  const [href, setHref] = useState("");

  useEffect(() => {
    setHref(location.href.replace("/embed", ""));
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      className="absolute bottom-3 right-3 z-[400] bg-neutral-900 font-semibold text-gray-200 text-sm py-1 px-2 border border-gray-600 rounded-2xl outline-none hover:bg-neutral-800 flex gap-1.5 items-center"
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 7l6 -3l6 3l6 -3l0 13l-6 3l-6 -3l-6 3l0 -13" />
        <path d="M9 4l0 13" />
        <path d="M15 7l0 13" />
      </svg>
      palia.th.gl
    </a>
  );
}
