import { TailwindCSSCollector } from "../build";

//@ts-ignore
import input from "./tailwind.css" with { type: "text" };

using collector = new TailwindCSSCollector(input, import.meta.dir);

await Bun.build({
  entrypoints: ["input.ts"],
  outdir: ".build",
});

const css = await collector.collect();
console.log(css);
