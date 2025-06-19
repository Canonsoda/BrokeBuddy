import { Link } from 'react-router-dom';
export const Navbar = () => {
    return (
      <nav className="flex flex-col md:flex-row justify-between items-center px-4 md:px-12 py-4 border-b border-[#6b5448] gap-4 md:gap-0">
      <Link to="/" className="text-black hover:text-[#6b5448] transition">
        <h1 className="text-3xl md:text-4xl font-bold">BrokeBuddy</h1>
      </Link>
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
        <Link to="/login" className="w-full md:w-auto">
        <button className="w-full md:w-auto bg-[#6b5448] text-white rounded-full px-5 py-2 hover:bg-[#4d3e36] transition">
          LOGIN
        </button>
        </Link>
        <Link to="/signup" className="w-full md:w-auto">
        <button className="w-full md:w-auto bg-[#6b5448] text-white rounded-full px-5 py-2 hover:bg-[#4d3e36] transition">
          SIGNUP
        </button>
        </Link>
      </div>
      </nav>
    );
}