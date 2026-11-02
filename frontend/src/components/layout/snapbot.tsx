"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FiSend, FiX } from "react-icons/fi";
import { chatSuggestions } from "@/lib/demo-data";

type Message = { id: number; from: "bot" | "user"; text: string };

const initialMessages: Message[] = [
  { id: 1, from: "bot", text: "Hi Jonathan! I'm SnapBot. Ask me anything about your electricity usage or bill." },
];

export function SnapBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const nextId = useRef(2);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: nextId.current++, from: "user", text };
    const botMsg: Message = {
      id: nextId.current++,
      from: "bot",
      text: "Thanks! SnapBot's AI brain isn't wired up yet — this is a Stage 1 UI preview. Full answers are coming soon.",
    };
    setMessages((m) => [...m, userMsg, botMsg]);
    setDraft("");
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed bottom-24 right-5 z-50 flex h-[520px] w-[360px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl sm:right-8 no-print"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-navy to-blue px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white/15 ring-2 ring-white/30">
                  <Image src="/brand/snapbot.png" alt="SnapBot" fill className="object-cover" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-white">SnapBot</p>
                  <p className="flex items-center gap-1 text-[11px] text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-bolt" /> Online · UI preview
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close SnapBot"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-bg-alt/60 px-4 py-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.from === "user"
                        ? "rounded-br-sm bg-blue text-white"
                        : "rounded-bl-sm border border-border bg-white text-ink"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {messages.length === 1 && (
                <div className="flex flex-col gap-2 pt-2">
                  {chatSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-xl border border-border bg-white px-3 py-2 text-left text-xs text-ink-soft transition-colors hover:border-blue hover:text-blue"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="flex items-center gap-2 border-t border-border bg-white p-3"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask SnapBot about your bill…"
                className="h-10 flex-1 rounded-xl border border-border bg-bg px-3.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-blue/40"
              />
              <button
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue text-white transition-transform hover:scale-105 active:scale-95"
                aria-label="Send message"
              >
                <FiSend size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-blue/10 sm:right-8 no-print"
        aria-label="Open SnapBot chat"
      >
        <span className="absolute inset-0 rounded-full bg-blue/20 animate-ping [animation-duration:2.5s]" />
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image src="/brand/snapbot.png" alt="SnapBot" fill className="object-cover" />
        </div>
      </motion.button>
    </>
  );
}
