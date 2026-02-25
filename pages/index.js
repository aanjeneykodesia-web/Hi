import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      <header className="bg-green-600 text-white p-5 flex justify-between">
        <h1 className="text-2xl font-bold">SwiftLogix</h1>
        <nav className="space-x-4">
          <Link href="/manufacturer" className="bg-white text-green-600 px-3 py-1 rounded">Manufacturer</Link>
          <Link href="/transporter" className="bg-white text-green-600 px-3 py-1 rounded">Transporter</Link>
          <Link href="/admin" className="bg-black px-3 py-1 rounded">Admin</Link>
        </nav>
      </header>

      <section className="p-20 text-center bg-gray-50">
        <h2 className="text-5xl font-bold mb-4">India's Smart Logistics Platform</h2>
        <p className="text-lg mb-6">Connect manufacturers with transporters instantly.</p>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg">Get Started</button>
      </section>

      <section className="p-10 grid md:grid-cols-3 gap-6">
        <div className="p-6 shadow rounded-xl">
          <h3 className="font-bold text-xl">For Manufacturers</h3>
          <p>Post loads, track shipments, manage payments.</p>
        </div>
        <div className="p-6 shadow rounded-xl">
          <h3 className="font-bold text-xl">For Transporters</h3>
          <p>Find loads, manage drivers, earn faster.</p>
        </div>
        <div className="p-6 shadow rounded-xl">
          <h3 className="font-bold text-xl">Admin Control</h3>
          <p>Approve users, manage revenue, analytics.</p>
        </div>
      </section>

      <footer className="bg-black text-white p-6 text-center">
        © 2026 SwiftLogix Logistics
      </footer>

    </div>
  )
    }
