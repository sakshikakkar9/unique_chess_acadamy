import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAvatarStyles = (name: string) => {
  const firstLetter = (name || "?").charAt(0).toUpperCase();
  if ("ABCDE".includes(firstLetter)) return { bg: "#e0f2fe", color: "#0284c7" };
  if ("FGHIJ".includes(firstLetter)) return { bg: "#ede9fe", color: "#6d28d9" };
  if ("KLMNO".includes(firstLetter)) return { bg: "#d1fae5", color: "#065f46" };
  if ("PQRST".includes(firstLetter)) return { bg: "#fef3c7", color: "#b45309" };
  return { bg: "#fce7f3", color: "#be185d" };
};
