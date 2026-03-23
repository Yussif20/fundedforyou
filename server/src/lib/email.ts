import { env } from "@/env";
import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  body: { html: string; subject: string }
) => {
  console.log(`[Email] Attempting to send email to: ${to}, subject: "${body.subject}"`);
  console.log(`[Email] SMTP config: host=${env.MAIL_HOST}, port=${env.MAIL_PORT}, secure=${env.MAIL_SECURE}, user=${env.MAIL_USER}`);
  try {
    const transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: env.MAIL_SECURE,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: env.MAIL_USER,
      to,
      subject: body.subject,
      text: "",
      html: body.html,
    });
    console.log(`[Email] Sent successfully to ${to}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[Email] Failed to send email to ${to}:`, error);
    throw error;
  }
};
