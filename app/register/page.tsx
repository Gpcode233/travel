"use client";

import { useState } from "react";
import CodeVerification from "@/components/CodeVerification";
import RegistrationForm from "@/components/RegistrationForm";
import SuccessState from "@/components/SuccessState";
import ProgressIndicator from "@/components/ProgressIndicator";
import { RegistrationFormData } from "@/lib/validation";

type RegistrationStep = "verify" | "form" | "success";

export default function RegisterPage() {
  const [step, setStep] = useState<RegistrationStep>("verify");
  const [verifiedCode, setVerifiedCode] = useState<string>("");
  const [registrationResult, setRegistrationResult] =
    useState<RegistrationFormData | null>(null);

  const handleCodeVerified = (code: string) => {
    setVerifiedCode(code);
    setStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegistrationSuccess = (data: RegistrationFormData) => {
    setRegistrationResult(data);
    setStep("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetCode = () => {
    setVerifiedCode("");
    setStep("verify");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Step Progress Indicator */}
        {step === "verify" && <ProgressIndicator currentStep={4} />}
        {step === "form" && <ProgressIndicator currentStep={5} />}
        {step === "success" && <ProgressIndicator currentStep={5} />}

        {/* View 1: Code Verification */}
        {step === "verify" && (
          <CodeVerification onVerified={handleCodeVerified} />
        )}

        {/* View 2: Registration Form */}
        {step === "form" && verifiedCode && (
          <RegistrationForm
            code={verifiedCode}
            onSuccess={handleRegistrationSuccess}
            onChangeCode={handleResetCode}
          />
        )}

        {/* View 3: Registration Success */}
        {step === "success" && registrationResult && (
          <SuccessState data={registrationResult} />
        )}
      </div>
    </main>
  );
}
