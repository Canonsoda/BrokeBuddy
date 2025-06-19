import { FaLinkedin, FaInstagram, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="flex flex-wrap justify-center gap-6 sm:gap-8 py-4 sm:py-6 text-lg sm:text-xl text-[#6b5448] bg-white/30 backdrop-blur-md border-t border-[#e4dbd4] shadow-inner">
      <a
        href="https://www.linkedin.com/in/aryan-kumar-dwivedi-202329284/"
        target="_blank"
        rel="noopener noreferrer"
        title="LinkedIn"
        className="hover:text-[#0072b1] transition"
      >
        <FaLinkedin />
      </a>
      <a
        href="https://www.instagram.com/aryankd_11/"
        target="_blank"
        rel="noopener noreferrer"
        title="Instagram"
        className="hover:text-pink-500 transition"
      >
        <FaInstagram />
      </a>
      <a
        href="https://github.com/Canonsoda"
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
        className="hover:text-gray-800 transition"
      >
        <FaGithub />
      </a>
      <a
        href="mailto:support@brokebuddy.com"
        title="Email Us"
        className="hover:text-red-500 transition"
      >
        <FaEnvelope />
      </a>
    </footer>
  );
};

export default Footer;
