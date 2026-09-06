import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";


const Hero = () => {
  // =========================
  // SCROLL TO STUDY KITS
  // =========================
  const scrollToKits = () => {
    document.getElementById("kits")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative min-h-[calc(100vh-0px)] overflow-hidden">

      {/* ==================================================
          BACKGROUND BLOBS
      ================================================== */}

      {/* =========================
          TOP-LEFT LILAC GLOW
      ========================== */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 0.7,
          scale: 1,
          x: [0, 25, 0],
          y: [0, -20, 0],
        }}
        transition={{
          opacity: {
            duration: 1,
          },
          scale: {
            duration: 1,
          },
          x: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="
          absolute
          -left-32
          top-20
          h-72
          w-72
          rounded-full
          bg-[#C8A8EF]
          blur-3xl
        "
      />

      {/* =========================
          BOTTOM-RIGHT MINT GLOW
      ========================== */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 0.65,
          scale: 1,
          x: [0, -20, 0],
          y: [0, 25, 0],
        }}
        transition={{
          opacity: {
            duration: 1,
            delay: 0.2,
          },
          scale: {
            duration: 1,
            delay: 0.2,
          },
          x: {
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="
          absolute
          -right-32
          bottom-16
          h-80
          w-80
          rounded-full
          bg-[#E6A0B8]
          blur-3xl
        "
      />

      {/* =========================
          CENTER SOFT GLOW
      ========================== */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-40
          w-40
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#F2EAF8]
          blur-3xl
        "
      />

      {/* ==================================================
          HERO CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-5xl
          flex-col
          items-center
          justify-center
          px-5
          text-center
        "
        style={{
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >

        {/* ==================================================
            BADGE
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          className="
            mb-7
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-[#E8DDF0]
            bg-white/70
            px-4
            py-2
            text-sm
            font-medium
            text-[#716B75]
            shadow-sm
            backdrop-blur-sm
          "
        >
          <Sparkles
            size={15}
            className="text-[#B89AD9]"
          />

          <span className="text-base">
            The only prep you need.
          </span>
        </motion.div>

        {/* ==================================================
            MAIN HEADING
        ================================================== */}

        <motion.h1
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.25,
          }}
          className="
            w-full
            max-w-4xl
            text-center
            font-['Plus_Jakarta_Sans']
            text-5xl
            font-extrabold
            leading-[1.08]
            tracking-[-0.04em]
            text-[#29252D]
            sm:text-6xl
            md:text-7xl
            lg:text-8xl
          "
        >
          Less searching.
          <br />

          <span className="text-[#A887C5]">
            More preparing.
          </span>
        </motion.h1>

        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.45,
          }}
          className="
            mt-10
            w-full
            max-w-2xl
            text-center
            text-base
            leading-7
            text-[#716B75]
            sm:text-lg
            sm:leading-8
          "
        >
          {/* First line */}
          <span className="block">
            No endless courses. No 20 YouTube tabs. No 500-page PDFs.
          </span>

          {/* Second line with extra spacing */}
          <span className="mt-[10px] block">
            Just the{" "}
            <span className="font-semibold text-[#A887C5]">
              material you need.
            </span>
          </span>
        </motion.p>

        {/* ==================================================
            BENEFITS
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.6,
          }}
          className="
            mt-7
            flex
            flex-wrap
            items-center
            justify-center
            gap-3
          "
        >

          {/* Interview focused */}
          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-white/70
              px-4
              py-2
              text-base
              text-[#5F5963]
              shadow-sm
            "
          >
            <BookOpen
              size={15}
              className="text-[#A887C5]"
            />

            <span>
              Interview focused
            </span>
          </div>

          {/* Lifetime access */}
          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-white/70
              px-4
              py-2
              text-base
              text-[#5F5963]
              shadow-sm
            "
          >
            <span className="text-base">
              ∞
            </span>

            <span>
              Lifetime access
            </span>
          </div>

          {/* Starting price */}
          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-white/70
              px-4
              py-2
              text-base
              text-[#5F5963]
              shadow-sm
            "
          >
            <span className="text-base">
              ₹
            </span>

            <span>
              Starting at ₹29
            </span>
          </div>
        </motion.div>

        {/* ==================================================
            CTA
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.75,
          }}
          className="
            mt-9
            flex
            flex-col
            items-center
            justify-center
            gap-3
            sm:flex-row
          "
        >

          {/* Main CTA button */}
          <button
            onClick={scrollToKits}
            className="
              group
              flex
              items-center
              gap-2
              rounded-full
              bg-[#B89AD9]
              px-7
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-[0_8px_25px_rgba(184,154,217,0.25)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#9F7FC3]
              hover:shadow-[0_12px_30px_rgba(184,154,217,0.3)]
            "
          >
            <span>
              Explore study kits
            </span>

            <ArrowRight
              size={17}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </button>

          {/* CTA supporting text */}
          <span className="text-sm text-[#8B848F]">
            Instant access · No subscription
          </span>
        </motion.div>

        {/* ==================================================
            CREDIBILITY / SOCIAL PROOF
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            delay: 0.95,
            ease: "easeOut",
          }}
          className="
            relative
            mt-8
            flex
            items-center
            justify-center
          "
        >

          {/* =========================
              ANIMATED SOFT GLOW
          ========================== */}

          <motion.div
            animate={{
              opacity: [0.25, 0.5, 0.25],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              h-10
              w-64
              rounded-full
              bg-[#DCCCFB]
              blur-2xl
            "
          />

          {/* =========================
              TRUST BADGE
          ========================== */}

          <div
            className="
              relative
              flex
              items-center
              gap-2
              rounded-full
              border
              border-[#E8DDF0]
              bg-white/70
              px-5
              py-2.5
              text-xs
              text-[#716B75]
              shadow-sm
              backdrop-blur-sm
              sm:text-sm
            "
          >
            <Sparkles
              size={14}
              className="shrink-0 text-[#A887C5]"
            />

            <span className="text-base">
              Built after speaking with{" "}
              <span className="font-bold text-[#A887C5]">
                100+ software developers
              </span>{" "}
              working at leading companies.
            </span>
          </div>
        </motion.div>
      </div>


    </section>
  );
};

export default Hero;