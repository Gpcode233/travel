"use client";

import { Check } from "@phosphor-icons/react";

interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
}

const STEPS = [
  { step: 1, label: "Transfer ₦5,000" },
  { step: 2, label: "WhatsApp Receipt" },
  { step: 3, label: "Receive Code" },
  { step: 4, label: "Enter Code" },
  { step: 5, label: "Register" },
];

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-200 -translate-y-1/2 -z-0" />
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-purple-950 -translate-y-1/2 -z-0 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <div
              key={s.step}
              className="flex flex-col items-center relative z-10 group"
            >
              <div
                className={`size-7 sm:size-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                  isCompleted
                    ? "bg-purple-950 text-white"
                    : isCurrent
                    ? "bg-purple-950 text-white ring-4 ring-purple-950/15"
                    : "bg-white border-2 border-zinc-300 text-zinc-600"
                }`}
              >
                {isCompleted ? <Check size={14} weight="bold" /> : s.step}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium mt-1.5 text-center whitespace-nowrap hidden sm:block ${
                  isCurrent
                    ? "text-purple-950 font-bold"
                    : isCompleted
                    ? "text-zinc-700"
                    : "text-zinc-600"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
