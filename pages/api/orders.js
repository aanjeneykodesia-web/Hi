let orders = [];

export default function handler(req, res) {

  // ==============================
  // CREATE ORDER (Shopkeeper)
  // ==============================
  if (req.method === "POST") {

    const newOrder = {
      id: Date.now(),
      shopName: req.body.shopName,
      product: req.body.product,
      Mobno: req.body.Mobno,
      dropLat: req.body.dropLat,
      dropLng: req.body.dropLng,
      pickupLat: req.body.pickupLat || null,
      pickupLng: req.body.pickupLng || null,

      status: "Pending",
      adminApproved: false,
      assignedTo: null,
      transporterUsername: null,
      currentLat: null,
      currentLng: null
    };

    orders.push(newOrder);
    return res.status(200).json(newOrder);
  }

  // ==============================
  // GET ALL ORDERS
  // ==============================
  if (req.method === "GET") {
    return res.status(200).json(orders);
  }

  // ==============================
  // ADMIN APPROVAL ROUTE
  // ==============================
  if (req.method === "PATCH") {

    const { id } = req.body;

    orders = orders.map(order =>
      order.id === id
        ? { ...order, adminApproved: true }
        : order
    );

    return res.status(200).json({ message: "Admin Approved" });
  }

  // ==============================
  // UPDATE ORDER (Transporter)
  // ==============================
  if (req.method === "PUT") {

    const {
      id,
      status,
      transporter,
      transporterUsername,
      currentLat,
      currentLng,
      pickupLat,
      pickupLng
    } = req.body;

    orders = orders.map(order => {

      if (order.id === id) {

        // Block assignment if admin not approved
        if (transporter && !order.adminApproved) {
          return order;
        }

        return {
          ...order,
          status: status ?? order.status,
          assignedTo: transporter ?? order.assignedTo,
          transporterUsername: transporterUsername ?? order.transporterUsername,
          currentLat: currentLat ?? order.currentLat,
          currentLng: currentLng ?? order.currentLng,
          pickupLat: pickupLat ?? order.pickupLat,
          pickupLng: pickupLng ?? order.pickupLng
        };
      }

      return order;
    });

    return res.status(200).json({ message: "Updated Successfully" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
