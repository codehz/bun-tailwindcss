const channel = new BroadcastChannel("bun-tailwindcss");

export function tw(input: string) {
  const array = input.split(/\s+/g).filter(Boolean);
  if (array.length > 0) {
    channel.postMessage(array);
  }
  return array.join(" ");
}
