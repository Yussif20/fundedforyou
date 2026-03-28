import httpStatus from "@/constants";
import { prisma } from "@/db";
import { NewsletterEmail } from "@/emails/NewsletterEmail";
import { env } from "@/env";
import AppError from "@/helpers/errors/AppError";
import QueryBuilder from "@/helpers/prisma/query-builder";
import { QueryT } from "@/types/index.types";
import { reactComponentToHtml } from "@/utils/reactComponentToHtml";

const getAllSubscribers = async (query: QueryT) => {
  const subscriberQuery = new QueryBuilder(prisma.newsLetter, query);

  const { data, meta } = await subscriberQuery
    .search(["email"])
    .sort()
    .customFields({
      id: true,
      email: true,
      createdAt: true,
    })
    .paginate()
    .execute();

  return { subscribers: data, meta };
};

const subscribeToNewsLetter = async (email: string) => {
  let subscription = await prisma.newsLetter.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  if (!subscription) {
    subscription = await prisma.newsLetter.create({
      data: {
        email,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  }

  return {
    message: "Subscription successful.",
    subscription,
  };
};

const unSubscribeFromNewsLetter = async (email: string) => {
  const existingSubscription = await prisma.newsLetter.findUnique({
    where: { email },
  });

  if (existingSubscription) {
    await prisma.newsLetter.delete({
      where: { email },
    });
  }

  return { message: "Un Subscription successful." };
};

const deleteSubscriber = async (id: string) => {
  const subscriber = await prisma.newsLetter.findUnique({ where: { id } });

  if (!subscriber) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscriber not found");
  }

  await prisma.newsLetter.delete({ where: { id } });

  return { message: "Subscriber removed successfully" };
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const sendBulkEmail = async (subject: string, body: string) => {
  const subscribers = await prisma.newsLetter.findMany({
    select: { email: true },
  });

  if (subscribers.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No subscribers found");
  }

  // Render template once — only the unsubscribe URL differs per subscriber
  // but we need per-subscriber URLs, so we render per subscriber below

  // Reuse a single SMTP transporter for all emails (Gmail throttles new connections)
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: env.MAIL_SECURE,
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  });

  let sent = 0;
  let failed = 0;

  // Send one at a time with a 1-second delay to stay within Gmail rate limits
  for (const subscriber of subscribers) {
    try {
      const unsubscribeUrl = `${env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
      const html = await reactComponentToHtml(NewsletterEmail, {
        subject,
        body,
        unsubscribeUrl,
      });

      await transporter.sendMail({
        from: env.MAIL_USER,
        to: subscriber.email,
        subject,
        html,
      });

      sent++;
    } catch (error) {
      console.error(
        `[Newsletter] Failed to send to ${subscriber.email}:`,
        error
      );
      failed++;
    }

    // 1-second delay between emails to avoid Gmail rate limiting
    if (sent + failed < subscribers.length) {
      await delay(1000);
    }
  }

  transporter.close();

  return { sent, failed, total: subscribers.length };
};

export const NewsLetterService = {
  getAllSubscribers,
  subscribeToNewsLetter,
  unSubscribeFromNewsLetter,
  deleteSubscriber,
  sendBulkEmail,
};
