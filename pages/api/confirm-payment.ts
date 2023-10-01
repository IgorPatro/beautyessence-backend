import type { NextApiRequest, NextApiResponse } from "next";
import { SMTPClient } from "emailjs";

const client = new SMTPClient({
  user: "vouchery@beauty-essence.pl",
  password: process.env.EMAIL_PASSWORD,
  host: "h27.seohost.pl",
  ssl: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body;

  const variant = data?.data?.object?.amount_total / 100 || 100;
  const voucherName =
    data?.data?.object?.custom_fields?.find(
      (field: any) => field.key === "voucherName"
    ).text.value ?? "";
  const voucherEmail =
    data?.data?.object?.custom_fields?.find(
      (field: any) => field.key === "voucherEmail"
    ).text.value ?? "";
  const customerEmail = data?.data?.object?.customer_details?.email ?? "";

  try {
    const message = await client.sendAsync({
      text: `Cześć, ${voucherName}!

Właśnie otrzymałeś voucher o wartości ${variant}PLN do Beauty Essence!

Podziękuj ${customerEmail} za ten wspaniały prezent!

Wystarczy, że podasz swoje imię i nazwisko przy najbliższej wizycie, aby wykorzystać zakupiony voucher.`,
      from: "vouchery@beauty-essence.pl",
      to: voucherEmail,
      cc: customerEmail,
      subject: `Twój nowy voucher Beauty Essence`,
    });
    console.log(message);
  } catch (err) {
    console.error(err);
  }

  return res.status(200).json({ tak: "xd" });
}
