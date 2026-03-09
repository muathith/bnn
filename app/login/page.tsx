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
  ArrowLeft,
  Hash,
  KeyRound,
  Link2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

type Mode = "password" | "link" | "nafad";

const TABS: { id: Mode; label: string; icon: React.ReactNode }[] = [
  { id: "password", label: "كلمة المرور", icon: <KeyRound className="w-4 h-4" /> },
  { id: "link", label: "رابط البريد", icon: <Link2 className="w-4 h-4" /> },
  { id: "nafad", label: "نفاذ", icon: <ShieldCheck className="w-4 h-4" /> },
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
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate.push("/");
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: window.location.href,
        handleCodeInApp: true,
      });
      window.localStorage.setItem("emailForSignIn", email);
      setMessage("تم إرسال رابط تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني.");
    } catch {
      setError("حدث خطأ أثناء إرسال الرابط. يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  const handleNafadLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      setMessage("جاري التحقق من رقم الاستيثاق...");
    } catch {
      setError("حدث خطأ أثناء التحقق من رقم الاستيثاق.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailToUse = window.localStorage.getItem("emailForSignIn");
      if (!emailToUse) {
        emailToUse = window.prompt("يرجى إدخال بريدك الإلكتروني للتأكيد:");
      }
      if (emailToUse) {
        setLoading(true);
        signInWithEmailLink(auth, emailToUse, window.location.href)
          .then(() => {
            window.localStorage.removeItem("emailForSignIn");
            navigate.push("/");
          })
          .catch(() => {
            setError("رابط تسجيل الدخول غير صالح أو منتهي الصلاحية.");
            setLoading(false);
          });
      }
    }
  }, [navigate]);

  const getErrorMessage = (code: string) => {
    const messages: Record<string, string> = {
      "auth/invalid-credential": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      "auth/user-not-found": "المستخدم غير موجود",
      "auth/wrong-password": "كلمة المرور غير صحيحة",
      "auth/too-many-requests": "تم تجاوز عدد المحاولات. يرجى المحاولة لاحقاً",
    };
    return messages[code] ?? "حدث خطأ أثناء تسجيل الدخول";
  };

  const formHandler =
    mode === "password"
      ? handlePasswordLogin
      : mode === "link"
      ? handleSendLink
      : handleNafadLogin;

  const submitLabel =
    mode === "password"
      ? "تسجيل الدخول"
      : mode === "link"
      ? "إرسال رابط الدخول"
      : "تسجيل الدخول عبر نفاذ";

  return (
    <div className="min-h-screen flex font-sans" dir="rtl">

      {/* ── Branding Panel ── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between bg-[#0f172a] p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-indigo-800/30 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-wide">BCare</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              لوحة إدارة
              <br />
              <span className="text-blue-400">متكاملة وآمنة</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              منصة إدارة الزوار في الوقت الفعلي مع تحليلات متقدمة وأدوات متابعة احترافية.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "متابعة الزوار في الوقت الفعلي",
              "تقارير وإحصاءات تفصيلية",
              "نظام إشعارات فوري",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-600 text-xs">© 2026 BCare — جميع الحقوق محفوظة</p>
        </div>
      </div>

      {/* ── Form Panel ── */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-6 sm:p-10">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-10">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">BCare</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">مرحباً بعودتك</h1>
            <p className="text-slate-500 text-sm">سجّل دخولك للوصول إلى لوحة التحكم</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setMode(tab.id); resetMessages(); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  mode === tab.id
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={formHandler} className="space-y-4">

            {/* Email */}
            {mode !== "nafad" && (
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="admin@example.com"
                    className="w-full pr-10 pl-4 py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all disabled:opacity-60"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            {mode === "password" && (
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="••••••••"
                    className="w-full pr-10 pl-10 py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Auth Number (Nafad) */}
            {mode === "nafad" && (
              <div className="space-y-1.5">
                <label htmlFor="authNumber" className="block text-sm font-medium text-slate-700">
                  رقم الاستيثاق
                </label>
                <div className="relative">
                  <Hash className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="authNumber"
                    type="text"
                    value={authNumber}
                    onChange={(e) => setAuthNumber(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="أدخل رقم الاستيثاق"
                    className="w-full pr-10 pl-4 py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all disabled:opacity-60"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  أدخل رقم الاستيثاق الخاص بحسابك في نفاذ
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed group text-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>جاري المعالجة...</span>
                </>
              ) : (
                <>
                  <span>{submitLabel}</span>
                  <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            © 2026 BCare — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}
