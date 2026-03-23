import express, { Application, Router } from "express";
import { AnnouncementsRoutes } from "./app/announcements/announcements.route";
import { AuthRoutes } from "./app/auth/auth.route";
import { BrokerRoutes } from "./app/broker/broker.route";
import { ChallengeRoutes } from "./app/challenge/challenge.route";
import { ContactUsRoutes } from "./app/contact-us/contact-us.route";
import { FAQRoutes } from "./app/faq/faq.route";
import { FirmRoutes } from "./app/firm/firm.route";
import { NewsLetterRoutes } from "./app/news-letter/news-letter.route";
import { PaymentMethodRoutes } from "./app/payment-method/payment-method.route";
import { PlatformRoutes } from "./app/platform/platform.route";
import { SpreadRoutes } from "./app/spread/spread.route";
import { UsersRoutes } from "./app/users/users.route";
import { OfferRoutes } from "./app/offer/offer.route";
import { BestSellerRoutes } from "./app/best-seller/best-seller.route";
import { NewsRoutes } from "./app/news/news.route";

const router: Router = express.Router();

const moduleRoutes: ModuleRoute[] = [
  {
    path: "/auth",
    route: AuthRoutes,
  },

  {
    path: "/brokers",
    route: BrokerRoutes,
  },

  {
    path: "/platforms",
    route: PlatformRoutes,
  },

  {
    path: "/payment-methods",
    route: PaymentMethodRoutes,
  },

  {
    path: "/contact-us",
    route: ContactUsRoutes,
  },

  {
    path: "/faqs",
    route: FAQRoutes,
  },

  {
    path: "/news-letter",
    route: NewsLetterRoutes,
  },

  {
    path: "/users",
    route: UsersRoutes,
  },

  {
    path: "/firms",
    route: FirmRoutes,
  },
  {
    path: "/spreads",
    route: SpreadRoutes,
  },
  {
    path: "/challenges",
    route: ChallengeRoutes,
  },
  {
    path: "/announcements",
    route: AnnouncementsRoutes,
  },
  {
    path: "/offers",
    route: OfferRoutes,
  },
  {
    path: "/best-sellers",
    route: BestSellerRoutes,
  },
  {
    path: "/news",
    route: NewsRoutes,
  },
];

// Register all module routes
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

// Corrected type
type ModuleRoute = {
  path: string;
  route: Router | Application; // Router or Application is fine
};
