# Tailwindcss macro for bun

usage:

in your component:

```tsx
import { tw } from "bun-tailwindcss" with { type: "macro" };

export default function Item({ children }: { children: React.ReactNode }) {
  return <div className={tw('w-1/2 md:w-1/3 lg:w-1/4')}>{children}</div>
}
```

in your build.ts

```tsx
import { TailwindCSSCollector } from "../build";

//@ts-ignore
import input from "tailwindcss/index.css" with { type: "text" };

using collector = new TailwindCSSCollector(input);

await Bun.build({
  entrypoints: ["component.ts"],
  outdir: ".build",
});

const css = collector.collect();
await Bun.write(".build/generated.css", collector.collect());
```