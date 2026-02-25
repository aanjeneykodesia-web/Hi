export default function Manufacturer() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Manufacturer Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 shadow rounded-xl">Post New Load</div>
        <div className="p-6 shadow rounded-xl">Track Shipments</div>
        <div className="p-6 shadow rounded-xl">Payments & Reports</div>
      </div>
    </div>
  )
}
