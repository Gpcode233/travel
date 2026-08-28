import { google } from "googleapis";
import { RegistrationFormData } from "./validation";
import fs from "fs";
import path from "path";

// Types
export type CodeStatus = "Available" | "Used" | "Invalid" | "NotFound";

export interface CodeRecord {
  code: string;
  status: "Available" | "Used";
  issuedDate: string;
  usedDate?: string;
  rowIndex?: number;
}

export interface VerificationResult {
  valid: boolean;
  status: "available" | "used" | "invalid";
  message: string;
  issuedDate?: string;
}

// Fallback in-memory/file storage for local development testing when Google credentials are not set
const MOCK_STORAGE_FILE = path.join(process.cwd(), ".mock_sheets_data.json");

interface MockStoreData {
  codes: CodeRecord[];
  registrations: (RegistrationFormData & { registrationDate: string })[];
}

const DEFAULT_MOCK_DATA: MockStoreData = {
  codes: [
    {
      code: "YIP-847291",
      status: "Available",
      issuedDate: "2026-08-28",
    },
    {
      code: "YIP-492817",
      status: "Available",
      issuedDate: "2026-08-28",
    },
    {
      code: "YIP-773912",
      status: "Available",
      issuedDate: "2026-08-28",
    },
    {
      code: "YIP-183920",
      status: "Used",
      issuedDate: "2026-08-27",
      usedDate: "2026-08-28",
    },
  ],
  registrations: [],
};

function getMockStore(): MockStoreData {
  try {
    if (fs.existsSync(MOCK_STORAGE_FILE)) {
      const data = fs.readFileSync(MOCK_STORAGE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // fallback
  }
  return DEFAULT_MOCK_DATA;
}

function saveMockStore(data: MockStoreData): void {
  try {
    fs.writeFileSync(MOCK_STORAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write mock storage file:", err);
  }
}

/**
 * Initializes Google Sheets API client if credentials exist.
 */
function getGoogleSheetsClient() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !clientEmail || !privateKey) {
    return null;
  }

  // Handle both literal newlines and escaped "\n" in environment variables
  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  // Clean quotes if wrapped
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  return { sheets, sheetId };
}

/**
 * Ensures header rows exist on Sheet 1 (Codes) and Sheet 2 (Registrations)
 */
export async function ensureSheetHeaders(): Promise<void> {
  const client = getGoogleSheetsClient();
  if (!client) return;

  const { sheets, sheetId } = client;

  try {
    // Check Codes sheet headers
    const codesCheck = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Codes!A1:D1",
    });

    if (!codesCheck.data.values || codesCheck.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: "Codes!A1:D1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [["Registration Code", "Status", "Issued Date", "Used Date"]],
        },
      });
    }

    // Check Registrations sheet headers
    const regsCheck = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Registrations!A1:M1",
    });

    if (!regsCheck.data.values || regsCheck.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: "Registrations!A1:M1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              "Registration Code",
              "Full Name",
              "State of Origin",
              "Denomination",
              "Address",
              "Contact Number",
              "Email",
              "Sex",
              "Age Bracket",
              "Category of Interest",
              "Future Suggestions",
              "Contact For Future",
              "Registration Date",
            ],
          ],
        },
      });
    }
  } catch (err) {
    console.warn("Could not verify or create sheet headers:", err);
  }
}

/**
 * Verifies a registration code against Google Sheets (or dev mock store).
 */
export async function verifyRegistrationCode(code: string): Promise<VerificationResult> {
  const normalizedCode = code.trim().toUpperCase();
  const client = getGoogleSheetsClient();

  if (!client) {
    // Development / Mock fallback mode
    const store = getMockStore();
    const found = store.codes.find(
      (c) => c.code.toUpperCase() === normalizedCode
    );

    if (!found) {
      return {
        valid: false,
        status: "invalid",
        message:
          "This registration code is invalid. Please check the code sent to you by the organizer on WhatsApp.",
      };
    }

    if (found.status === "Used") {
      return {
        valid: false,
        status: "used",
        message:
          "This registration code has already been used. Please contact the organizer if you believe this is an error.",
      };
    }

    return {
      valid: true,
      status: "available",
      message: "Registration code verified successfully.",
      issuedDate: found.issuedDate,
    };
  }

  // Real Google Sheets API mode
  try {
    const { sheets, sheetId } = client;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Codes!A2:D",
    });

    const rows = response.data.values || [];
    let foundRowIndex = -1;
    let foundStatus: "Available" | "Used" | "" = "";
    let issuedDate = "";

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowCode = (row[0] || "").trim().toUpperCase();
      if (rowCode === normalizedCode) {
        foundRowIndex = i + 2; // Row number in sheet (1-based, accounts for header)
        foundStatus = (row[1] || "").trim() as "Available" | "Used";
        issuedDate = row[2] || "";
        break;
      }
    }

    if (foundRowIndex === -1) {
      return {
        valid: false,
        status: "invalid",
        message:
          "This registration code is invalid. Please check the code sent to you by the organizer on WhatsApp.",
      };
    }

    if (foundStatus === "Used") {
      return {
        valid: false,
        status: "used",
        message:
          "This registration code has already been used. Please contact the organizer if you believe this is an error.",
      };
    }

    return {
      valid: true,
      status: "available",
      message: "Registration code verified successfully.",
      issuedDate,
    };
  } catch (error) {
    console.error("Google Sheets verify error:", error);
    throw new Error("Unable to verify registration code with database. Please try again.");
  }
}

/**
 * Registers participant and marks the code as Used in Google Sheets.
 */
export async function submitRegistrationToSheet(
  data: RegistrationFormData
): Promise<{ success: boolean; error?: string }> {
  const normalizedCode = data.registrationCode.trim().toUpperCase();
  const registrationDate = new Date().toISOString().replace("T", " ").substring(0, 19);

  const client = getGoogleSheetsClient();

  if (!client) {
    // Development Mock Mode
    const store = getMockStore();
    const codeIdx = store.codes.findIndex(
      (c) => c.code.toUpperCase() === normalizedCode
    );

    if (codeIdx === -1) {
      return {
        success: false,
        error: "Invalid registration code. Could not complete registration.",
      };
    }

    if (store.codes[codeIdx].status === "Used") {
      return {
        success: false,
        error: "This registration code has already been used.",
      };
    }

    // Mark code as used
    store.codes[codeIdx].status = "Used";
    store.codes[codeIdx].usedDate = registrationDate;

    // Append registration
    store.registrations.push({
      ...data,
      registrationCode: normalizedCode,
      registrationDate,
    });

    saveMockStore(store);

    return { success: true };
  }

  // Real Google Sheets Mode
  try {
    const { sheets, sheetId } = client;

    // Step 1: Double-check the code is still available
    const codesRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Codes!A2:D",
    });

    const rows = codesRes.data.values || [];
    let foundRowIndex = -1;
    let foundStatus = "";

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowCode = (row[0] || "").trim().toUpperCase();
      if (rowCode === normalizedCode) {
        foundRowIndex = i + 2;
        foundStatus = (row[1] || "").trim();
        break;
      }
    }

    if (foundRowIndex === -1) {
      return {
        success: false,
        error: "This registration code is invalid.",
      };
    }

    if (foundStatus === "Used") {
      return {
        success: false,
        error: "This registration code has already been used.",
      };
    }

    // Step 2: Append row to Registrations sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Registrations!A:M",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            normalizedCode,
            data.name.trim(),
            data.stateOfOrigin.trim(),
            data.denomination.trim(),
            data.address.trim(),
            data.phone.trim(),
            data.email.trim(),
            data.sex,
            data.ageBracket,
            data.categoryOfInterest,
            data.suggestions.trim(),
            data.contactFuture,
            registrationDate,
          ],
        ],
      },
    });

    // Step 3: Update Code status to Used and set Used Date
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Codes!B${foundRowIndex}:D${foundRowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["Used", rows[foundRowIndex - 2][2] || "", registrationDate]],
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Google Sheets submitRegistration error:", error);
    return {
      success: false,
      error: "Failed to save registration to Google Sheets. Please contact support.",
    };
  }
}
