"use client";

import { WhatsappLogo, ArrowUpRight } from "@phosphor-icons/react";
import { eventConfig } from "@/lib/config";

interface WhatsAppButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  text?: string;
}

export default function WhatsAppButton({
  className = "",
  variant = "primary",
  text = "I've Paid — Contact Organizer",
}: WhatsAppButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base font-semibold tracking-wide shadow-md transition-all active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-purple-950 hover:bg-purple-900 text-white shadow-purple-950/20 hover:shadow-lg",
    secondary:
      "bg-zinc-900 hover:bg-black text-white shadow-zinc-900/20 hover:shadow-lg",
    outline:
      "border-2 border-purple-950 text-purple-950 hover:bg-purple-950 hover:text-white",
  };

  return (
    <a
      href={eventConfig.whatsapp.getLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      <WhatsappLogo size={20} weight="fill" />
      <span>{text}</span>
      <ArrowUpRight size={16} weight="bold" />
    </a>
  );
}
