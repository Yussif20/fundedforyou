import chalk from "chalk";
import "dotenv/config";
import { z } from "zod";
import { logger } from "./utils/logger";

// ---------------- ENV VALIDATION SCHEMA ----------------
const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PROJECT_NAME: z.string().min(1, "PROJECT_NAME is required"),

  PORT: z.coerce.number().positive().max(65536).default(3000),
  DATABASE_URL: z.string("DATABASE_URL is required"),

  SUPER_ADMIN_PASSWORD: z.string().min(6, "SUPER_ADMIN_PASSWORD is required"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),

  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("125d"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  MAIL_HOST: z.string().min(1, "MAIL_HOST is required"),
  MAIL_PORT: z.coerce.number().positive().max(65536),
  MAIL_USER: z.string().min(1, "MAIL_USER is required"),
  MAIL_PASS: z.string().min(1, "MAIL_PASS is required"),
  MAIL_SECURE: z
    .string()
    .optional()
    .transform((val) => val === "true"),

  BASE_URL_SERVER_DEV: z.url(),
  BASE_URL_CLIENT: z.url(),
  BASE_URL_SERVER: z.url(),

  DO_SPACE_ENDPOINT: z.string().min(1, "DO_SPACE_ENDPOINT is required"),
  DO_SPACE_ACCESS_KEY: z.string().min(1, "DO_SPACE_ACCESS_KEY is required"),
  DO_SPACE_SECRET_KEY: z.string().min(1, "DO_SPACE_SECRET_KEY is required"),
  DO_SPACE_BUCKET: z.string().min(1, "DO_SPACE_BUCKET is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  EMAIL_LOGO_URL: z.url().optional(),
});

// ---------------- TYPE FOR PARSED ENV ----------------
type EnvBase = z.infer<typeof EnvSchema>;

type EnvType = EnvBase & {
  FRONTEND_URL: string;
  SERVER_URL: string;
  // add more derived fields here if needed
};

// ---------------- PARSE AND DERIVE ----------------
let env: EnvType;

try {
  const parsedEnv = EnvSchema.parse(process.env);

  env = {
    ...parsedEnv,
    FRONTEND_URL: parsedEnv.BASE_URL_CLIENT,
    SERVER_URL:
      parsedEnv.NODE_ENV === "development"
        ? parsedEnv.BASE_URL_SERVER_DEV
        : parsedEnv.BASE_URL_SERVER,
  } as EnvType;
} catch (err) {
  if (err instanceof z.ZodError) {
    console.log(
      chalk.bgRedBright.white.bold("\n ❌ ") +
        chalk.bgRedBright.black.bold(" ENV VALIDATION FAILED ") +
        chalk.bgRedBright.yellow.bold(" ❌ \n")
    );

    logger.error("Env validation error");

    err.issues.forEach((e) => {
      console.log(
        chalk.yellow("• ") +
          chalk.cyanBright(e.path.join(".")) +
          chalk.redBright(` → ${e.message}`)
      );
    });

    console.log(
      chalk.magentaBright(
        "\nPlease fix your .env file before running the app.\n"
      )
    );
    process.exit(1);
  } else {
    throw err;
  }
}

// ---------------- EXPORT ----------------
export { env };
