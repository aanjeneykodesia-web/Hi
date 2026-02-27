let orders = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const newOrder = {
      id: Date.now(),
      shopName: req.body.shopName,
      pickup: req.body.pickup,
      drop: req.body.drop,
      product: req.body.product,
      weight: req.body.weight,
      price: req.body.price,
      status: "Pending",
      assignedTo: null
    };

    orders.push(newOrder);
    return res.status(200).json(newOrder);
  }

  if (req.method === "GET") {
    return res.status(200).json(orders);
  }

  if (req.method === "PUT") {
    const { id, status, transporter } = req.body;

    orders = orders.map(order =>
      order.id === id
        ? { ...order, status: status || order.status, assignedTo: transporter || order.assignedTo }
        : order
    );

    return res.status(200).json({ message: "Order updated" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
