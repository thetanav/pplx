import { clsx, type ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// small debounced value hook
export function useDebouncedValue<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), 0);
    return () => clearTimeout(t);
  }, [value, 0]);

  return debounced;
}
