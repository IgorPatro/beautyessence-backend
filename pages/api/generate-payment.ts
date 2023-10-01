import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY as string, {
  apiVersion: "2023-08-16",
});

interface VARIANTS_PRICES {
  [key: number]: string;
}

const VARIANTS_PRICES: VARIANTS_PRICES = {
  100: "price_1NvkX0ISNkMO2d65avhfo0dn",
  200: "price_1NvkX0ISNkMO2d65avhfo0dn",
  300: "price_1NvkX0ISNkMO2d65avhfo0dn",
  400: "price_1NvkX0ISNkMO2d65avhfo0dn",
  500: "price_1NvkX0ISNkMO2d65avhfo0dn",
};

interface PaymentRequestBody {
  variant: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const data = req.body as PaymentRequestBody;

  if (!data) {
    return res
      .status(400)
      .json({ error: "Data is required in the request body." });
  }

  const variantPrice = VARIANTS_PRICES[data.variant];

  if (!variantPrice) {
    return res.status(400).json({ error: "Invalid variant." });
  }

  const payment = await stripe.paymentLinks.create({
    currency: "pln",
    line_items: [{ price: variantPrice, quantity: 1 }],
    after_completion: {
      type: "redirect",
      redirect: {
        url: "https://beauty-essence.pl/",
      },
    },
    custom_fields: [
      {
        key: "voucherName",
        label: {
          custom: "Kto otrzyma voucher?",
          type: "custom",
        },
        type: "text",
      },
      {
        key: "voucherEmail",
        label: {
          custom: "Na jaki adres email wysłać voucher?",
          type: "custom",
        },
        type: "text",
      },
    ],
  });

  return res.status(200).json(payment);
}
