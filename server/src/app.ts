import {
  attachUser,
  errorMiddleware,
  i18nextMiddleware,
  notFoundMiddleware,
  rootMiddleware,
} from "@/middlewares";
import router from "@/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import path from "path";
import rateLimiterMiddleware from "./middlewares/rateLimiter";
const app: Application = express();
app.set("trust proxy", 1);

// Security middlewares
app.use(rateLimiterMiddleware);
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://31.220.111.98:3000",
      "http://31.220.111.98:3001",
      "https://31.220.111.98:3001",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://10.0.30.216:3000",
      "https://fundedforyou.com",
      "http://fundedforyou.com",
      "https://www.fundedforyou.com",
      "http://www.fundedforyou.com",
      "https://fundedforyou.netlify.app",
    ],
    credentials: true,
  }),
);

// Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Static folders
app.use("/public", express.static(path.join(process.cwd(), "public")));
app.use("/upload", express.static(path.join(process.cwd(), "upload")));

// API routes
app.use(attachUser);
app.use(i18nextMiddleware);
// app.use(requestLogger);

app.get("/", rootMiddleware);

app.use("/api/v1", router);

// 404 Middleware
app.use(notFoundMiddleware);

// Global Error Handler
app.use(errorMiddleware);

export default app;
