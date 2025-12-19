# Action Archive Database Management System

## Build

You need:
- A JavaScript package manager (npm, pnpm, deno, bun, etc)
- Rust 1.77 or greater

Example (using deno)
```shell
deno install
deno task tauri build
```

Note: you need to modify `src-tauri/tauri.conf.json` if using a JavaScript package manager other than deno.

Compiled distribution should be under `project-root/src-tauri/target/release/bundle`
