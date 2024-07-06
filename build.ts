import { compile } from "tailwindcss";

export class TailwindCSSCollector {
  #channel = new BroadcastChannel("bun-tailwindcss");
  #candidates = new Set<string>();
  #listener = (e: MessageEvent<any>) => {
    e.data.forEach((c: string) => this.#candidates.add(c));
  };
  #tailwind: ReturnType<typeof compile>;

  constructor(css: string) {
    this.#channel.addEventListener("message", this.#listener);
    this.#tailwind = compile(css);
  }
  collect() {
    return this.#tailwind.build([...this.#candidates]);
  }
  [Symbol.dispose]() {
    this.#channel.removeEventListener("message", this.#listener);
    this.#channel.close();
  }
}
