"use client";

import { CheckCircle, Facebook, Instagram, MessageCircle, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ThankYouPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">

            <div className="glass-card max-w-xl w-full text-center p-10 rounded-3xl border border-white/10">

                <div className="flex justify-center mb-6">
                    <Image
                        src="/trade-circle-logo.png"
                        alt="Trade Circle"
                        width={120}
                        height={40}
                        className="object-contain"
                    />
                </div>

                <h1 className="text-3xl font-bold mb-4">
                    Thank You for Joining Trade Circle
                </h1>

                <p className="text-gray-400 mb-6">
                    Your mobile number has been successfully verified and your account
                    is now active.
                </p>

                {/* <Link
                    href="/dashboard"
                    className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold"
                >
                    Go to Dashboard
                </Link> */}

                <div className="max-w-4xl mx-auto text-center space-y-8">

                    {/* WhatsApp Button */}
                    <a
                        href="https://wa.me/919892954191"
                        target="_blank"
                        className="flex items-center justify-center gap-3 
          bg-white/10 backdrop-blur-md 
          border border-white/20 
          rounded-xl 
          py-4 px-6 
          text-white 
          font-medium 
          hover:border-[var(--brand-gold)] 
          hover:bg-white/5 
          transition duration-300"
                    >
                        <MessageCircle
                            size={20}
                            className="text-[var(--brand-gold)]"
                        />
                        Chat on WhatsApp
                    </a>

                    {/* Connect With Us */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">
                            Connect with Us:
                        </h3>

                        <div className="flex justify-center gap-6">

                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/tradecircle.vip?igsh=amgxZndrc2l0Ynp0&utm_source=qr"
                                className="w-12 h-12 rounded-full 
              flex items-center justify-center 
              border border-white/20 
              hover:border-[var(--brand-gold)] 
              hover:bg-[var(--brand-gold)] 
              hover:text-black 
              transition duration-300"
                            >
                                <Instagram size={20} />
                            </a>

                            {/* Telegram */}
                            <a
                                href="https://x.com/CircleTrad98640"
                                className="w-12 h-12 rounded-full 
              flex items-center justify-center 
              border border-white/20 
              hover:border-[var(--brand-gold)] 
              hover:bg-[var(--brand-gold)] 
              hover:text-black 
              transition duration-300"
                            >
                                <Twitter size={20} />
                            </a>

                            {/* Facebook */}
                            <a
                                href="https://www.facebook.com/share/1E3R4FLr8T/?mibextid=wwXIfr"
                                className="w-12 h-12 rounded-full 
              flex items-center justify-center 
              border border-white/20 
              hover:border-[var(--brand-gold)] 
              hover:bg-[var(--brand-gold)] 
              hover:text-black 
              transition duration-300"
                            >
                                <Facebook size={20} />
                            </a>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}