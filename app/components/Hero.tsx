"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <>
      <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden pt-24">
        {/* 🎥 Background Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover p-8"
          src="/ladscape-video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* 🌑 Dark Overlay */}
        {/* <div className="absolute inset-0 bg-black/60"></div> */}

        {/* 📦 Content Container */}
        {/* <div className="relative z-10 w-full md:w-[70%] mx-auto px-6 text-center">

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-5xl font-bold leading-tight"
                    >
                        Turn Market Moves Into
                        <span className="block text-[var(--brand-gold)]">
                            Profitable Trades
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-gray-300 text-base md:text-lg"
                    >
                        Join Trade Circle and get real-time trading signals,
                        smart strategies, and expert insights.
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-10 w-full md:w-auto bg-[var(--brand-gold)] hover:bg-[var(--brand-orange)] px-8 py-4 rounded-xl font-semibold text-black transition"
                    >
                        Get 20% Bonus on First Deposit
                    </motion.button>
                </div> */}

        {/* 🔊 Mute Button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-12 right-10 z-20 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm hover:bg-white/20 transition cursor-pointer"
        >
          {isMuted ? "Unmute 🔊" : "Mute 🔇"}
        </button>
      </section>

      <div className="px-6 w-full">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => {
            document
              .getElementById("contact-form")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full bg-(--brand-gold) hover:bg-(--brand-orange) py-4 rounded-xl font-semibold text-black transition cursor-pointer"
        >
          Get 20% Bonus on First Deposit
        </motion.button>
      </div>
    </>
  );
}
