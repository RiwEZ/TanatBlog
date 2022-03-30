import { writable } from "svelte/store";

const stored = localStorage.live_content;

export const content = writable(stored || "");

content.subscribe(value => {
  localStorage.live_content = value;
});