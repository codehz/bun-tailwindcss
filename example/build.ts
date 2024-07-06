import { TailwindCSSCollector } from "../build";

//@ts-ignore
import input from "tailwindcss/index.css" with { type: "text" };

using collector = new TailwindCSSCollector(input);

await Bun.build({
  entrypoints: ["input.ts"],
  outdir: ".build",
});

const css = collector.collect();
console.log(css);
