import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Pick your kit",
    description:
      "Choose the interview prep kit for the role or technology you're preparing for.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Study what matters",
    description: (
      <>
        Study material validated through conversations with{" "}
        <span className="font-bold text-[#A887C5]">
          100+ software developers
        </span>{" "}
        working at leading companies — so you focus on what actually matters.
      </>
    ),
        icon: Sparkles,
  },
  {
    number: "03",
    title: "Get interview-ready",
    description:
      "Revise what actually matters, practice confidently and walk into your interview prepared.",
    icon: CheckCircle2,
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#FFFCFA] px-5 py-24 sm:py-28"
    >
      {/* =========================================
          BACKGROUND GLOW
      ========================================== */}

      <motion.div
        animate={{
          opacity: [0.25, 0.4, 0.25],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -left-40
          top-20
          h-80
          w-80
          rounded-full
          bg-[#E6D8FA]
          blur-3xl
        "
      />

      <motion.div
        animate={{
          opacity: [0.2, 0.35, 0.2],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="
          absolute
          -right-40
          bottom-0
          h-96
          w-96
          rounded-full
          bg-[#F8DDE8]
          blur-3xl
        "
      />

      {/* =========================================
          SECTION CONTENT
      ========================================== */}

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* =========================================
            SECTION HEADER
        ========================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          {/* Small badge */}

          <div
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#E8DDF0]
              bg-white/80
              px-4
              py-2
              text-xs
              font-medium
              text-[#716B75]
              shadow-sm
              backdrop-blur-sm
            "
          >
            <Sparkles
              size={14}
              className="text-[#A887C5]"
            />

            <span className="text-base">Simple by design.</span>
          </div>

          {/* Heading */}

          <h2
            className="
              font-['Plus_Jakarta_Sans']
              text-4xl
              font-extrabold
              leading-tight
              tracking-[-0.04em]
              text-[#29252D]
              sm:text-5xl
              md:text-6xl
            "
          >
            How it{" "}
            <span className="text-[#A887C5]">
              works.
            </span>
          </h2>

          {/* Subtitle */}

          <p
            className="
              mt-5
              text-base
              leading-7
              text-[#716B75]
              sm:text-lg
              sm:leading-8
            "
          >
            No complicated learning paths.
            <br className="hidden sm:block" />
            Just three simple steps to get interview-ready.
          </p>
        </motion.div>

        {/* =========================================
            STEPS
        ========================================== */}

        <div className="relative mt-16">

          {/* =========================================
              CONNECTING LINE
          ========================================== */}

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: "easeOut",
            }}
            className="
              absolute
              left-[16%]
              right-[16%]
              top-1/2
              hidden
              h-px
              origin-left
              bg-gradient-to-r
              from-[#DCCCFB]
              via-[#B89AD9]
              to-[#DCCCFB]
              lg:block
            "
          />

          {/* =========================================
              STEP CARDS
          ========================================== */}

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.15,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  className="
                    group
                    relative
                    rounded-[28px]
                    border
                    border-[#EEE8F2]
                    bg-white/85
                    p-7
                    shadow-[0_12px_40px_rgba(60,40,80,0.06)]
                    backdrop-blur-sm
                    transition-shadow
                    duration-300
                    hover:shadow-[0_20px_50px_rgba(60,40,80,0.10)]
                    sm:p-8
                  "
                >

                  {/* =================================
                      NUMBER
                  ================================== */}

                  <div className="flex items-start justify-between">

                    <span
                      className="
                        font-['Plus_Jakarta_Sans']
                        text-sm
                        font-bold
                        tracking-wider
                        text-[#A887C5]
                      "
                    >
                      {step.number}
                    </span>

                    {/* =================================
                        ICON
                    ================================== */}

                    <motion.div
                      whileHover={{
                        rotate: 6,
                        scale: 1.08,
                      }}
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[#F4EDFA]
                        text-[#A887C5]
                        transition-colors
                        duration-300
                        group-hover:bg-[#EBDDFA]
                      "
                    >
                      <Icon size={22} strokeWidth={1.8} />
                    </motion.div>
                  </div>

                  {/* =================================
                      CARD CONTENT
                  ================================== */}

<div className="mt-9">
  <h3
    className="
      font-['Plus_Jakarta_Sans']
      text-xl
      font-bold
      tracking-[-0.02em]
      text-[#29252D]
    "
  >
    {step.title}
  </h3>

  <p
    className="
      mt-3
      text-base
      leading-7
      text-[#716B75]
    "
  >
    {step.description}
  </p>
</div>

                  {/* =================================
                      BOTTOM ARROW
                  ================================== */}

                  {index < steps.length - 1 && (
                    <div
                      className="
                        mt-7
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-medium
                        text-[#B89AD9]
                      "
                    >
                    
                    </div>
                  )}

                  {index === steps.length - 1 && (
                    <div
                      className="
                        mt-7
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-medium
                        text-[#A887C5]
                      "
                    >
                      <CheckCircle2 size={15} />

                      <span>
                        You're ready.
                      </span>
                    </div>
                  )}

                </motion.div>
              );
            })}

          </div>
        </div>

        {/* =========================================
            BOTTOM MESSAGE
        ========================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.7,
            delay: 0.3,
          }}
          className="
            mx-auto
            mt-14
            max-w-2xl
            text-center
          "
        >
         <p
          className="
            text-[17px]
            leading-7
            text-[#8B848F]
          "
        >
            You don't need another course.
            <span className="font-semibold text-[#A887C5]">
              {" "}You need the right material.
            </span>
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;