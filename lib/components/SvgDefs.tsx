"use client";
import React from "react";

export default function SvgDefs() {
  return (
    <svg
      style={{ position: "absolute", pointerEvents: "none", bottom: "100%" }}
    >
      <defs>
        <filter id="disabled-inset-filter" x="0" y="0" width="1px" height="1px">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="
							1 0 0 0 0
							0 1 0 0 0
							0 0 1 0 0
							-2 -2 -2 4 0
						"
            result="dark-parts-isolated"
          />
          <feFlood result="shadow-color" floodColor="rgb(128, 128, 128)" />
          <feFlood result="hilight-color" floodColor="rgb(128, 128, 128)" />
          <feOffset in="dark-parts-isolated" dx="1" dy="1" result="offset" />
          <feComposite
            in="hilight-color"
            in2="offset"
            operator="in"
            result="hilight-colored-offset"
          />
          <feComposite
            in="shadow-color"
            in2="dark-parts-isolated"
            operator="in"
            result="shadow-colored"
          />
          <feMerge>
            <feMergeNode in="hilight-colored-offset" />
            <feMergeNode in="shadow-colored" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
