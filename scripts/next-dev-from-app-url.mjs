import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function readDotEnv() {
  const envPath = resolve(process.cwd(), ".env");

  if (!existsSync(envPath)) {
    return {};
  }

  return Object.fromEntries(
    readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        const key = line.slice(0, index).trim();
        const value = line
          .slice(index + 1)
          .trim()
          .replace(/^(['"])(.*)\1$/, "$2");

        return [key, value];
      }),
  );
}

const env = { ...readDotEnv(), ...process.env };
const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const url = new URL(appUrl);
const hostname = url.hostname || "localhost";
const bindHost = ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(hostname)
  ? hostname
  : "0.0.0.0";
const port = url.port || "3000";

console.log(`Starting Next.js for NEXT_PUBLIC_APP_URL=${appUrl}`);

const child = spawn("next", ["dev", "-H", bindHost, "-p", port], {
  env,
  shell: process.platform === "win32",
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }

  process.exit(code ?? 0);
});
