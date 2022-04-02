import { writable } from "svelte/store";

let stored: string;

if (typeof window !== "undefined")
  stored = localStorage.live_content;

export const live_content = writable(stored || "");

live_content.subscribe(value => {
  if (typeof window !== "undefined")
    localStorage.live_content = value;
});