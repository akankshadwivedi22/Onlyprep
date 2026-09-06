import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  Sparkles,
  Search,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import { kits } from "./kits";
import type { Kit } from "./types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const API_URL = "http://localhost:8000";

const ProductionSection = () => {
  // ==================================================
  // STATE
  // ==================================================

  const [selectedKit, setSelectedKit] =
    useState<Kit | null>(null);

  const [email, setEmail] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [isVerifyingPayment, setIsVerifyingPayment] =
    useState(false);

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  const [paymentIssue, setPaymentIssue] =
    useState(false);

  const [purchaseId, setPurchaseId] =
    useState<number | null>(null);

  const [searchQuery, setSearchQuery] =
    useState("");


  // ==================================================
  // OPEN BUY MODAL
  // ==================================================

  const openBuyModal = (kit: Kit) => {

    setSelectedKit(kit);

    setEmail("");

    setPaymentSuccess(false);

    setPaymentIssue(false);

    setPurchaseId(null);

    setIsLoading(false);

    setIsVerifyingPayment(false);
  };


  // ==================================================
  // CLOSE BUY MODAL
  // ==================================================

  const closeBuyModal = () => {

    if (
      isLoading ||
      isVerifyingPayment
    ) {
      return;
    }

    setSelectedKit(null);

    setEmail("");

    setPaymentSuccess(false);

    setPaymentIssue(false);

    setPurchaseId(null);

    setIsVerifyingPayment(false);
  };


  // ==================================================
  // EMAIL VALIDATION
  // ==================================================

  const isValidEmail = (
    value: string
  ) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value.trim()
    );
  };


  // ==================================================
  // GET ERROR MESSAGE
  // ==================================================

  const getErrorMessage = (
    error: unknown,
    fallbackMessage: string
  ) => {

    if (axios.isAxiosError(error)) {

      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message;

      if (
        typeof backendMessage === "string" &&
        backendMessage.trim()
      ) {

        return backendMessage;
      }

      if (error.response) {

        return fallbackMessage;
      }

      if (error.request) {

        return (
          "Unable to connect to the server. " +
          "Please try again later."
        );
      }
    }

    if (
      error instanceof Error &&
      error.message
    ) {

      return error.message;
    }

    return fallbackMessage;
  };


  // ==================================================
  // SEARCH KITS
  // ==================================================

  const filteredKits = kits.filter(
    (kit) => {

      const query = searchQuery
        .trim()
        .toLowerCase();

      if (!query) {

        return true;
      }

      return (
        kit.title
          .toLowerCase()
          .includes(query) ||

        kit.description
          .toLowerCase()
          .includes(query) ||

        kit.questions
          .toLowerCase()
          .includes(query)
      );
    }
  );


  // ==================================================
  // HANDLE PAYMENT
  // ==================================================

  const handlePayment = async () => {

    // ------------------------------------------
    // Prevent duplicate clicks
    // ------------------------------------------

    if (isLoading) {

      return;
    }


    // ------------------------------------------
    // Validate selected kit
    // ------------------------------------------

    if (!selectedKit) {

      toast.error(
        "Please select a kit and try again."
      );

      return;
    }


    // ------------------------------------------
    // Validate email
    // ------------------------------------------

    const trimmedEmail =
      email.trim();

    if (!trimmedEmail) {

      toast.error(
        "Please enter your email address."
      );

      return;
    }


    if (!isValidEmail(trimmedEmail)) {

      toast.error(
        "Please enter a valid email address."
      );

      return;
    }


    // ------------------------------------------
    // Start payment flow
    // ------------------------------------------

    setIsLoading(true);

    setPaymentIssue(false);

    setPaymentSuccess(false);


    try {

      // ==================================================
      // STEP 1:
      // CREATE PURCHASE + RAZORPAY ORDER
      // ==================================================

      const response = await axios.post(
        `${API_URL}/purchase`,
        {
          kit_id: selectedKit.id,
          email: trimmedEmail,
        },
        {
          timeout: 15000,
        }
      );


      // ------------------------------------------
      // Make sure API was successful
      // ------------------------------------------

      if (
        response.status < 200 ||
        response.status >= 300
      ) {

        throw new Error(
          "Unable to create your purchase."
        );
      }


      // ------------------------------------------
      // Get backend response
      // ------------------------------------------

      const {
        purchase_id,
        kit_title,
        amount,
        razorpay_order_id,
        razorpay_key_id,
      } = response.data;


      // ------------------------------------------
      // Save purchase ID
      // ------------------------------------------

      setPurchaseId(
        purchase_id
      );


      // ------------------------------------------
      // Validate response
      // ------------------------------------------

      if (!purchase_id) {

        throw new Error(
          "Purchase information is missing. Please try again."
        );
      }


      if (!kit_title) {

        throw new Error(
          "Kit information is missing. Please try again."
        );
      }


      if (
        typeof amount !== "number" ||
        amount <= 0
      ) {

        throw new Error(
          "Invalid payment amount. Please try again."
        );
      }


      if (!razorpay_order_id) {

        throw new Error(
          "Payment order could not be created. Please try again."
        );
      }


      if (!razorpay_key_id) {

        throw new Error(
          "Payment configuration is unavailable. Please try again later."
        );
      }


      console.log(
        "Purchase created:",
        response.data
      );


      // ==================================================
      // STEP 2:
      // CHECK RAZORPAY SDK
      // ==================================================

      if (
        typeof window.Razorpay !== "function"
      ) {

        throw new Error(
          "Payment service is currently unavailable. Please try again later."
        );
      }


      // ==================================================
      // PAYMENT VERIFICATION FLAG
      // ==================================================

      let paymentVerificationStarted =
        false;


      // ==================================================
      // STEP 3:
      // RAZORPAY CHECKOUT OPTIONS
      // ==================================================

      const options = {

        key: razorpay_key_id,

        amount: amount * 100,

        currency: "INR",

        name: "OnlyPrep",

        description: kit_title,

        order_id: razorpay_order_id,


        // ------------------------------------------
        // Prefill
        // ------------------------------------------

        prefill: {
          email: trimmedEmail,
        },


        // ------------------------------------------
        // Theme
        // ------------------------------------------

        theme: {
          color: "#B89AD9",
        },


        // ==================================================
        // RAZORPAY MODAL
        // ==================================================

        modal: {

          confirm_close: true,

          escape: true,

          backdropclose: false,


          ondismiss: function () {

            console.log(
              "Razorpay checkout closed."
            );


            // Razorpay can also close after
            // successful payment.
            //
            // So don't treat it as cancellation
            // once verification has started.

            if (
              paymentVerificationStarted
            ) {

              return;
            }


            setIsLoading(false);


            toast.error(
              "Payment was cancelled. You can try again anytime."
            );
          },
        },


        // ==================================================
        // PAYMENT SUCCESS
        // ==================================================

        handler: async function (
          paymentResponse: any
        ) {

          // ------------------------------------------
          // Payment has already happened on Razorpay.
          // Now backend verification starts.
          // ------------------------------------------

          paymentVerificationStarted =
            true;

          setIsVerifyingPayment(true);


          try {

            console.log(
              "Razorpay payment response:",
              paymentResponse
            );


            // ==================================================
            // VALIDATE RAZORPAY RESPONSE
            // ==================================================

            if (
              !paymentResponse?.razorpay_payment_id ||
              !paymentResponse?.razorpay_order_id ||
              !paymentResponse?.razorpay_signature
            ) {

              throw new Error(
                "PAYMENT_VERIFICATION_FAILED"
              );
            }


            // ==================================================
            // STEP 4:
            // VERIFY PAYMENT WITH BACKEND
            // ==================================================

            const verifyResponse =
              await axios.post(
                `${API_URL}/payment/verify`,
                {
                  purchase_id:
                    purchase_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                },
                {
                  timeout: 20000,
                }
              );


            console.log(
              "Payment verification response:",
              verifyResponse.data
            );


            // ==================================================
            // API MUST RETURN 200
            // ==================================================

            if (
              verifyResponse.status !== 200
            ) {

              throw new Error(
                "PAYMENT_VERIFICATION_FAILED"
              );
            }


            // ==================================================
            // PAYMENT MUST BE PAID
            // ==================================================

            if (
              verifyResponse.data?.status !==
              "paid"
            ) {

              throw new Error(
                "PAYMENT_VERIFICATION_FAILED"
              );
            }


            // ==================================================
            // PAYMENT + EMAIL SUCCESS
            // ==================================================

            setIsVerifyingPayment(false);

            setIsLoading(false);

            setPaymentSuccess(true);

          } catch (error) {

            console.error(
              "Payment verification failed:",
              error
            );


            // ==================================================
            // STOP LOADER
            // ==================================================

            setIsVerifyingPayment(false);

            setIsLoading(false);


            // ==================================================
            // IMPORTANT
            //
            // Razorpay already reported successful payment.
            //
            // Therefore DON'T tell the user:
            // "Payment failed"
            //
            // because money may already have been deducted.
            // ==================================================

            setSelectedKit(null);

            setEmail("");

            setPaymentSuccess(false);


            // ==================================================
            // SHOW SUPPORT POPUP
            // ==================================================

            setPaymentIssue(true);
          }
        },
      };


      // ==================================================
      // STEP 5:
      // CREATE RAZORPAY INSTANCE
      // ==================================================

      let razorpay;


      try {

        razorpay =
          new window.Razorpay(
            options
          );

      } catch (error) {

        console.error(
          "Razorpay initialization failed:",
          error
        );


        setIsLoading(false);


        toast.error(
          "Unable to open payment. Please try again later."
        );


        return;
      }


      // ==================================================
      // PAYMENT FAILED EVENT
      // ==================================================

      razorpay.on(
        "payment.failed",
        function (response: any) {

          console.error(
            "Razorpay payment failed:",
            response
          );


          setIsLoading(false);


          const errorDescription =
            response?.error?.description;


          toast.error(
            errorDescription ||
              "Payment failed. Please try again."
          );
        }
      );


      // ==================================================
      // OPEN RAZORPAY
      // ==================================================

      try {

        razorpay.open();

      } catch (error) {

        console.error(
          "Failed to open Razorpay:",
          error
        );


        setIsLoading(false);


        toast.error(
          "Unable to open payment. Please try again later."
        );
      }

    } catch (error) {

      console.error(
        "Purchase / Razorpay order creation failed:",
        error
      );


      setIsLoading(false);


      toast.error(
        getErrorMessage(
          error,
          "Something went wrong. Please try again later."
        )
      );
    }
  };


  // ==================================================
  // UI
  // ==================================================

  return (

    <section
      id="kits"
      className="
        relative
        overflow-hidden
        bg-[#FFFCFA]
        px-5
        py-24
        sm:py-28
      "
    >

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
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
          className="
            mx-auto
            max-w-2xl
            text-center
          "
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

            <Sparkles
              size={15}
              className="text-[#A887C5]"
            />

            <span className="text-base">
              Interview prep, simplified.
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

            Pick your

            <span className="text-[#A887C5]">
              {" "}prep kit.
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
            Focused interview kits designed to help
            you prepare smarter, without spending a
            fortune.
          </p>

        </motion.div>


        {/* ==================================================
            SEARCH
        ================================================== */}

        <motion.div
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
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="
            mx-auto
            mt-10
            max-w-xl
          "
        >

          <div
            className="
              relative
              flex
              items-center
            "
          >

            <Search
              size={18}
              className="
                absolute
                left-4
                text-[#9A949D]
              "
            />


            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search for a topic..."
              className="
                w-full
                rounded-2xl
                border
                border-[#E8E1EC]
                bg-white
                py-4
                pl-11
                pr-4
                text-sm
                font-medium
                text-[#29252D]
                shadow-[0_8px_30px_rgba(60,40,80,0.04)]
                outline-none
                transition-all
                placeholder:text-[#9A949D]
                focus:border-[#B89AD9]
                focus:ring-4
                focus:ring-[#B89AD9]/10
              "
            />

          </div>

        </motion.div>


        {/* ==================================================
            KITS GRID
        ================================================== */}

        {filteredKits.length > 0 ? (

          <div
            className="
              mt-12
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              lg:grid-cols-3
            "
          >

            {filteredKits.map(
              (kit, index) => (

                <motion.div
                  key={kit.id}
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
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="
                    group
                    flex
                    min-h-[300px]
                    flex-col
                    rounded-[28px]
                    border
                    border-[#E8DDF0]
                    bg-white
                    p-7
                    shadow-[0_15px_50px_rgba(60,40,80,0.06)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_20px_55px_rgba(60,40,80,0.1)]
                  "
                >

                  <span
                    className="
                      w-fit
                      rounded-full
                      bg-[#F3EBFA]
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      text-[#9A78B8]
                    "
                  >
                    {kit.questions}
                  </span>


                  <h3
                    className="
                      mt-6
                      font-['Plus_Jakarta_Sans']
                      text-2xl
                      font-bold
                      tracking-[-0.02em]
                      text-[#29252D]
                    "
                  >
                    {kit.title}
                  </h3>


                  <p
                    className="
                      mt-3
                      text-[15px]
                      font-medium
                      leading-6
                      text-[#625C67]
                    "
                  >
                    {kit.description}
                  </p>


                  <div
                    className="
                      mt-auto
                      flex
                      items-end
                      justify-between
                      gap-4
                      pt-8
                    "
                  >

                    <div>

                      <p
                        className="
                          text-sm
                          font-medium
                          text-[#8B848F]
                        "
                      >
                        One-time
                      </p>


                      <p
                        className="
                          mt-1
                          text-2xl
                          font-extrabold
                          text-[#A887C5]
                        "
                      >
                        ₹{kit.price}
                      </p>

                    </div>


                    <button
                      onClick={() =>
                        openBuyModal(kit)
                      }
                      className="
                        group/btn
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-[#B89AD9]
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition-all
                        duration-300
                        hover:bg-[#9F7FC3]
                      "
                    >

                      Buy

                      <ArrowRight
                        size={15}
                        className="
                          transition-transform
                          duration-300
                          group-hover/btn:translate-x-1
                        "
                      />

                    </button>

                  </div>

                </motion.div>

              )
            )}

          </div>

        ) : (

          /* ==================================================
             NO SEARCH RESULTS
          ================================================== */

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mx-auto
              mt-12
              max-w-xl
              rounded-[28px]
              border
              border-[#E8DDF0]
              bg-white
              px-7
              py-12
              text-center
              shadow-[0_15px_50px_rgba(60,40,80,0.05)]
            "
          >

            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-[#F3EBFA]
                text-2xl
              "
            >
              🔎
            </div>


            <h3
              className="
                mt-5
                font-['Plus_Jakarta_Sans']
                text-xl
                font-bold
                text-[#29252D]
              "
            >
              No kits found
            </h3>


            <p
              className="
                mt-2
                text-base
                font-medium
                leading-6
                text-[#625C67]
              "
            >
              We couldn't find a kit matching{" "}

              <span
                className="
                  font-semibold
                  text-[#29252D]
                "
              >
                "{searchQuery}"
              </span>
              .
            </p>


            <p
              className="
                mt-5
                text-base
                font-medium
                leading-6
                text-[#625C67]
              "
            >
              Looking for something else?
              <br />
              Request a topic and we'll do our best
              to deliver it to you. 💜
            </p>


            <button
              onClick={() => {

                document
                  .getElementById("request")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });

              }}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#B89AD9]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:bg-[#9F7FC3]
              "
            >

              Request a topic

              <ArrowRight
                size={15}
              />

            </button>

          </motion.div>

        )}

      </div>


      {/* ==================================================
          BUY / SUCCESS MODAL
      ================================================== */}

      <AnimatePresence>

        {selectedKit && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/40
              px-5
              py-8
              backdrop-blur-sm
            "
            onClick={() => {

              if (
                !isLoading &&
                !isVerifyingPayment
              ) {

                closeBuyModal();
              }

            }}
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 15,
              }}
              transition={{
                duration: 0.2,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                relative
                w-full
                max-w-lg
                rounded-[24px]
                bg-white
                p-8
                shadow-2xl
                sm:p-10
              "
            >

              {/* ==================================================
                  PAYMENT VERIFICATION LOADER
              ================================================== */}

              {isVerifyingPayment && (

                <div
                  className="
                    absolute
                    inset-0
                    z-50
                    flex
                    flex-col
                    items-center
                    justify-center
                    rounded-[24px]
                    bg-white/95
                    px-6
                    text-center
                    backdrop-blur-sm
                  "
                >

                  <LoaderCircle
                    size={42}
                    className="
                      animate-spin
                      text-[#A887C5]
                    "
                  />


                  <h3
                    className="
                      mt-5
                      font-['Plus_Jakarta_Sans']
                      text-xl
                      font-bold
                      text-[#29252D]
                    "
                  >
                    Confirming your payment
                  </h3>


                  <p
                    className="
                      mt-2
                      max-w-xs
                      text-center
                      text-sm
                      font-medium
                      leading-6
                      text-[#8B848F]
                    "
                  >
                    Please wait while we confirm
                    your payment and send your kit
                    to your email. 💜
                  </p>

                </div>

              )}


              {/* ==================================================
                  SUCCESS SCREEN
              ================================================== */}

              {paymentSuccess ? (

                <div
                  className="
                    flex
                    flex-col
                    items-center
                    py-8
                    text-center
                  "
                >

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F3EBFA]
                      text-3xl
                    "
                  >
                    💜
                  </div>


                  <h3
                    className="
                      mt-6
                      font-['Plus_Jakarta_Sans']
                      text-2xl
                      font-bold
                      tracking-[-0.02em]
                      text-[#29252D]
                      sm:text-3xl
                    "
                  >
                    You're all set! ✨
                  </h3>


                  <p
                    className="
                      mt-4
                      max-w-sm
                      text-[15px]
                      font-medium
                      leading-6
                      text-[#625C67]
                    "
                  >
                    Your{" "}

                    <span
                      className="
                        font-semibold
                        text-[#29252D]
                      "
                    >
                      {selectedKit.title}
                    </span>{" "}

                    has been sent to
                  </p>


                  <p
                    className="
                      mt-2
                      break-all
                      text-sm
                      font-semibold
                      text-[#A887C5]
                    "
                  >
                    {email}
                  </p>


                  <p
                    className="
                      mt-4
                      max-w-sm
                      text-sm
                      font-medium
                      leading-6
                      text-[#8B848F]
                    "
                  >
                    Check your inbox — your interview
                    prep is waiting for you. 💜
                  </p>


                  <button
                    onClick={closeBuyModal}
                    className="
                      mt-8
                      w-full
                      rounded-2xl
                      bg-[#B89AD9]
                      px-6
                      py-4
                      text-sm
                      font-semibold
                      text-white
                      transition-all
                      duration-300
                      hover:bg-[#9F7FC3]
                    "
                  >
                    Done
                  </button>

                </div>

              ) : (

                /* ==================================================
                   PURCHASE SCREEN
                ================================================== */

                <>

                  {/* ==================================================
                      CLOSE BUTTON
                  ================================================== */}

                  <button
                    onClick={closeBuyModal}
                    disabled={
                      isLoading ||
                      isVerifyingPayment
                    }
                    className="
                      absolute
                      right-6
                      top-6
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F5F1F7]
                      text-[#625C67]
                      transition-colors
                      hover:bg-[#EDE5F2]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    <X size={17} />

                  </button>


                  {/* ==================================================
                      KIT INFO
                  ================================================== */}

                  <div className="pr-12">

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-[#A887C5]
                      "
                    >
                      You're buying
                    </p>


                    <h3
                      className="
                        mt-2
                        font-['Plus_Jakarta_Sans']
                        text-2xl
                        font-bold
                        tracking-[-0.02em]
                        text-[#29252D]
                        sm:text-3xl
                      "
                    >
                      {selectedKit.title}
                    </h3>


                    <div
                      className="
                        mt-3
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <span
                        className="
                          text-2xl
                          font-extrabold
                          text-[#A887C5]
                        "
                      >
                        ₹{selectedKit.price}
                      </span>


                      <span
                        className="
                          h-1
                          w-1
                          rounded-full
                          bg-[#B9B1BC]
                        "
                      />


                      <span
                        className="
                          text-sm
                          font-medium
                          text-[#625C67]
                        "
                      >
                        {selectedKit.questions}
                      </span>

                    </div>


                    <p
                      className="
                        mt-4
                        max-w-md
                        text-sm
                        font-medium
                        leading-6
                        text-[#625C67]
                      "
                    >
                      {selectedKit.description}
                    </p>

                  </div>


                  <div
                    className="
                      my-7
                      h-px
                      bg-[#EEE8F1]
                    "
                  />


                  {/* ==================================================
                      EMAIL
                  ================================================== */}

                  <div>

                    <label
                      htmlFor="purchase-email"
                      className="
                        mb-2
                        block
                        text-base
                        font-semibold
                        text-[#403A46]
                      "
                    >
                      Where should we send your kit?
                    </label>


                    <input
                      id="purchase-email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      onKeyDown={(e) => {

                        if (
                          e.key === "Enter" &&
                          !isLoading &&
                          !isVerifyingPayment
                        ) {

                          handlePayment();
                        }

                      }}
                      placeholder="you@example.com"
                      disabled={
                        isLoading ||
                        isVerifyingPayment
                      }
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-[#E8E1EC]
                        bg-[#FFFCFE]
                        px-4
                        py-3.5
                        text-sm
                        font-medium
                        text-[#29252D]
                        outline-none
                        transition-all
                        placeholder:text-[#9A949D]
                        focus:border-[#B89AD9]
                        focus:ring-4
                        focus:ring-[#B89AD9]/10
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    />

                  </div>


                  {/* ==================================================
                      PAY BUTTON
                  ================================================== */}

                  <button
                    onClick={handlePayment}
                    disabled={
                      isLoading ||
                      isVerifyingPayment
                    }
                    className="
                      mt-5
                      w-full
                      rounded-2xl
                      bg-[#B89AD9]
                      px-6
                      py-4
                      text-sm
                      font-semibold
                      text-white
                      transition-all
                      duration-300
                      hover:bg-[#9F7FC3]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    Pay ₹{selectedKit.price}
                  </button>


                  {/* ==================================================
                      FOOTNOTE
                  ================================================== */}

                  <p
                    className="
                      mt-4
                      text-center
                      text-sm
                      text-[15px]
                      font-medium
                      leading-5
                      text-[#8B848F]
                    "
                  >
                    
                    After successful payment, your kit
                    will be delivered to this email address.
                    
                  </p>

                </>

              )}

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>


      {/* ==================================================
          PAYMENT ISSUE POPUP
      ================================================== */}

      <AnimatePresence>

        {paymentIssue && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-[60]
              flex
              items-center
              justify-center
              bg-black/40
              px-5
              py-8
              backdrop-blur-sm
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 15,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                w-full
                max-w-md
                rounded-[24px]
                bg-white
                p-8
                text-center
                shadow-2xl
                sm:p-10
              "
            >

              {/* ==================================================
                  ICON
              ================================================== */}

              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F3EBFA]
                  text-2xl
                "
              >
                <AlertCircle
                  size={30}
                  className="text-[#A887C5]"
                />
              </div>


              {/* ==================================================
                  TITLE
              ================================================== */}

              <h3
                className="
                  mt-6
                  font-['Plus_Jakarta_Sans']
                  text-2xl
                  font-bold
                  tracking-[-0.02em]
                  text-[#29252D]
                "
              >
                Something went wrong
              </h3>


              {/* ==================================================
                  DESCRIPTION
              ================================================== */}

              <p
                className="
                  mt-4
                  text-base
                  font-medium
                  leading-6
                  text-[#625C67]
                "
              >
                We couldn't confirm your purchase
                right now.
              </p>


              {/* ==================================================
                  IMPORTANT MESSAGE
              ================================================== */}

              <div
                className="
                  mt-5
                  rounded-2xl
                  bg-[#F8F4FA]
                  px-5
                  py-4
                  text-left
                "
              >

                <p
                  className="
                    text-sm
                    font-semibold
                    leading-6
                    text-[#403A46]
                  "
                >
                  If your payment was deducted,
                  <span className="text-[#A887C5]">
                    {" "}please don't make another payment.
                  </span>
                </p>


                <p
                  className="
                    mt-2
                    text-sm
                    font-medium
                    leading-6
                    text-[#625C67]
                  "
                >
                  Please contact us at{" "}

                  <a
                    href="mailto:onlyprep@gmail.com"
                    className="
                      font-semibold
                      text-[#A887C5]
                      underline
                      underline-offset-2
                    "
                  >
                    <b>
                    hionlyprep@gmail.com </b>
                  </a>{" "}

                  and we'll check your payment and
                  help you get your kit.
                </p>

              </div>


              {/* ==================================================
                  PURCHASE ID
              ================================================== */}

              {purchaseId && (

                <p
                  className="
                    mt-4
                    text-xs
                    font-medium
                    text-[#8B848F]
                  "
                >
                  Purchase ID:{" "}

                  <span
                    className="
                      font-semibold
                      text-[#625C67]
                    "
                  >
                    #{purchaseId}
                  </span>
                </p>

              )}


              {/* ==================================================
                  CLOSE BUTTON
              ================================================== */}

              <button
                onClick={() => {

                  setPaymentIssue(false);

                  setPurchaseId(null);

                }}
                className="
                  mt-7
                  w-full
                  rounded-2xl
                  bg-[#B89AD9]
                  px-6
                  py-4
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[#9F7FC3]
                "
              >
                Got it
              </button>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </section>
  );
};

export default ProductionSection;