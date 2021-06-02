import path from "path"
import { defineConfig } from "vite"

const external = ["electron", "electron-updater"]

const builtins = [
  "assert",
  "async_hooks",
  "buffer",
  "child_process",
  "cluster",
  "console",
  "constants",
  "crypto",
  "dgram",
  "dns",
  "domain",
  "events",
  "fs",
  "http",
  "http2",
  "https",
  "inspector",
  "module",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "repl",
  "stream",
  "string_decoder",
  "timers",
  "tls",
  "trace_events",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "zlib",
]

const extPackages = [...builtins, ...external]

export default defineConfig({
  resolve: {
    alias: {
      "@/": path.join(process.cwd(), "./src/") + "/",
    },
  },
  build: {
    sourcemap: "inline",
    target: `node14`,
    outDir: "dist",
    assetsDir: ".",
    minify: process.env.MODE === "development" ? false : "terser",
    lib: {
      entry: "src/main.ts",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: extPackages,
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
    emptyOutDir: true,
  },
})
