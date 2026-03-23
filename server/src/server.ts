import app from "@/app";
import { env } from "@/env";
import { seedSuperAdmin } from "@/lib/db/seed";
import chalk from "chalk";
import { createServer, Server as HTTPServer } from "http";
import { customConsole } from "./utils/customConsole";

const port = env.PORT || 5000;

async function main() {
  const server: HTTPServer = createServer(app).listen(port, () => {
    customConsole(port, 'Funded For You (Server)')
    seedSuperAdmin();
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log(chalk.bgMagenta.white.bold(" ⚠️ Server closed! "));
      });
    }
    process.exit(1);
  };

  process.on("uncaughtException", (error) => {
    console.log(chalk.bgRed.white.bold("❌ Uncaught Exception ❌"));
    console.error(chalk.red(error));
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(chalk.bgRed.white.bold("❌ Unhandled Rejection ❌"));
    console.error(chalk.red(error));
    exitHandler();
  });
}

main();
