import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Kits", id: "kits" },
  { label: "How it works", id: "how-it-works" },
  { label: "Request a topic", id: "request" },
  { label: "FAQ", id: "faq" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setIsMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-5 py-3 shadow-[0_8px_30px_rgba(80,60,100,0.06)] backdrop-blur-xl">

        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group cursor-pointer text-left"
          aria-label="Go to homepage"
        >
          <span className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold tracking-tight text-[#29252D]">
            onlyprep
            <span className="text-[#B89AD9] transition-colors duration-300 group-hover:text-[#9F7FC3]">
              .
            </span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScroll(item.id)}
              className="cursor-pointer text-base font-medium text-[#716B75] transition-colors duration-200 hover:text-[#29252D]"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <button
          onClick={() => handleScroll("kits")}
          className="hidden cursor-pointer rounded-full bg-[#B89AD9] px-5 py-2.5 text-base font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9F7FC3] hover:shadow-md md:block"
        >
          Explore kits
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="cursor-pointer rounded-xl p-2 text-[#29252D] transition-colors hover:bg-[#EEE5F7] md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-white/60 bg-white/90 p-3 shadow-[0_8px_30px_rgba(80,60,100,0.08)] backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className="cursor-pointer rounded-xl px-4 py-3 text-left text-base font-medium text-[#716B75] transition-colors hover:bg-[#EEE5F7] hover:text-[#29252D]"
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => handleScroll("kits")}
              className="mt-2 cursor-pointer rounded-xl bg-[#B89AD9] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#9F7FC3]"
            >
              Explore kits →
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;