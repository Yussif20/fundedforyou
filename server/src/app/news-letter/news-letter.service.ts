import { prisma } from "@/db";

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

export const NewsLetterService = {
  subscribeToNewsLetter,
  unSubscribeFromNewsLetter,
};
