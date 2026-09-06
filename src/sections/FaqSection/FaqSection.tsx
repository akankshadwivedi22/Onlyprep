import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

// ==================================================
// FAQ DATA
// ==================================================

const faqs = [
  {
    question: "What is OnlyPrep?",
    answer:
      "OnlyPrep gives you focused interview-prep material without making you dig through endless courses, YouTube videos, and huge PDFs.",
  },
  {
    question: "Who are these study kits for?",
    answer:
      "They're made for developers preparing for software engineering interviews — whether you're starting out or brushing up before an interview.",
  },
  {
    question: "How is the material created?",
    answer:
      "Our material is curated and validated through conversations with 100+ software developers working at leading companies, so we focus on what actually matters.",
  },
  {
    question: "Do I need an account to buy a kit?",
    answer:
      "No. You can purchase a kit without creating an account. Your study material will be delivered to the email address you provide after payment.",
  },
  {
    question: "Is there a subscription?",
    answer:
      "Nope. Pay once and get lifetime access. No recurring charges.",
  },
  {
    question: "Why are the kits so affordable?",
    answer:
      "We believe good interview preparation shouldn't cost hundreds or thousands. As software developers ourselves, we know how hard and stressful it can be to land a software job these days 😮‍💨. That's why we built OnlyPrep — focused, practical preparation at prices that don't make the process harder. Our kits start at just ₹29.",
  },
  {
    question: "How will I receive my kit?",
    answer:
      "After a successful payment, we'll send the study material or access link to the email address you provide during checkout.",
  },
  {
    question: "Can I request a topic?",
    answer:
      "Absolutely! If you can't find the topic you're looking for, use our Request a Topic section and tell us what you'd like to see. We promise to consider every request and add the topics our community needs most. 💜",
  },
  {
    question: "What if I can't afford a kit?",
    answer:
      "Tell us. We genuinely want interview preparation to be accessible. If there's something you need but can't afford, reach out to us.",
  },
  {
    question: "Can I get a refund?",
    answer:
    "Since our kits are digital products, all purchases are non-refundable. We’ve intentionally kept our pricing very affordable — less than the cost of your daily coffee ☕ . So, you can access focused interview preparation at a minimal cost. If you face any issues with your purchase or need any assistance, please reach out to us, and we’ll be happy to help.",
  },];

// ==================================================
// FAQ COMPONENT
// ==================================================

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // ==================================================
  // TOGGLE FAQ
  // ==================================================

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) =>
      current === index ? null : index
    );
  };

  return (
    <section
      id="faq"
      className="
        relative
        overflow-hidden
        bg-[#FFFCFA]
        px-5
        py-24
        sm:py-28
      "
    >
      {/* ==================================================
          BACKGROUND GLOW — LEFT
      ================================================== */}

      <motion.div
        animate={{
          opacity: [0.18, 0.3, 0.18],
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
          bg-[#DCCCFB]
          blur-3xl
        "
      />

      {/* ==================================================
          BACKGROUND GLOW — RIGHT
      ================================================== */}

      <motion.div
        animate={{
          opacity: [0.12, 0.25, 0.12],
          scale: [1, 1.08, 1],
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
          bottom-10
          h-80
          w-80
          rounded-full
          bg-[#F0D7E2]
          blur-3xl
        "
      />

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-3xl
        "
      >
        {/* ==================================================
            SECTION HEADER
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
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
          }}
          className="mx-auto max-w-2xl text-center"
        >
          {/* ==================================================
              BADGE
          ================================================== */}

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
              text-[15px]
              font-semibold
              text-[#625C67]
              shadow-sm
              backdrop-blur-sm
            "
          >
            <HelpCircle
              size={16}
              className="text-[#A887C5]"
            />

            <span className='text-base'>Got questions?</span>
          </div>

          {/* ==================================================
              HEADING
          ================================================== */}

          <h2
            className="
              font-['Plus_Jakarta_Sans']
              text-4xl
              font-extrabold
              leading-tight
              tracking-[-0.04em]
              text-[#29252D]
              sm:text-5xl
            "
          >
            Frequently asked
            <br />

            <span className="text-[#A887C5]">
              questions.
            </span>
          </h2>

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <p
            className="
              mt-5
              text-[18px]
              font-medium
              leading-8
              text-[#625C67]
              sm:text-[19px]
            "
          >
            Everything you need to know before you start.
          </p>
        </motion.div>

        {/* ==================================================
            FAQ LIST
        ================================================== */}

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.04,
                }}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#E8DDF0]
                  bg-white/80
                  shadow-sm
                  backdrop-blur-sm
                "
              >
                {/* ==================================================
                    QUESTION BUTTON
                ================================================== */}

                <button
                  onClick={() => toggleFAQ(index)}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-5
                    px-5
                    py-5
                    text-left
                    transition-colors
                    duration-200
                    hover:bg-[#FBF8FD]
                    sm:px-6
                  "
                  aria-expanded={isOpen}
                >
                  <span
                    className="
                      text-[17px]
                      font-semibold
                      leading-7
                      text-[#403A46]
                      sm:text-[18px]
                    "
                  >
                    {faq.question}
                  </span>

                  {/* ==================================================
                      CHEVRON
                  ================================================== */}

                  <motion.div
                    animate={{
                      rotate: isOpen ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F3EBFA]
                      text-[#A887C5]
                    "
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                {/* ==================================================
                    ANSWER
                ================================================== */}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.25,
                        ease: "easeInOut",
                      }}
                    >
                      <div
                        className="
                          border-t
                          border-[#F0EAF4]
                          px-5
                          pb-5
                          pt-4
                          sm:px-6
                        "
                      >
                        <p
                          className="
                            text-[16px]
                            font-medium
                            leading-7
                            text-[#625C67]
                            sm:text-[17px]
                          "
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ==================================================
            BOTTOM MESSAGE
        ================================================== */}

        <motion.p
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
            delay: 0.4,
          }}
          className="
            mt-10
            text-center
            text-[16px]
            font-medium
            leading-6
            text-[#8B848F]
          "
        >
          Still have a question?{" "}
          <span className="font-semibold text-[#A887C5]">
            Request a topic
          </span>{" "}
          and let us know. 💜
        </motion.p>
      </div>
    </section>
  );
};

export default FAQ;