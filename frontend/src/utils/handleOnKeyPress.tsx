/* eslint-disable react/react-in-jsx-scope */

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
