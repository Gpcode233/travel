import { NextRequest, NextResponse } from "next/server";
import { validateRegistrationData } from "@/lib/validation";
import {
  verifyRegistrationCode,
  submitRegistrationToSheet,
} from "@/lib/googleSheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate payload format
    const validation = validateRegistrationData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please check all fields.",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const code = body.registrationCode.trim().toUpperCase();

    // 2. Server-side code check
    const codeVerification = await verifyRegistrationCode(code);
    if (!codeVerification.valid) {
      return NextResponse.json(
        {
          success: false,
          error: codeVerification.message,
        },
        { status: 400 }
      );
    }

    // 3. Save to Google Sheets and mark code as used
    const result = await submitRegistrationToSheet({
      registrationCode: code,
      name: body.name.trim(),
      stateOfOrigin: body.stateOfOrigin.trim(),
      denomination: body.denomination.trim(),
      address: body.address.trim(),
      phone: body.phone.trim(),
      email: body.email.trim().toLowerCase(),
      sex: body.sex,
      ageBracket: body.ageBracket,
      categoryOfInterest: body.categoryOfInterest,
      suggestions: body.suggestions.trim(),
      contactFuture: body.contactFuture,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to complete registration.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        registrationCode: code,
        message: "Registration completed successfully.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("API /api/register error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during registration. Please try again.";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
