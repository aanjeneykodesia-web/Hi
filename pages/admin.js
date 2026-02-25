export default function Admin() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="p-6 shadow rounded-xl">Approve Users</div>
        <div className="p-6 shadow rounded-xl">Manage Shipments</div>
        <div className="p-6 shadow rounded-xl">Revenue Dashboard</div>
        <div className="p-6 shadow rounded-xl">Disputes</div>
      </div>
    </div>
  )
}
