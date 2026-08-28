export interface RegistrationFormData {
  registrationCode: string;
  name: string;
  stateOfOrigin: string;
  denomination: string;
  address: string;
  phone: string;
  email: string;
  sex: string;
  ageBracket: string;
  categoryOfInterest: string;
  suggestions: string;
  contactFuture: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function sanitizeInput(value: string | undefined | null): string {
  if (!value) return "";
  return value.trim();
}

export function normalizeCode(code: string | undefined | null): string {
  if (!code) return "";
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export function validateCodeFormat(code: string | undefined | null): {
  isValid: boolean;
  error?: string;
  sanitized: string;
} {
  const sanitized = normalizeCode(code);
  if (!sanitized) {
    return { isValid: false, error: "Please enter a registration code.", sanitized: "" };
  }
  if (sanitized.length < 4 || sanitized.length > 20) {
    return {
      isValid: false,
      error: "Invalid code length. Codes are usually formatted like YIP-847291.",
      sanitized,
    };
  }
  return { isValid: true, sanitized };
}

export function validateRegistrationData(
  data: Partial<RegistrationFormData>
): ValidationResult {
  const errors: Record<string, string> = {};

  const code = normalizeCode(data.registrationCode);
  if (!code) {
    errors.registrationCode = "Registration code is required.";
  }

  const name = sanitizeInput(data.name);
  if (!name) {
    errors.name = "Full name is required.";
  } else if (name.length < 2) {
    errors.name = "Full name must be at least 2 characters.";
  }

  const stateOfOrigin = sanitizeInput(data.stateOfOrigin);
  if (!stateOfOrigin) {
    errors.stateOfOrigin = "State of origin is required.";
  }

  const denomination = sanitizeInput(data.denomination);
  if (!denomination) {
    errors.denomination = "Denomination is required.";
  }

  const address = sanitizeInput(data.address);
  if (!address) {
    errors.address = "Address is required.";
  }

  const phone = sanitizeInput(data.phone);
  if (!phone) {
    errors.phone = "Contact phone number is required.";
  } else if (!/^[0-9+\s\-()]{7,20}$/.test(phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  const email = sanitizeInput(data.email);
  if (!email) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const sex = sanitizeInput(data.sex);
  if (!sex) {
    errors.sex = "Please select your sex.";
  } else if (!["Male", "Female"].includes(sex)) {
    errors.sex = "Please select a valid option (Male or Female).";
  }

  const ageBracket = sanitizeInput(data.ageBracket);
  if (!ageBracket) {
    errors.ageBracket = "Please select your age bracket.";
  }

  const categoryOfInterest = sanitizeInput(data.categoryOfInterest);
  if (!categoryOfInterest) {
    errors.categoryOfInterest = "Please select your category of interest.";
  }

  const suggestions = sanitizeInput(data.suggestions);
  if (!suggestions) {
    errors.suggestions = "Please share suggestions for future projects.";
  }

  const contactFuture = sanitizeInput(data.contactFuture);
  if (!contactFuture) {
    errors.contactFuture = "Please indicate if you'd like to be contacted for future events.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
