"use client";
import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import {
  ShieldCheck,
  Mail,
  Lock,
  Hash,
  KeyRound,
  Link2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

type Mode = "password" | "link" | "nafad";

const TABS: { id: Mode; label: string; icon: React.ReactNode }[] = [
  { id: "password", label: "كلمة المرور", icon: <KeyRound className="w-3.5 h-3.5" /> },
  { id: "link", label: "رابط البريد", icon: <Link2 className="w-3.5 h-3.5" /> },
  { id: "nafad", label: "نفاذ", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authNumber, setAuthNumber] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("password");
  const navigate = useRouter();

  const resetMessages = () => { setError(""); setMessage(""); };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault(); resetMessages(); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate.push("/");
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally { setLoading(false); }
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault(); resetMessages(); setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, { url: window.location.href, handleCodeInApp: true });
      window.localStorage.setItem("emailForSignIn", email);
      setMessage("تم إرسال رابط تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني.");
    } catch {
      setError("حدث خطأ أثناء إرسال الرابط. يرجى المحاولة لاحقاً.");
    } finally { setLoading(false); }
  };

  const handleNafadLogin = async (e: React.FormEvent) => {
    e.preventDefault(); resetMessages(); setLoading(true);
    try {
      setMessage("جاري التحقق من رقم الاستيثاق...");
    } catch {
      setError("حدث خطأ أثناء التحقق من رقم الاستيثاق.");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailToUse = window.localStorage.getItem("emailForSignIn");
      if (!emailToUse) emailToUse = window.prompt("يرجى إدخال بريدك الإلكتروني للتأكيد:");
      if (emailToUse) {
        setLoading(true);
        signInWithEmailLink(auth, emailToUse, window.location.href)
          .then(() => { window.localStorage.removeItem("emailForSignIn"); navigate.push("/"); })
          .catch(() => { setError("رابط تسجيل الدخول غير صالح أو منتهي الصلاحية."); setLoading(false); });
      }
    }
  }, [navigate]);

  const getErrorMessage = (code: string) => {
    const m: Record<string, string> = {
      "auth/invalid-credential": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      "auth/user-not-found": "المستخدم غير موجود",
      "auth/wrong-password": "كلمة المرور غير صحيحة",
      "auth/too-many-requests": "تم تجاوز عدد المحاولات. يرجى المحاولة لاحقاً",
    };
    return m[code] ?? "حدث خطأ أثناء تسجيل الدخول";
  };

  const formHandler = mode === "password" ? handlePasswordLogin : mode === "link" ? handleSendLink : handleNafadLogin;
  const submitLabel = mode === "password" ? "تسجيل الدخول" : mode === "link" ? "إرسال رابط الدخول" : "الدخول عبر نفاذ";

  return (
    <div className="min-h-screen flex items-center justify-center font-sans overflow-hidden relative" dir="rtl"
      style={{ background: "linear-gradient(135deg, #060918 0%, #0d1535 40%, #0a1628 70%, #060c1a 100%)" }}>

      {/* Ambient orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-15%] left-[-8%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)" }} />
      <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)" }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[460px] mx-4">

        {/* Glow behind card */}
        <div className="absolute -inset-px rounded-3xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.2), transparent 60%)", filter: "blur(1px)" }} />

        <div className="relative rounded-3xl overflow-hidden"
          style={{ background: "rgba(13,20,44,0.85)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(24px)" }}>

          {/* Top accent bar */}
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(59,130,246,0.8), transparent)" }} />

          <div className="p-8 sm:p-10">

            {/* Logo */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-2xl blur-xl opacity-60"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }} />
                <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 8px 32px rgba(99,102,241,0.4)" }}>
                  <ShieldCheck className="w-8 h-8 text-white" strokeWidth={1.8} />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">مرحباً بعودتك</h1>
              <p className="text-sm" style={{ color: "rgba(148,163,184,0.9)" }}>
                سجّل دخولك للوصول إلى لوحة التحكم
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-8 p-1 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {TABS.map((tab) => (
                <button key={tab.id} type="button"
                  onClick={() => { setMode(tab.id); resetMessages(); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300"
                  style={mode === tab.id ? {
                    background: "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.2))",
                    color: "#93c5fd",
                    border: "1px solid rgba(99,102,241,0.35)",
                    boxShadow: "0 2px 12px rgba(99,102,241,0.15)"
                  } : {
                    color: "rgba(148,163,184,0.7)",
                    border: "1px solid transparent"
                  }}>
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={formHandler} className="space-y-4">

              {mode !== "nafad" && (
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-semibold tracking-wide uppercase"
                    style={{ color: "rgba(148,163,184,0.7)" }}>
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(99,102,241,0.7)" }} />
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      required disabled={loading} placeholder="admin@example.com"
                      className="w-full pr-10 pl-4 py-3.5 text-sm rounded-xl outline-none transition-all duration-200 disabled:opacity-50"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#e2e8f0",
                        caretColor: "#6366f1",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.background = "rgba(99,102,241,0.08)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                    />
                  </div>
                </div>
              )}

              {mode === "password" && (
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold tracking-wide uppercase"
                    style={{ color: "rgba(148,163,184,0.7)" }}>
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(99,102,241,0.7)" }} />
                    <input id="password" type={showPassword ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)} required disabled={loading} placeholder="••••••••"
                      className="w-full pr-10 pl-10 py-3.5 text-sm rounded-xl outline-none transition-all duration-200 disabled:opacity-50"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#e2e8f0",
                        caretColor: "#6366f1",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.background = "rgba(99,102,241,0.08)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: "rgba(148,163,184,0.5)" }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="authNumber" className="block text-xs font-semibold tracking-wide uppercase"
                  style={{ color: "rgba(148,163,184,0.7)" }}>
                  رقم الاستيثاق (نفاذ)
                </label>
                <div className="relative">
                  <Hash className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(99,102,241,0.7)" }} />
                  <input id="authNumber" type="text" value={authNumber}
                    onChange={(e) => setAuthNumber(e.target.value)} required disabled={loading}
                    placeholder="أدخل رقم الاستيثاق"
                    className="w-full pr-10 pl-4 py-3.5 text-sm rounded-xl outline-none transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#e2e8f0",
                      caretColor: "#6366f1",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.background = "rgba(99,102,241,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: "rgba(148,163,184,0.45)" }}>
                  أدخل رقم الاستيثاق الخاص بحسابك في منصة نفاذ
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm"
                  style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac" }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{message}</span>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.4), 0 1px 0 rgba(255,255,255,0.1) inset"
                }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)" }} />
                {loading ? (
                  <span className="relative flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري المعالجة...
                  </span>
                ) : (
                  <span className="relative flex items-center gap-2">
                    {submitLabel}
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  </span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-xs" style={{ color: "rgba(100,116,139,0.7)" }}>
                © 2026 BCare — جميع الحقوق محفوظة
              </p>
            </div>
          </div>

          {/* Bottom accent bar */}
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)" }} />
        </div>
      </div>
    </div>
  );
}
