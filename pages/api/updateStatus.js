import orders from "./orders";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { id, status } = req.body;

    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      return res.status(200).json({ message: "Updated" });
    }
  }

  res.status(400).json({ message: "Error" });
}
