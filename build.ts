import EnhancedResolve from "enhanced-resolve";
import fs from "node:fs";
import { dirname, extname } from "node:path";
import { compile } from "tailwindcss";
import type { MessageType } from "./types";

const cssResolver = EnhancedResolve.ResolverFactory.createResolver({
  fileSystem: new EnhancedResolve.CachedInputFileSystem(fs, 4000),
  useSyncFileSystemCalls: true,
  extensions: [".css"],
  mainFields: ["style"],
  conditionNames: ["style"],
});

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
  async collect() {
    const generatedClasses = [...this.#class].map(
      ([name, contents]) => `.${name} { @apply ${contents.join(" ")}; }`
    );
    const css = [this.css, ...generatedClasses].join("\n");
    const compiled = await compile(css, { loadModule, loadStylesheet });
    return compiled.build([...this.#candidates]);
  }
  [Symbol.dispose]() {
    this.#channel.removeEventListener("message", this.#listener);
    this.#channel.close();
  }
}

async function loadModule(
  id: string,
  base: string
): Promise<{
  module: any;
  base: string;
}> {
  const resolvedPath = Bun.fileURLToPath(import.meta.resolve(id, base));
  const module = await import(resolvedPath);
  return { module: module.default ?? module, base: dirname(resolvedPath) };
}

async function loadStylesheet(
  id: string,
  base: string
): Promise<{
  content: string;
  base: string;
}> {
  const resolvedPath = await resolveCssId(id, base);
  if (!resolvedPath)
    throw new Error(`Could not resolve '${id}' from '${base}'`);

  const content = await Bun.file(resolvedPath).text();
  return { content, base: dirname(resolvedPath) };
}

async function resolveCssId(
  id: string,
  base: string
): Promise<string | false | undefined> {
  const skipRelativeCheck = extname(id) === "" || id.startsWith(".");

  if (!skipRelativeCheck) {
    try {
      const dotResolved = await runResolver(cssResolver, `./${id}`, base);
      if (!dotResolved) throw new Error();
      return dotResolved;
    } catch {}
  }

  return runResolver(cssResolver, id, base);
}

function runResolver(
  resolver: EnhancedResolve.Resolver,
  id: string,
  base: string
): Promise<string | false | undefined> {
  return new Promise((resolve, reject) =>
    resolver.resolve({}, base, id, {}, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    })
  );
}
