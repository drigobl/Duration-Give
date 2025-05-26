#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env

import { build } from "https://deno.land/x/esbuild@v0.20.1/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts";

console.log("Building for production...");

try {
  const result = await build({
    entryPoints: ["./src/main.tsx"],
    bundle: true,
    outfile: "./dist/bundle.js",
    minify: true,
    format: "esm",
    target: "es2020",
    plugins: denoPlugins(),
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  });

  console.log("Build complete:", result);
} catch (error) {
  console.error("Build failed:", error);
  Deno.exit(1);
}

// Copy index.html to dist
await Deno.copyFile("./index.html", "./dist/index.html");

console.log("Build process completed successfully!");