import { NextRequest, NextResponse } from "next/server";
import { validateCodeFormat } from "@/lib/validation";
import { verifyRegistrationCode } from "@/lib/googleSheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    const validation = validateCodeFormat(code);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          valid: false,
          status: "invalid",
          message: validation.error || "Please enter a valid registration code.",
        },
        { status: 400 }
      );
    }

    const result = await verifyRegistrationCode(validation.sanitized);

    if (!result.valid) {
      return NextResponse.json(
        {
          valid: false,
          status: result.status,
          message: result.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        status: "available",
        code: validation.sanitized,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("API /api/verify-code error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to verify registration code. Please try again.";
    return NextResponse.json(
      {
        valid: false,
        status: "error",
        message,
      },
      { status: 500 }
    );
  }
}
