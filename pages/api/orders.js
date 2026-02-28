let orders = [];

export default function handler(req, res) {
  // CREATE ORDER
  if (req.method === "POST") {
    const newOrder = {
      id: Date.now(),
      ...req.body,
      status: "Pending",
      assignedTo: null,
      currentLat: null,
      currentLng: null
    };

    orders.push(newOrder);
    return res.status(200).json(newOrder);
  }

  // GET ALL ORDERS
  if (req.method === "GET") {
    return res.status(200).json(orders);
  }

  // UPDATE ORDER
  if (req.method === "PUT") {
    const { id, status, transporter, currentLat, currentLng } = req.body;

    orders = orders.map(order =>
      order.id === id
        ? {
            ...order,
            status: status || order.status,
            assignedTo: transporter || order.assignedTo,
            currentLat: currentLat ?? order.currentLat,
            currentLng: currentLng ?? order.currentLng
          }
        : order
    );

    return res.status(200).json({ message: "Updated" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
