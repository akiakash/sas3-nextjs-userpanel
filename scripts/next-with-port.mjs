import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const devLockPath = path.join(projectRoot, ".next/dev/lock");

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, "0.0.0.0");
  });
}

async function findAvailablePort(startPort, maxAttempts = 100) {
  for (let port = startPort; port < startPort + maxAttempts; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(`No available port found starting from ${startPort}`);
}

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function stopExistingDevServer() {
  let lockContent;

  try {
    lockContent = fs.readFileSync(devLockPath, "utf-8");
  } catch {
    return;
  }

  let serverInfo;

  try {
    serverInfo = JSON.parse(lockContent);
  } catch {
    fs.unlinkSync(devLockPath);
    return;
  }

  const { pid } = serverInfo;

  if (pid && isProcessRunning(pid)) {
    console.log(`Stopping existing dev server (PID ${pid})...`);

    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // Process may have exited between checks.
    }

    for (let attempt = 0; attempt < 50; attempt++) {
      if (!isProcessRunning(pid)) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (isProcessRunning(pid)) {
      try {
        process.kill(pid, "SIGKILL");
      } catch {
        // ignore
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  try {
    fs.unlinkSync(devLockPath);
  } catch {
    // ignore
  }
}

const [, , command, ...args] = process.argv;

if (!command || !["dev", "start"].includes(command)) {
  console.error("Usage: node scripts/next-with-port.mjs <dev|start> [next args...]");
  process.exit(1);
}

if (command === "dev") {
  await stopExistingDevServer();
}

const startPort = Number.parseInt(process.env.PORT ?? "3000", 10);
const port = await findAvailablePort(startPort);

if (port !== startPort) {
  console.log(`Port ${startPort} is in use, using port ${port} instead.`);
}

const child = spawn(process.execPath, [nextBin, command, "-p", String(port), ...args], {
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
