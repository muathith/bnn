"use client";

import { useEffect, useState } from "react";

interface BinData {
  valid: boolean;
  number: number;
  scheme: string;
  brand: string;
  type: string;
  level: string;
  currency: string;
  issuer: {
    name: string;
    website?: string;
    phone?: string;
  };
  country: {
    country: string;
    alpha2: string;
    language: string;
  };
}

interface BinInfoProps {
  cardNumber: string;
}

const SCHEME_COLORS: Record<string, string> = {
  VISA: "bg-blue-100 text-blue-800 border-blue-200",
  MASTERCARD: "bg-red-100 text-red-800 border-red-200",
  AMEX: "bg-green-100 text-green-800 border-green-200",
  MADA: "bg-purple-100 text-purple-800 border-purple-200",
};

const TYPE_COLORS: Record<string, string> = {
  CREDIT: "bg-amber-100 text-amber-700",
  DEBIT: "bg-emerald-100 text-emerald-700",
  PREPAID: "bg-slate-100 text-slate-700",
};

export function BinInfo({ cardNumber }: BinInfoProps) {
  const [data, setData] = useState<BinData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bin = cardNumber?.replace(/\D/g, "").slice(0, 6);

  useEffect(() => {
    if (!bin || bin.length < 6) return;

    setLoading(true);
    setError("");

    fetch(`/api/bin?bin=${bin}`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.BIN?.valid) {
          setData(json.BIN);
        } else {
          setError("تعذّر التحقق من BIN");
        }
      })
      .catch(() => setError("خطأ في الاتصال"))
      .finally(() => setLoading(false));
  }, [bin]);

  if (!bin || bin.length < 6) return null;

  if (loading) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-500">
        <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        جاري التحقق من BIN...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-500">
        ⚠ {error}
      </div>
    );
  }

  if (!data) return null;

  const schemeColor = SCHEME_COLORS[data.scheme] || "bg-gray-100 text-gray-700 border-gray-200";
  const typeColor = TYPE_COLORS[data.type] || "bg-gray-100 text-gray-700";

  return (
    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-blue-100 bg-blue-50">
        <span className="text-xs font-bold text-blue-800">معلومات BIN</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${schemeColor}`}>
            {data.scheme}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColor}`}>
            {data.type === "CREDIT" ? "ائتماني" : data.type === "DEBIT" ? "مدين" : data.type}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2 space-y-1.5 text-xs">
        <Row label="البنك" value={data.issuer?.name} />
        <Row label="المستوى" value={data.level} />
        <Row label="العملة" value={data.currency} />
        <Row label="الدولة" value={`${data.country?.country} (${data.country?.alpha2})`} />
        {data.issuer?.phone && <Row label="هاتف البنك" value={data.issuer.phone} />}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-gray-500 shrink-0">{label}:</span>
      <span className="text-gray-800 font-medium text-left break-all">{value}</span>
    </div>
  );
}
