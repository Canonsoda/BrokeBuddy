import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';
import Footer from '../components/Footer';
import { Navbar } from '../components/Navbar';

const features = [
  {
    title: "Lend or Borrow",
    desc: "Create loans with clear rules.",
    icon: "💸",
  },
  {
    title: "Track Repayments",
    desc: "Never miss a deadline.",
    icon: "⏰",
  },
  {
    title: "Loan Summary",
    desc: "View filtered, useful data.",
    icon: "📊",
  },
  {
    title: "Secure Auth",
    desc: "Google OAuth & JWT secured.",
    icon: "🔐",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, type: "spring", stiffness: 60 },
  }),
};

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf6] text-black">
      <Navbar />

      <motion.section
        className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-12 py-8 md:py-10 flex-1 w-full max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
      >
        {/* Hero Left Text */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
          className="w-full md:w-2/5 space-y-6 text-center md:text-left mb-8 md:mb-0"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">BrokeBuddy</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 min-h-[2.5rem] sm:min-h-[3rem]">
            <Typewriter
              words={[
                'Track and remind friends to repay 💸',
                'Filter loans with one click 📊',
                'Set clear deadlines and rules 🕒',
                'Smarter lending made simple 🔐',
              ]}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={1500}
            />
          </p>
          <Link to="/signup">
            <button className="bg-[#6b5448] text-white px-5 py-3 sm:px-6 rounded-full hover:bg-[#4d3e36] transition w-full sm:w-auto">
              Get Started
            </button>
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 md:mt-0 w-full md:w-3/5">
          {features.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="p-5 sm:p-6 border rounded-2xl shadow-md hover:shadow-xl transition bg-white cursor-pointer flex flex-col items-center text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl sm:text-4xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-lg sm:text-xl mb-1">{item.title}</h3>
              <p className="text-sm sm:text-base text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default LandingPage;
