import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  MdCalendarToday,
  MdCheck,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdClose,
  MdDarkMode,
  MdEmail,
  MdKeyboardArrowDown,
  MdLightMode,
  MdWarning,
} from "react-icons/md";
import { z } from "zod";
import { addEventToCalendar } from "../api/services";
import { useEventSelectionStore } from "../stores/eventSelectionStore";
import { useThemeStore } from "../stores/themeStore";

const emailSchema = z.email({ error: "Geçerli bir e-mail adresi girin" });

function Header() {
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [eventSelectionError, setEventSelectionError] = useState("");
  const [apiErrorMessage, setApiErrorMessage] = useState("");
  const [showEventSelector, setShowEventSelector] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [sentEventIds, setSentEventIds] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Zustand store'dan event verileri ve actions'ları al
  const events = useEventSelectionStore((state) => state.events);
  const isEventsLoading = useEventSelectionStore(
    (state) => state.isEventsLoading
  );
  const selectedEventIds = useEventSelectionStore(
    (state) => state.selectedEventIds
  );
  const toggleEventSelection = useEventSelectionStore(
    (state) => state.toggleEventSelection
  );
  const selectAllEvents = useEventSelectionStore(
    (state) => state.selectAllEvents
  );
  const clearAllSelections = useEventSelectionStore(
    (state) => state.clearAllSelections
  );
  const isAllSelected = useEventSelectionStore((state) =>
    state.isAllSelected()
  );
  const isSomeSelected = useEventSelectionStore((state) =>
    state.isSomeSelected()
  );
  const getSelectionText = useEventSelectionStore((state) =>
    state.getSelectionText()
  );

  // Theme store
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  // Gönderilen event'lerin detaylarını al
  const sentEvents = sentEventIds
    .map((id) => events.find((event) => event.id === id))
    .filter((event): event is NonNullable<typeof event> => Boolean(event));

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearAllSelections();
    } else {
      selectAllEvents();
    }
    // Event seçimi yapıldığında hatayı temizle
    if (eventSelectionError) {
      setEventSelectionError("");
    }
  };

  const handleEventSelection = (eventId: string) => {
    toggleEventSelection(eventId);
    // Event seçimi yapıldığında hatayı temizle
    if (eventSelectionError) {
      setEventSelectionError("");
    }
  };

  // Theme initialization
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowEventSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Email gönderme mutation'ı
  const emailMutation = useMutation({
    mutationFn: (emailData: { email: string; selectedEventIds: string[] }) =>
      addEventToCalendar(emailData),
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

    // Events yüklenme kontrolü
    if (isEventsLoading) {
      setEventSelectionError("Etkinlikler yükleniyor, lütfen bekleyin...");
      return;
    }

    // Events var mı kontrolü
    if (!events || events.length === 0) {
      setEventSelectionError(
        "Henüz etkinlik bulunamadı. Lütfen sayfayı yenileyin"
      );
      return;
    }

    // Event seçimi kontrolü
    if (!selectedEventIds || selectedEventIds.length === 0) {
      setEventSelectionError(
        "Takvime eklemek için en az bir etkinlik seçmelisiniz"
      );
      return;
    }

    // Seçilen eventlerin gerçekten var olduğunu kontrol et
    const validEventIds = selectedEventIds.filter((id) =>
      events.some((event) => event.id === id)
    );

    if (validEventIds.length === 0) {
      setEventSelectionError(
        "Seçilen etkinlikler geçersiz. Lütfen tekrar seçim yapın"
      );
      return;
    }

    // Geçersiz seçimler varsa kullanıcıyı bilgilendir
    if (validEventIds.length < selectedEventIds.length) {
      console.warn(
        `${
          selectedEventIds.length - validEventIds.length
        } geçersiz etkinlik seçimi filtrelendi`
      );
    }

    // Geçerli event ID'lerini kullan
    const finalSelectedEventIds = validEventIds;

    // Validasyon başarılı, hataları temizle ve API isteği gönder
    setEmailError("");
    setEventSelectionError("");
    setApiErrorMessage(""); // API hata mesajını da temizle

    // Gönderilen bilgileri kaydet (modal için)
    setSentEmail(email);
    setSentEventIds(finalSelectedEventIds);

    emailMutation.mutate({ email, selectedEventIds: finalSelectedEventIds });
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
        className={`flex shrink-0 flex-col border-b border-primary/20 dark:border-primary/30 px-4 md:px-6 lg:px-10 ${
          emailError || eventSelectionError ? "py-3 pb-8" : "py-3"
        }`}
      >
        {/* Mobil: Logo ve Theme Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-4">
          <div></div> {/* Spacer */}
          <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            UFC Events
          </h1>
          {/* Theme Toggle Button - Mobile */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-200/50 hover:bg-slate-300/50 focus:ring-2 focus:ring-primary dark:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <MdLightMode
                className="text-slate-600 dark:text-slate-400"
                size={18}
              />
            ) : (
              <MdDarkMode
                className="text-slate-600 dark:text-slate-400"
                size={18}
              />
            )}
          </button>
        </div>

        {/* Desktop: Tek satır layout / Mobile: Stack layout */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4 w-full">
          {/* Desktop Logo (gizli mobilde) */}
          <div className="hidden lg:block lg:flex-none">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              UFC Events
            </h1>
          </div>

          {/* Event Seçimi Dropdown */}
          <div className="relative w-full lg:w-auto" ref={dropdownRef}>
            <button
              onClick={() =>
                events.length > 0 && setShowEventSelector(!showEventSelector)
              }
              className={`flex h-10 w-full lg:min-w-[180px] lg:w-auto items-center justify-between gap-2 rounded-lg px-3 text-sm transition-all ${
                events.length === 0 || emailMutation.isPending
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                  : "bg-slate-200/50 text-slate-600 hover:bg-slate-300/50 focus:ring-2 focus:ring-primary dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700/50"
              }`}
              disabled={events.length === 0 || emailMutation.isPending}
            >
              <span className="truncate">{getSelectionText}</span>
              <MdKeyboardArrowDown
                className={`transition-transform flex-shrink-0 ${
                  showEventSelector ? "rotate-180" : ""
                }`}
                size={16}
              />
            </button>

            {/* Event Seçim Dropdown */}
            {showEventSelector && (
              <div className="absolute top-full left-0 mt-1 z-50 w-full lg:min-w-[320px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-hidden">
                {/* Tümünü Seç/Kaldır */}
                {events.length > 0 && (
                  <button
                    onClick={handleSelectAll}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 border-b border-gray-200 dark:border-gray-600"
                  >
                    {isAllSelected ? (
                      <MdCheckBox className="text-primary" size={18} />
                    ) : isSomeSelected ? (
                      <MdCheckBox
                        className="text-primary opacity-50"
                        size={18}
                      />
                    ) : (
                      <MdCheckBoxOutlineBlank
                        className="text-gray-400"
                        size={18}
                      />
                    )}
                    <span className="font-medium text-slate-900 dark:text-white">
                      Tüm Eventler ({events.length})
                    </span>
                  </button>
                )}

                {/* Event Listesi */}
                <div className="max-h-48 overflow-y-auto">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => handleEventSelection(event.id)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        {selectedEventIds.includes(event.id) ? (
                          <MdCheckBox
                            className="text-primary flex-shrink-0"
                            size={18}
                          />
                        ) : (
                          <MdCheckBoxOutlineBlank
                            className="text-gray-400 flex-shrink-0"
                            size={18}
                          />
                        )}
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-slate-900 dark:text-white font-medium truncate text-xs">
                            {event.eventTitle}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {new Date(event.eventDate).toLocaleDateString(
                              "tr-TR"
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                      Henüz event yüklenmedi...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Event Selection Error Message */}
            {eventSelectionError && (
              <div className="absolute top-full left-0 mt-1 text-xs text-red-500 dark:text-red-400">
                {eventSelectionError}
              </div>
            )}
          </div>

          {/* Email input ve Buton - Mobilde alt alta, Desktop'ta yan yana */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4 w-full lg:w-auto">
            {/* Email input */}
            <div className="relative w-full lg:w-auto">
              <label className="relative block">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                  <MdEmail size={20} />
                </div>
                <input
                  type="email"
                  className={`h-10 w-full lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl rounded-lg border-0 bg-slate-200/50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-500 focus:ring-2 ${
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

            {/* Takvime Ekle Butonu */}
            <button
              onClick={handleCalendarClick}
              disabled={emailMutation.isPending}
              className={`flex h-10 w-full lg:w-auto items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                emailMutation.isPending
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                  : "bg-slate-200/50 text-slate-600 hover:bg-primary/20 hover:text-primary cursor-pointer dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-primary/30 dark:hover:text-primary"
              }`}
            >
              {emailMutation.isPending ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin h-4 w-4" />
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <MdCalendarToday size={16} />
                  <span>Takvime ekle</span>
                </>
              )}
            </button>
          </div>

          {/* Theme Toggle Button - Desktop */}
          <div className="hidden lg:block">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-200/50 hover:bg-slate-300/50 focus:ring-2 focus:ring-primary dark:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <MdLightMode
                  className="text-slate-600 dark:text-slate-400"
                  size={20}
                />
              ) : (
                <MdDarkMode
                  className="text-slate-600 dark:text-slate-400"
                  size={20}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mail Gönderildi Modalı */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-xl p-6 mx-4 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-600 animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center flex-shrink-0">
                <MdCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Mail Başarıyla Gönderildi!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Takvime ekleme isteği{" "}
                  <span className="font-medium text-primary">{sentEmail}</span>{" "}
                  adresine gönderildi.
                </p>

                {/* Gönderilen Event'ler */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                    Seçilen Etkinlikler ({sentEvents.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {sentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <MdCheck className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {event.eventTitle}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(event.eventDate).toLocaleDateString(
                              "tr-TR"
                            )}{" "}
                            • {event.eventLocation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 dark:text-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
              >
                Kapat
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
