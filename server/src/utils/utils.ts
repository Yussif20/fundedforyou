import { prisma } from "@/db";
import crypto from "crypto";
import slugify from "slugify";

const removeStopWords = (text: string) => {
  const stopWords = ["the", "a", "an", "of", "for", "and", "to", "in"];
  return text
    .split(" ")
    .filter((word) => !stopWords.includes(word.toLowerCase()))
    .join(" ");
};

export const generatePropFirmSlug = async (title: string) => {
  // Remove stop-words for better SEO
  const cleanedTitle = removeStopWords(title);

  // Clean, SEO-friendly slug
  let baseSlug = slugify(cleanedTitle, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;

  // Check duplicate slugs
  const existing = await prisma.firm.findFirst({ where: { slug } });
  if (existing) {
    // Add short 6-char ID for uniqueness (better than timestamp)
    const uniqueId = crypto.randomBytes(3).toString("hex");
    slug = `${baseSlug}-${uniqueId}`;
  }

  return slug;
};
