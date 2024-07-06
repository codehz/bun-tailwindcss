if (typeof window !== "undefined") {
  throw new Error(
    "bun-tailwindcss is not supported in browsers. Please import as macro."
  );
}

const channel = new BroadcastChannel("bun-tailwindcss");

export function tw(input: string) {
  const array = input.split(/\s+/g).filter(Boolean);
  if (array.length > 0) {
    channel.postMessage(array);
  }
  return array.join(" ");
}
