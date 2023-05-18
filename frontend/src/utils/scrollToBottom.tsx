/* eslint-disable react/react-in-jsx-scope */

export const scrollToBottom = (element: HTMLDivElement | null) => {
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }
};
