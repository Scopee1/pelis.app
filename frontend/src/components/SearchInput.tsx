import { useEffect, useRef, useState } from "react";
import { SEARCH_DEBOUNCE_MS } from "../constants/movie";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

interface SearchInputProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({ value, onSearch, placeholder = "Buscar…" }: SearchInputProps) => {
  const [text, setText] = useState(value);
  const debouncedText = useDebouncedValue(text.trim(), SEARCH_DEBOUNCE_MS);
  const lastSearched = useRef(value);

  useEffect(() => {
    if (debouncedText === lastSearched.current) return;
    lastSearched.current = debouncedText;
    onSearch(debouncedText);
  }, [debouncedText, onSearch]);

  return (
    <input
      type="search"
      aria-label={placeholder}
      className="input"
      placeholder={placeholder}
      value={text}
      onChange={(event) => setText(event.target.value)}
    />
  );
};
