import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_KEY = "f77afb43e0msheb70fc4632463cdp1f4d0ajsn5043ed213d3a";
const RAPIDAPI_HOST = "bin-ip-checker.p.rapidapi.com";

export async function GET(request: NextRequest) {
  const bin = request.nextUrl.searchParams.get("bin");

  if (!bin || bin.replace(/\s/g, "").length < 6) {
    return NextResponse.json({ error: "BIN يجب أن يكون 6 أرقام على الأقل" }, { status: 400 });
  }

  const cleanBin = bin.replace(/\D/g, "").slice(0, 6);

  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/?bin=${cleanBin}`,
      {
        method: "POST",
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": RAPIDAPI_HOST,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bin: cleanBin }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "فشل الاستعلام عن BIN" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "خطأ في الاتصال بخدمة BIN" }, { status: 500 });
  }
}
