import { motion } from "framer-motion";

// ==================================================
// FOOTER
// ==================================================

const Footer = () => {
  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-[#E8DDF0]
        bg-[#FBF8FD]
        px-5
        py-10
        sm:py-12
      "
    >
      {/* ==================================================
          SOFT BACKGROUND GLOW
      ================================================== */}

      <div
        className="
          absolute
          -bottom-24
          left-1/2
          h-48
          w-72
          -translate-x-1/2
          rounded-full
          bg-[#DCCCFB]/30
          blur-3xl
        "
      />

      {/* ==================================================
          FOOTER CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          max-w-6xl
          flex-col
          items-center
          justify-between
          gap-6
          text-center
          sm:flex-row
          sm:text-left
        "
      >
        {/* ==================================================
            BRAND
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          {/* Logo */}

          <div
            className="
              font-['Plus_Jakarta_Sans']
              text-xl
              font-extrabold
              tracking-tight
              text-[#29252D]
            "
          >
            onlyprep
            <span className="text-[#B89AD9]">.</span>
          </div>

          {/* Tagline */}

          <p
            className="
              mt-1.5
              text-[16px]
              font-medium
              leading-6
              text-[#625C67]
              sm:text-[17px]
            "
          >
            Study smarter. Crack interviews faster.
          </p>
        </motion.div>

        {/* ==================================================
            COPYRIGHT
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="
            text-[16px]
            font-medium
            leading-7
            text-[#625C67]
            sm:text-[17px]
          "
        >
          {/* Copyright */}

          <p>
            © 2026 OnlyPrep. All rights reserved.
          </p>

          {/* Made with love */}

          <p className="mt-1">
            Made with{" "}
            <span className="text-[#A887C5]">
              💜
            </span>{" "}
            for developers, by developers.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;