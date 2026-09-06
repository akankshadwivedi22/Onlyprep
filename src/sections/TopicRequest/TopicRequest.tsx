import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  MessageCircleHeart,
  Send,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { Toaster, toast } from "sonner";

const TopicRequest = () => {
  // ==================================================
  // FORM STATE
  // ==================================================

  const [topic, setTopic] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ==================================================
  // FORM SUBMIT
  // ==================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
  
    if (!topic.trim()) {
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8000/user-requests",
        {
          topic: topic.trim(),
          feedback: feedback.trim(),
        }
      );
  
      if (response.status >= 200 && response.status < 300) {
        toast.success(
          "Request submitted successfully! 💜"
        );
  
        setSubmitted(true);
        setTopic("");
        setFeedback("");
      } else {
        toast.error(
          "Something went wrong. Please try again later."
        );
      }
  
    } catch (error) {
      console.error(
        "Failed to submit request:",
        error
      );
  
      toast.error(
        "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <>
      {/* ==================================================
          SONNER TOASTER
      ================================================== */}

      <Toaster position="top-right" />

      <section
        id="request"
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
            BACKGROUND GLOWS
        ================================================== */}

        <motion.div
          animate={{
            opacity: [0.2, 0.35, 0.2],
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
            top-10
            h-72
            w-72
            rounded-full
            bg-[#DCCCFB]
            blur-3xl
          "
        />

        <motion.div
          animate={{
            opacity: [0.15, 0.3, 0.15],
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
            bottom-0
            h-80
            w-80
            rounded-full
            bg-[#E6A0B8]
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
            max-w-4xl
          "
        >
          {/* ==================================================
              HEADER
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
                text-sm
                font-medium
                text-[#625C67]
                shadow-sm
                backdrop-blur-sm
              "
            >
              <MessageCircleHeart
                size={15}
                className="text-[#A887C5]"
              />

              <span className="text-base">
                Your feedback matters.
              </span>
            </div>

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
              Can't find what you need?
              <br />

              <span className="text-[#A887C5]">
                Tell us.
              </span>
            </h2>

            <p
              className="
                mt-5
                text-[17px]
                font-medium
                leading-7
                text-[#625C67]
                sm:text-lg
                sm:leading-8
              "
            >
              Tell us which topic you'd like to see next.
              <br className="hidden sm:block" />
              We read every request.
            </p>
          </motion.div>

          {/* ==================================================
              AFFORDABILITY MESSAGE
          ================================================== */}

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
              delay: 0.15,
            }}
            className="
              mx-auto
              mt-10
              max-w-3xl
              rounded-3xl
              border
              border-[#E8DDF0]
              bg-white/70
              px-6
              py-6
              text-center
              shadow-sm
              backdrop-blur-sm
              sm:px-10
              sm:py-7
            "
          >
            <div
              className="
                mx-auto
                mb-4
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#F3EBFA]
                text-[#A887C5]
              "
            >
              <Sparkles size={18} />
            </div>

            <h3
              className="
                font-['Plus_Jakarta_Sans']
                text-xl
                font-bold
                text-[#29252D]
                sm:text-2xl
              "
            >
              Good preparation shouldn't have to be expensive.
            </h3>

            <p
              className="
                mx-auto
                mt-3
                max-w-2xl
                text-[15px]
                font-medium
                leading-7
                text-[#625C67]
                sm:text-base
                sm:leading-7
              "
            >
              If there's something you'd love to learn but don't
              want to spend hundreds on, let us know. That's why
              OnlyPrep kits start at just{" "}
              <span className="font-bold text-[#A887C5]">
                ₹29
              </span>{" "}
              — because everyone deserves a fair shot at their
              next opportunity.
            </p>
          </motion.div>

          {/* ==================================================
              REQUEST FORM
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
              delay: 0.25,
            }}
            className="
              mx-auto
              mt-8
              max-w-2xl
              rounded-[28px]
              border
              border-[#E8DDF0]
              bg-white
              p-6
              shadow-[0_15px_50px_rgba(60,40,80,0.07)]
              sm:p-8
            "
          >
            {submitted ? (
              /* ==================================================
                 SUCCESS STATE
              ================================================== */

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="
                  flex
                  min-h-[280px]
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F1EAF8]
                    text-[#A887C5]
                  "
                >
                  <CheckCircle2 size={28} />
                </div>

                <h3
                  className="
                    mt-5
                    text-xl
                    font-bold
                    text-[#29252D]
                  "
                >
                  Got it! 💜
                </h3>

                <p
                  className="
                    mt-2
                    max-w-sm
                    text-[15px]
                    font-medium
                    leading-6
                    text-[#625C67]
                  "
                >
                  Thanks for helping us build OnlyPrep better.
                  We'll keep your suggestion in mind.
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="
                    mt-6
                    text-sm
                    font-semibold
                    text-[#A887C5]
                    transition-colors
                    hover:text-[#8F70B0]
                  "
                >
                  Submit another request
                </button>
              </motion.div>
            ) : (
              /* ==================================================
                 FORM
              ================================================== */

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* TOPIC INPUT */}

                <div>
  <label
    htmlFor="topic"
    className="
      mb-2
      block
      text-base
      font-semibold
      text-[#403A46]
    "
  >
    Topic suggestion

    <span className="ml-1 text-[#A887C5]">
      *
    </span>
  </label>

  <input
    id="topic"
    type="text"
    value={topic}
    onChange={(e) => setTopic(e.target.value)}
    placeholder="e.g. React performance, System Design, Python..."
    required
    className="
      w-full
      rounded-2xl
      border
      border-[#E8E1EC]
      bg-[#FFFCFE]
      px-4
      py-3.5
      text-[15px]
      font-medium
      text-[#29252D]
      outline-none
      transition-all
      placeholder:text-[#8F8894]
      focus:border-[#B89AD9]
      focus:ring-4
      focus:ring-[#B89AD9]/10
    "
  />
</div>

                {/* FEEDBACK TEXTAREA */}

                <div>
  <label
    htmlFor="feedback"
    className="
      mb-2
      block
      text-base
      font-semibold
      text-[#403A46]
    "
  >
    Feedback / anything else

    <span className="ml-1 font-normal text-[#8F8894]">
      (optional)
    </span>
  </label>

  <textarea
    id="feedback"
    value={feedback}
    onChange={(e) => setFeedback(e.target.value)}
    placeholder="Anything you'd like us to know?"
    rows={4}
    className="
      w-full
      resize-none
      rounded-2xl
      border
      border-[#E8E1EC]
      bg-[#FFFCFE]
      px-4
      py-3.5
      text-[15px]
      font-medium
      leading-6
      text-[#29252D]
      outline-none
      transition-all
      placeholder:text-[#8F8894]
      focus:border-[#B89AD9]
      focus:ring-4
      focus:ring-[#B89AD9]/10
    "
  />
</div>

                {/* SUBMIT BUTTON */}

                <button
                  type="submit"
                  className="
                    group
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#B89AD9]
                    px-6
                    py-3.5
                    text-[15px]
                    font-semibold
                    text-white
                    shadow-[0_8px_25px_rgba(184,154,217,0.22)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#9F7FC3]
                    hover:shadow-[0_12px_30px_rgba(184,154,217,0.28)]
                  "
                >
                  <span>
                    Send request
                  </span>

                  <Send
                    size={16}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>

                {/* REASSURANCE */}

                <p
                  className="
                    text-center
                    text-sm
                    font-medium
                    text-[#8B848F]
                  "
                >
                  No account needed. Just tell us what you need. 💜
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TopicRequest;