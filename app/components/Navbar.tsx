export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-slate-950">
      <h1 className="text-3xl font-bold text-blue-500">
        Ticatility
      </h1>

      <div className="hidden md:flex gap-8 text-white">
        <a href="#" className="hover:text-blue-400">
          Concerts
        </a>

        <a href="#" className="hover:text-blue-400">
          Sports
        </a>

        <a href="#" className="hover:text-blue-400">
          Theatre
        </a>

        <a href="#" className="hover:text-blue-400">
          Contact
        </a>
      </div>

      <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold">
        Buy Tickets
      </button>
    </nav>
  );
}