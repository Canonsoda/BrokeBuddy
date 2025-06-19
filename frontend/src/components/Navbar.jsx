import { Link } from 'react-router-dom';
export const Navbar = () => {
    return(
    <nav className="flex justify-between items-center px-6 md:px-12 py-4 border-b border-[#6b5448]">
        <Link to="/" className="text-black hover:text-[#6b5448] transition">
        <h1 className="text-4xl font-bold">BrokeBuddy</h1>
        </Link>
        <div className="space-x-4">
          <Link to="/login">
            <button className="bg-[#6b5448] text-white rounded-full px-5 py-2 hover:bg-[#4d3e36] transition">
              LOGIN
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-[#6b5448] text-white rounded-full px-5 py-2 hover:bg-[#4d3e36] transition">
              SIGNUP
            </button>
          </Link>
        </div>
      </nav>
    );
}