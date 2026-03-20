import crypto from "crypto";

export default function handler(req, res) {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
}
