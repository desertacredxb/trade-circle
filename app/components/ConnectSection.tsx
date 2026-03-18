"use client";

import { MessageCircle, Instagram, Send, Twitter, Facebook } from "lucide-react";

export default function ConnectSection() {
  return (
    <section className="section-padding">
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
    </section>
  );
}