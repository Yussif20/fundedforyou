import { env } from "@/env";
import chalk from "chalk";

export function logServerInfo(port: number) {
  const url = `http://localhost:${port}`;
  console.log("\n");

  if (env.PROJECT_NAME) {
    console.log(
      chalk.hex("#ffd700")("📄 Project Name  :  "),
      chalk.hex("#00ffd5ff")(env.PROJECT_NAME)
    );
  }

  console.log(
    chalk.hex("#ffd700")("💻 Server URL    :  "),
    chalk.hex("#00ffd5ff")(url)
  );

  console.log(
    chalk.hex("#ffd700")("🚀 Server Status :  "),
    chalk.hex("#00ff7f")("ONLINE")
  );

  console.log(
    chalk.hex("#ffd700")("🌐 Environment   :  "),
    chalk.hex("#5a1effff")(env.NODE_ENV.toUpperCase())
  );

  console.log(
    chalk.hex("#ffd700")("📝 Super Admin   :  "),
    chalk.hex("#ff69b4")("Seeding started...")
  );

  console.log("\n");
}

// Get current timestamp in HH:MM:SS
export const getTimeStamp = (): string => {
  const now = new Date();
  return now.toTimeString().split(" ")[0];
};

// Fixed width for labels
const LABEL_WIDTH = 12;

// Centralized logger
type LoggerOptions = {
  type?: string; // custom label like "Data", "Body", etc.
};

export const logger = {
  success: (message: string, options?: LoggerOptions) => {
    const time = chalk.hex("#8D929C")(getTimeStamp());
    const label = options?.type || "SUCCESS"; // use type if provided
    const spaceToAdd = LABEL_WIDTH - label.length;
    // console.log({ spaceToAdd });

    console.log(
      chalk.gray("[") +
        chalk.hex("#8D929C").bold(label) +
        chalk.gray("]") +
        " ".repeat(2) +
        time +
        " ".repeat(spaceToAdd) +
        chalk.green(message)
    );
  },

  error: (message: string, options?: LoggerOptions) => {
    const time = chalk.hex("#8D929C")(getTimeStamp());
    const label = options?.type || "ERROR";
    const spaceToAdd = LABEL_WIDTH - label.length;

    console.log(
      chalk.gray("[") +
        chalk.hex("#E05561").bold(label) +
        chalk.gray("]") +
        " ".repeat(2) +
        time +
        " ".repeat(spaceToAdd) +
        chalk.red(message)
    );
  },

  warning: (message: string, options?: LoggerOptions) => {
    const time = chalk.hex("#8D929C")(getTimeStamp());
    const label = options?.type || "WARNING";
    const spaceToAdd = LABEL_WIDTH - label.length;

    console.log(
      chalk.gray("[") +
        chalk.hex("#a86d35ff")(label) +
        chalk.gray("]") +
        " ".repeat(2) +
        time +
        " ".repeat(spaceToAdd) +
        chalk.yellow(message)
    );
  },

  info: (message: string | object, options?: LoggerOptions) => {
    const time = chalk.hex("#8D929C")(getTimeStamp());
    const label = options?.type || "INFO";
    const spaceToAdd = LABEL_WIDTH - label.length;

    console.log(
      chalk.gray("[") +
        chalk.hex("#3bb1c0ff").bold(label) +
        chalk.gray("]") +
        " ".repeat(2) +
        time +
        " ".repeat(spaceToAdd) +
        chalk.cyan(message) +
        "\n"
    );
  },
};
