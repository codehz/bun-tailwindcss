import { compile } from "tailwindcss";
import type { MessageType } from "./types";

export class TailwindCSSCollector {
  #channel = new BroadcastChannel("bun-tailwindcss");
  #candidates = new Set<string>();
  #class = new Map<string, string[]>();
  #listener = (e: MessageEvent<MessageType>) => {
    switch (e.data.type) {
      case "candidates":
        e.data.contents.forEach((c: string) => this.#candidates.add(c));
        break;
      case "class":
        this.#class.set(
          e.data.prefix +
            "-" +
            Bun.hash.adler32(e.data.contents.join(" ")).toString(16),
          e.data.contents
        );
        break;
    }
  };

  constructor(private css: string) {
    this.#channel.addEventListener("message", this.#listener);
  }
  collect() {
    const generatedClasses = [...this.#class].map(
      ([name, contents]) => `.${name} { @apply ${contents.join(" ")}; }`
    );
    const css = [this.css, ...generatedClasses].join("\n");
    return compile(css).build([...this.#candidates]);
  }
  [Symbol.dispose]() {
    this.#channel.removeEventListener("message", this.#listener);
    this.#channel.close();
  }
}
