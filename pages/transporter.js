export default function Transporter() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Transporter Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 shadow rounded-xl">Available Loads</div>
        <div className="p-6 shadow rounded-xl">My Drivers</div>
        <div className="p-6 shadow rounded-xl">Earnings</div>
      </div>
    </div>
  )
}
