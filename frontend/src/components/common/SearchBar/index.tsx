import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import "./index.scss";

interface ISearchProps {
  searchInput?: string;
  setSearchInput?: any;
  onSubmit?: any;
}
export default function index({
  searchInput,
  setSearchInput,
  onSubmit,
}: ISearchProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(searchInput);
  };

  return (
    <form className="search-bar-container" onSubmit={handleSubmit}>
      <MagnifyingGlassIcon />
      <input
        type="text"
        name=""
        id=""
        placeholder="검색하기"
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button type="submit">
        <p>확인</p>
      </button>
    </form>
  );
}
