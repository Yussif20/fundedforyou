import { NextFunction } from "express";
import i18next from "i18next";

const i18nextMiddleware = (req: any, _: any, next: NextFunction) => {
  const lng = req.headers["accept-language"]?.split(",")[0] || "en";

  req.t = (key: string, options?: Record<string, any>) => {
    return i18next.t(key, { lng, ...options });
  };

  next();
};

export default i18nextMiddleware;
