"use client";

import { useState } from "react";
import {
  ShieldCheck,
  CircleNotch,
  WarningCircle,
  ArrowRight,
  User,
  EnvelopeSimple,
  Phone,
  MapPin,
  Buildings,
  CheckCircle,
} from "@phosphor-icons/react";
import { eventConfig } from "@/lib/config";
import { RegistrationFormData } from "@/lib/validation";

interface RegistrationFormProps {
  code: string;
  onSuccess: (data: RegistrationFormData) => void;
  onChangeCode: () => void;
}

export default function RegistrationForm({
  code,
  onSuccess,
  onChangeCode,
}: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    registrationCode: code,
    name: "",
    stateOfOrigin: "",
    denomination: "",
    address: "",
    phone: "",
    email: "",
    sex: "",
    ageBracket: "",
    categoryOfInterest: "",
    suggestions: "",
    contactFuture: "Yes",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Client-side quick checks
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full name is required.";
    if (!formData.stateOfOrigin.trim())
      errors.stateOfOrigin = "State of origin is required.";
    if (!formData.denomination.trim())
      errors.denomination = "Denomination is required.";
    if (!formData.address.trim()) errors.address = "Address is required.";
    if (!formData.phone.trim()) errors.phone = "Contact number is required.";
    if (!formData.email.trim()) errors.email = "Email address is required.";
    if (!formData.sex) errors.sex = "Please select your sex.";
    if (!formData.ageBracket) errors.ageBracket = "Please select your age bracket.";
    if (!formData.categoryOfInterest)
      errors.categoryOfInterest = "Please select your category of interest.";
    if (!formData.suggestions.trim())
      errors.suggestions = "Please share suggestions for future projects.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setServerError(
          data.error ||
            "Failed to complete registration. Please check your information and try again."
        );
        return;
      }

      // Success
      onSuccess(formData);
    } catch (err) {
      console.error("Submission error:", err);
      setServerError(
        "Network connection error. Could not connect to registration server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs space-y-8">
        {/* Header & Verified Code Banner */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-purple-950/5 border border-purple-950/15">
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-full bg-purple-950 text-white flex items-center justify-center">
                <CheckCircle size={16} weight="fill" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-950">
                  Verified Registration Code
                </p>
                <p className="font-mono text-base font-bold text-purple-950">
                  {code}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onChangeCode}
              className="text-xs text-zinc-600 hover:text-purple-950 underline self-start sm:self-center"
            >
              Change code
            </button>
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
              Complete Your Registration
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1">
              Please fill out all required fields carefully to finalize your seat.
            </p>
          </div>
        </div>

        {/* Global Server Error Banner */}
        {serverError && (
          <div className="p-4 rounded-xl bg-purple-950/5 border border-purple-950/20 flex items-start gap-3 text-xs sm:text-sm text-purple-950">
            <WarningCircle size={20} weight="fill" className="shrink-0 text-purple-950 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to register</p>
              <p className="mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
            >
              Full Name <span className="text-purple-950">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Chinelo Okonkwo"
              className={`w-full px-4 py-3 rounded-xl border ${
                fieldErrors.name ? "border-purple-950" : "border-zinc-300"
              } focus:border-purple-950 focus:ring-2 focus:ring-purple-950/20 text-sm sm:text-base outline-hidden transition-all`}
            />
            {fieldErrors.name && (
              <p className="text-xs text-purple-950 font-medium mt-1">
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* 2. Grid: State of Origin & Denomination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label
                htmlFor="stateOfOrigin"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
              >
                State of Origin <span className="text-purple-950">*</span>
              </label>
              <input
                id="stateOfOrigin"
                name="stateOfOrigin"
                type="text"
                required
                value={formData.stateOfOrigin}
                onChange={handleChange}
                placeholder="e.g. Enugu"
                className={`w-full px-4 py-3 rounded-xl border ${
                  fieldErrors.stateOfOrigin ? "border-purple-950" : "border-zinc-300"
                } focus:border-purple-950 focus:ring-2 focus:ring-purple-950/20 text-sm sm:text-base outline-hidden transition-all`}
              />
              {fieldErrors.stateOfOrigin && (
                <p className="text-xs text-purple-950 font-medium mt-1">
                  {fieldErrors.stateOfOrigin}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="denomination"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
              >
                Denomination <span className="text-purple-950">*</span>
              </label>
              <input
                id="denomination"
                name="denomination"
                type="text"
                required
                value={formData.denomination}
                onChange={handleChange}
                placeholder="e.g. Anglican / Catholic / Pentecostal"
                className={`w-full px-4 py-3 rounded-xl border ${
                  fieldErrors.denomination ? "border-purple-950" : "border-zinc-300"
                } focus:border-purple-950 focus:ring-2 focus:ring-purple-950/20 text-sm sm:text-base outline-hidden transition-all`}
              />
              {fieldErrors.denomination && (
                <p className="text-xs text-purple-950 font-medium mt-1">
                  {fieldErrors.denomination}
                </p>
              )}
            </div>
          </div>

          {/* 3. Address (Textarea) */}
          <div className="space-y-1.5">
            <label
              htmlFor="address"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
            >
              Address <span className="text-purple-950">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows={2}
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Your residential address or location..."
              className={`w-full px-4 py-3 rounded-xl border ${
                fieldErrors.address ? "border-purple-950" : "border-zinc-300"
              } focus:border-purple-950 focus:ring-2 focus:ring-purple-950/20 text-sm sm:text-base outline-hidden transition-all resize-y`}
            />
            {fieldErrors.address && (
              <p className="text-xs text-purple-950 font-medium mt-1">
                {fieldErrors.address}
              </p>
            )}
          </div>

          {/* 4. Grid: Contact Number & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
              >
                Contact Number <span className="text-purple-950">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 08012345678"
                className={`w-full px-4 py-3 rounded-xl border ${
                  fieldErrors.phone ? "border-purple-950" : "border-zinc-300"
                } focus:border-purple-950 focus:ring-2 focus:ring-purple-950/20 text-sm sm:text-base outline-hidden transition-all`}
              />
              {fieldErrors.phone && (
                <p className="text-xs text-purple-950 font-medium mt-1">
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
              >
                Email Address <span className="text-purple-950">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. name@example.com"
                className={`w-full px-4 py-3 rounded-xl border ${
                  fieldErrors.email ? "border-purple-950" : "border-zinc-300"
                } focus:border-purple-950 focus:ring-2 focus:ring-purple-950/20 text-sm sm:text-base outline-hidden transition-all`}
              />
              {fieldErrors.email && (
                <p className="text-xs text-purple-950 font-medium mt-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* 5. Grid: Sex & Age Bracket */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label
                htmlFor="sex"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
              >
                Sex <span className="text-purple-950">*</span>
              </label>
              <select
                id="sex"
                name="sex"
                required
                value={formData.sex}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  fieldErrors.sex ? "border-purple-950" : "border-zinc-300"
                } focus:border-purple-950 focus:ring-2 focus:ring-purple-950/20 text-sm sm:text-base bg-white outline-hidden transition-all`}
              >
                <option value="">Select sex</option>
                {eventConfig.formOptions.sex.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {fieldErrors.sex && (
                <p className="text-xs text-purple-950 font-medium mt-1">
                  {fieldErrors.sex}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="ageBracket"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
              >
                Age Bracket <span className="text-purple-950">*</span>
              </label>
              <select
                id="ageBracket"
                name="ageBracket"
                required
                value={formData.ageBracket}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  fieldErrors.ageBracket ? "border-purple-950" : "border-zinc-300"
                } focus:border-purple-950 focus:ring-2 focus:ring-purple-950/20 text-sm sm:text-base bg-white outline-hidden transition-all`}
              >
                <option value="">Select age bracket</option>
                {eventConfig.formOptions.ageBracket.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {fieldErrors.ageBracket && (
                <p className="text-xs text-purple-950 font-medium mt-1">
                  {fieldErrors.ageBracket}
                </p>
              )}
            </div>
          </div>

          {/* 6. Category of Interest */}
          <div className="space-y-1.5">
            <label
              htmlFor="categoryOfInterest"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
            >
              Category of Interest <span className="text-purple-950">*</span>
            </label>
            <p className="text-xs text-zinc-600 mb-1">
              Kindly select the category or track that most aligns with your goals
            </p>
            <select
              id="categoryOfInterest"
              name="categoryOfInterest"
              required
              value={formData.categoryOfInterest}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                fieldErrors.categoryOfInterest ? "border-purple-950" : "border-zinc-300"
              } focus:border-purple-950 focus:ring-2 focus:ring-purple-950/20 text-sm sm:text-base bg-white outline-hidden transition-all`}
            >
              <option value="">Select category of interest</option>
              {eventConfig.formOptions.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {fieldErrors.categoryOfInterest && (
              <p className="text-xs text-purple-950 font-medium mt-1">
                {fieldErrors.categoryOfInterest}
              </p>
            )}
          </div>

          {/* 7. Suggestions for Future Projects */}
          <div className="space-y-1.5">
            <label
              htmlFor="suggestions"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
            >
              Suggestions for Future Projects <span className="text-purple-950">*</span>
            </label>
            <textarea
              id="suggestions"
              name="suggestions"
              rows={3}
              required
              value={formData.suggestions}
              onChange={handleChange}
              placeholder="What topics, programs, or workshops would you love to see in the future?"
              className={`w-full px-4 py-3 rounded-xl border ${
                fieldErrors.suggestions ? "border-purple-950" : "border-zinc-300"
              } focus:border-purple-950 focus:ring-2 focus:ring-purple-950/20 text-sm sm:text-base outline-hidden transition-all resize-y`}
            />
            {fieldErrors.suggestions && (
              <p className="text-xs text-purple-950 font-medium mt-1">
                {fieldErrors.suggestions}
              </p>
            )}
          </div>

          {/* 8. Contact for future events (Radio) */}
          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Would you like to be contacted for future events or competitions?{" "}
              <span className="text-purple-950">*</span>
            </label>
            <div className="flex flex-wrap gap-4 sm:gap-6 pt-1">
              {eventConfig.formOptions.contactFuture.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-800"
                >
                  <input
                    type="radio"
                    name="contactFuture"
                    value={option}
                    checked={formData.contactFuture === option}
                    onChange={handleChange}
                    className="size-4 accent-purple-950"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submission Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-8 rounded-full bg-purple-950 hover:bg-purple-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <CircleNotch size={20} className="animate-spin" />
                  <span>Submitting registration...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight size={18} weight="bold" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-zinc-600 mt-3">
              By registering, you confirm that your details are accurate.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
