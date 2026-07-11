"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { aiChat, aiChatSuggestions, ApiError, type ChatMessage } from "@/lib/api";

const HISTORY_LIMIT = 6; // API only uses last 6 anyway.

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [sources, setSources] = useState<
    Array<{ id: string; title: string }>
  >([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Toggle the native `inert` attribute so focusable descendants (close button,
  // textarea, send button, suggestion chips) are removed from the tab order and
  // the accessibility tree while the panel is closed. This preserves the CSS
  // fade/translate animation but resolves the axe `aria-hidden-focus` rule.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (open) el.removeAttribute("inert");
    else el.setAttribute("inert", "");
  }, [open]);

  useEffect(() => {
    if (!open || suggestions.length > 0) return;
    aiChatSuggestions()
      .then((r) => setSuggestions(r.suggestions || []))
      .catch(() => {
        /* non-fatal */
      });
  }, [open, suggestions.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim().slice(0, 1000);
      if (!trimmed || busy) return;

      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "user", text: trimmed },
      ];
      setMessages(nextMessages);
      setInput("");
      setError(null);
      setBusy(true);

      try {
        const r = await aiChat({
          message: trimmed,
          history: nextMessages.slice(-HISTORY_LIMIT - 1, -1),
        });
        setMessages((m) => [...m, { role: "assistant", text: r.reply }]);
        setSources(r.sources || []);
      } catch (e) {
        const msg =
          e instanceof ApiError
            ? e.status === 429
              ? "Too many messages — please wait a moment and try again."
              : e.status === 503
                ? "The assistant is temporarily unavailable."
                : e.message
            : e instanceof Error
              ? e.message
              : "Failed to send message";
        setError(msg);
      } finally {
        setBusy(false);
      }
    },
    [messages, busy]
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void send(input);
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        aria-label={open ? "Close assistant" : "Open assistant"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink_btn text-white shadow-card transition-transform hover:scale-105"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6l-12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v9A2.5 2.5 0 0 1 17.5 17H9l-4 4v-4H6.5A2.5 2.5 0 0 1 4 14.5v-9Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed inset-x-4 bottom-24 z-40 flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-all duration-200 sm:bottom-24 sm:right-5 sm:left-auto sm:w-[380px] ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
        style={{ maxHeight: "min(560px, calc(100vh - 120px))" }}
        role="dialog"
        aria-label="Research assistant"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink_btn text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <div>
              <p className="text-[13px] font-medium text-ink">
                Research assistant
              </p>
              <p className="text-[11px] text-ink-muted">
                Ask about compounds, storage, or sourcing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-ink-secondary hover:bg-canvas hover:text-ink"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6l-12 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4"
        >
          {messages.length === 0 && (
            <div>
              <p className="text-[13px] text-ink-secondary">
                Hi. I&rsquo;m your research assistant — ask me anything about the
                Peptiva Labs catalogue.
              </p>
              {suggestions.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {suggestions.slice(0, 4).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="text-left rounded-xl border border-line bg-canvas px-3 py-2 text-[12px] text-ink transition-colors hover:bg-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <ul className="space-y-3">
            {messages.map((m, i) => (
              <li
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-ink_btn text-white"
                      : "bg-surface-soft text-ink"
                  }`}
                >
                  {m.text}
                </div>
              </li>
            ))}
            {busy && (
              <li className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-surface-soft px-3.5 py-2.5">
                  <Dot delay="0ms" />
                  <Dot delay="120ms" />
                  <Dot delay="240ms" />
                </div>
              </li>
            )}
          </ul>

          {sources.length > 0 && messages.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {sources.map((s) => (
                <span
                  key={s.id}
                  className="rounded-pill border border-line bg-white px-2 py-0.5 text-[10px] text-ink-secondary"
                  title={s.id}
                >
                  {s.title}
                </span>
              ))}
            </div>
          )}

          {error && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {error}
            </p>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 border-t border-line p-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 1000))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="Ask about a compound…"
            rows={1}
            className="max-h-28 min-h-[40px] flex-1 resize-none rounded-xl border border-line bg-white px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-subtle focus:border-ink/30"
          />
          <button
            type="submit"
            disabled={!input.trim() || busy}
            className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ink_btn text-white transition-opacity disabled:opacity-40"
            aria-label="Send"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12l16-8-6 16-2-7-8-1z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-ink-secondary"
      style={{ animationDelay: delay }}
    />
  );
}
