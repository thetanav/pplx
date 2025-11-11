import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./lib/generated/prisma/client";
import {
  polar,
  checkout,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

const prisma = new PrismaClient();

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "727ebc00-165b-49f6-907b-febaabb6bc92",
              slug: "Simp-AI-Pro", // Custom slug for easy reference in Checkout URL, e.g. /checkout/Simp-AI-Pro
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
      ],
    }),
  ],
});
