import React from "react";

export function handleOnKeyPress(
  myFunction: (event: React.KeyboardEvent<HTMLInputElement>) => void
) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      myFunction(e);
    }
  };
  return handleKeyPress;
}
