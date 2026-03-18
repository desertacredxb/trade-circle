"use client";

import {
  Percent,
  TrendingUp,
  Headphones,
  Video,
  UserCheck,
  BanknoteArrowDown,
  BanknoteArrowUp
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Margin",
    subtitle: "500x",
  },
  {
    icon: Headphones,
    title: "Support",
    subtitle: "24x7",
  },
  {
    icon: BanknoteArrowDown,
    title: "Withdrawal",
    subtitle: "Fastest",
  },
  {
    icon: BanknoteArrowUp,
    title: "Deposit",
    subtitle: "Hassel Free",
  },
];

export default function FeaturesSection() {
  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Glass Container */}
        <div className="glass-card rounded-3xl p-10 md:p-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center group transition"
                >
                  {/* Icon Circle */}
                  <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                    <Icon size={34} className="text-black" />
                  </div>

                  {/* Big Highlight Text (if exists) */}
                  {feature.subtitle && (
                    <h3 className="text-3xl font-bold mt-4 text-white">
                      {feature.subtitle}
                    </h3>
                  )}

                  {/* Title */}
                  <p className="mt-2 text-gray-300 font-medium">
                    {feature.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}