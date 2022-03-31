import { writable } from "svelte/store";

let stored: string;

if (typeof window !== "undefined")
  stored = localStorage.live_content;

export const content = writable(stored || "");

content.subscribe(value => {
  if (typeof window !== "undefined")
    localStorage.live_content = value;
});