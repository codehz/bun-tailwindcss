import type { MessageType } from "./types";

if (typeof window !== "undefined") {
  throw new Error(
    "bun-tailwindcss is not supported in browsers. Please import as macro."
  );
}

const channel = new BroadcastChannel("bun-tailwindcss");

export function tw(...inputs: string[]) {
  const contents = inputs
    .flatMap((input) => input.split(/\s+/g))
    .filter(Boolean);
  if (contents.length > 0) {
    channel.postMessage({ type: "candidates", contents } satisfies MessageType);
  }
  return contents.join(" ");
}

export function makeClass(prefix: string, ...classes: string[]) {
  const contents = classes
    .flatMap((input) => input.split(/\s+/g))
    .filter(Boolean);
  if (contents.length === 0) {
    return "";
  }
  channel.postMessage({
    type: "class",
    prefix,
    contents,
  } satisfies MessageType);
  return prefix + "-" + Bun.hash.adler32(contents.join(" ")).toString(16);
}
