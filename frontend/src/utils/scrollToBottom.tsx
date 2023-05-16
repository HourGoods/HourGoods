import React from "react";

export const scrollToBottom = (element: HTMLDivElement | null) => {
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }
};

