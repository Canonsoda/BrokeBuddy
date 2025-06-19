import Footer from "./Footer";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { Navbar } from "./Navbar";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfaf6] text-black">
      <Navbar />
      <div className="flex flex-1 flex-col md:flex-row items-center justify-between px-4 md:px-12 py-8 md:py-12 gap-8 md:gap-0">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
          className="w-full md:w-1/2 space-y-4 md:space-y-6 mb-8 md:mb-0 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-bold">BrokeBuddy</h1>
          <p className="text-lg md:text-xl text-gray-600 min-h-[40px] md:min-h-[48px]">
            <Typewriter
              words={[
                "Track and remind friends to repay 💸",
                "Filter loans with one click 📊",
                "Set clear deadlines and rules 🕒",
                "Smarter lending made simple 🔐",
              ]}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={1500}
            />
          </p>
        </motion.div>

        {/* Right Section (Form goes here) */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AuthLayout;
