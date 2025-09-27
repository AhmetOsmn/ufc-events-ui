import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  MdCalendarToday,
  MdCheck,
  MdClose,
  MdEmail,
  MdWarning,
} from "react-icons/md";
import { z } from "zod";
import { addEventToCalendar } from "../api/services";

const emailSchema = z.email({ error: "Geçerli bir e-mail adresi girin" });

function Header() {
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  // Email gönderme mutation'ı
  const emailMutation = useMutation({
    mutationFn: (emailData: { email: string }) => addEventToCalendar(emailData),
    onSuccess: () => {
      setShowModal(true);
      setEmail(""); // Email'i temizle
      setEmailError(""); // Hataları temizle
    },
    onError: (error) => {
      console.error("Email gönderme hatası:", error);
      setApiErrorMessage(
        error.message ||
          "E-mail gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
      setShowErrorModal(true);
      // Input seviyesindeki hataları da temizle
      setEmailError("");
    },
    // Duplicate request'leri önle
    retry: false,
    // Aynı anda sadece 1 istek olabilir
    networkMode: "always",
  });

  const handleCalendarClick = () => {
    // Eğer zaten istek gönderiliyorsa, tekrar gönderme
    if (emailMutation.isPending) {
      return;
    }

    // Email validasyonu
    const emailValidation = emailSchema.safeParse(email);

    if (!emailValidation.success) {
      const errorMessage =
        emailValidation.error.issues[0]?.message ||
        "Geçerli bir e-mail adresi girin";
      setEmailError(errorMessage);
      return;
    }

    // Validasyon başarılı, hatayı temizle ve API isteği gönder
    setEmailError("");
    setApiErrorMessage(""); // API hata mesajını da temizle
    emailMutation.mutate({ email });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Kullanıcı yazarken hatayı temizle
    if (emailError) {
      setEmailError("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Form submit'i önle
      handleCalendarClick();
    }
  };

  return (
    <>
      <header
        className={`flex shrink-0 items-center justify-between whitespace-nowrap border-b border-primary/20 dark:border-primary/30 px-4 md:px-6 lg:px-10 ${
          emailError ? "py-3 pb-8" : "py-3"
        }`}
      >
        <div className="flex items-center gap-2 md:gap-4 w-full">
          {/* Logo/Title alanı mobilde */}
          <div className="flex-1 lg:flex-none">
            <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white lg:hidden">
              UFC Events
            </h1>
          </div>

          {/* Email input - mobilde üstte, masaüstünde solda */}
          <div className="relative w-full lg:w-auto lg:block">
            <label className="relative block">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                <MdEmail size={20} />
              </div>
              <input
                type="email"
                className={`h-10 w-full lg:max-w-md xl:max-w-lg rounded-lg border-0 bg-slate-200/50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-500 focus:ring-2 ${
                  emailError
                    ? "focus:ring-red-500 ring-2 ring-red-500"
                    : "focus:ring-primary"
                } dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-400`}
                placeholder="E-mail adresinizi girin"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                disabled={emailMutation.isPending}
              />
            </label>
            {emailError && (
              <div className="absolute top-full left-0 mt-1 text-xs text-red-500 dark:text-red-400">
                {emailError}
              </div>
            )}
          </div>

          <button
            onClick={handleCalendarClick}
            disabled={emailMutation.isPending}
            className={`flex h-10 items-center justify-center gap-2 rounded-lg px-3 md:px-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              emailMutation.isPending
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-slate-200/50 text-slate-600 hover:bg-primary/20 hover:text-primary cursor-pointer dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-primary/30 dark:hover:text-primary"
            }`}
          >
            {emailMutation.isPending ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4" />
                <span className="hidden sm:inline">Gönderiliyor...</span>
              </>
            ) : (
              <>
                <MdCalendarToday size={16} />
                <span className="hidden sm:inline">Takvime ekle</span>
                <span className="sm:hidden">Ekle</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Mail Gönderildi Modalı */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-xl p-6 mx-4 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-600 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center">
                <MdCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Mail Gönderildi!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Takvime ekleme isteği{" "}
                  <span className="font-medium text-primary">{email}</span>{" "}
                  adresine gönderildi.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <MdClose className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Hata Modalı */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowErrorModal(false)}
          ></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-xl p-6 mx-4 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-600 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center">
                <MdWarning className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Bir Sorun Oluştu!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {apiErrorMessage ||
                    "E-mail gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowErrorModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 dark:text-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  setShowErrorModal(false);
                  handleCalendarClick();
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-red rounded-lg hover:bg-primary-red/90 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <MdClose className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
