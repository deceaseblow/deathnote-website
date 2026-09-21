import React from "react";

export default function GlowingText({ text }) {
  return (
    <div className="flex w-fit text-white items-center gap-3  cursor-pointer px-4 py-2 transition-all duration-300 overflow-visible hover:scale-105 rounded-lg">
      <span className="text-white text-[25px]">→</span>
      <span className="text-white text-[35px] transition-all duration-300 hover:[text-shadow:0_0_5px_white,0_0_10px_white,0_0_20px_white]">
        {text}
      </span>
    </div>
  );
}
