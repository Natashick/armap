"use client";

import { Button } from "@/components/button";
import { Icons } from "@/components/icons";
import { readDataStream } from "@/lib/read-data-stream";
import { AssistantStatus, Message } from "ai/react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import remarkGfm from "remark-gfm";

const ASSISTANT_NAME = "ARMAP";

const DotAnimation = () => (
  <span className="inline-flex gap-x-1 ml-1">
    {[0, 1, 2]. map((i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", delay: i * 0.2 }}
      >
        . 
      </motion.span>
    ))}
  </span>
);

const Chat = () => {
  const placeholder = "Schreibe deine Nachricht…";
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [threadId, setThreadId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AssistantStatus>("awaiting_message");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status !== "awaiting_message" || !message.trim()) return;

    setStatus("in_progress");
    setError(null);

    const userMessage = message.trim();
    const tempId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    setMessages((msgs) => [
      ...msgs,
      { id: tempId, role: "user", content: userMessage },
    ]);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("message", userMessage);
      formData.append("threadId", threadId);

      const result = await fetch("/api/assistant", { method: "POST", body: formData });
      if (!result.body) throw new Error("The response body is empty.");

      for await (const { type, value } of readDataStream(result. body. getReader())) {
        switch (type) {
          case "assistant_message":
            setMessages((msgs) => [
              ...msgs,
              { id: value.id, role: value.role, content: value.content[0]. text. value },
            ]);
            break;
          case "assistant_control_data":
            setThreadId(value.threadId);
            setMessages((msgs) =>
              msgs.map((m) => (m.id === tempId ? { ...m, id: value.messageId } : m))
            );
            break;
          case "error":
            setError(value && typeof value === 'object' && 'message' in value 
              ? String((value as Error).message) 
              : String(value));
              break;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message :  "Ein unbekannter Fehler ist aufgetreten");
    } finally {
      setStatus("awaiting_message");
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-black to-neutral-950 text-zinc-100">
      <div className="flex flex-col w-full max-w-3xl mx-auto pt-8 pb-56 px-4">
        <header className="flex items-center gap-4 mb-10">
          <img
            src="/armap-avatar.png"
            alt="ARMAP Avatar"
            className="w-20 h-20 rounded-xl border border-neutral-800 object-cover bg-neutral-900 shadow-2xl"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{ASSISTANT_NAME}</h1>
            <p className="text-xl text-zinc-200 uppercase tracking-widest">Assurance & Resilience Mapping</p>
          </div>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col w-full gap-8">
          {messages.map((m, idx) => {
            const isUser = m. role === "user";
            return (
              <div key={m.id + idx} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser ?  (
                  /* BOT */
                  <div className="flex flex-col items-start gap-2 max-w-[90%] md:max-w-full w-full">
                    {/* Avatar nur anzeigen, wenn es sich um die erste Nachricht des Bots oder nach der ersten Nachricht des Nutzers handelt. */}
                    {(idx === 0 || messages[idx - 1]?.role === "user") && (
                      <div className="flex items-center gap-2 ml-1">
                        <img src="/armap-avatar.png" className="w-10 h-10 rounded-full border border-neutral-700" alt="bot" />
                        <span className="text-xs text-zinc-500 font-bold tracking-wider uppercase">ARMAP</span>
                      </div>
                    )}
                    <div className="w-full rounded-2xl px-5 py-4 bg-neutral-900/50 border border-neutral-800 shadow-sm backdrop-blur-sm">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-[15px]">
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  /* BENUTZER: Avatar links neben dem Text */
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black shadow-lg shadow-blue-500/20 mt-1">
                      DU
                    </div>
                    <div className="rounded-2xl px-5 py-3 bg-blue-600 text-white shadow-xl shadow-blue-900/10">
                      <p className="whitespace-pre-wrap text-[15px] leading-snug">
                        {m.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {status === "in_progress" && (
            <div className="flex items-center gap-3 text-zinc-400 ml-1">
              <Icons.spinner className="animate-spin w-4 h-4" />
              <span className="text-sm font-medium tracking-wide italic">
                ARMAP tippt<DotAnimation />
              </span>
            </div>
          )}

          <div ref={bottomRef} className="h-24" />
        </div>
      </div>

      {/* FESTES EINGANGSFELD */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent pb-6 pt-12 px-4">
        <form
          onSubmit={handleFormSubmit}
          className="mx-auto max-w-3xl flex flex-col gap-2 p-3 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl"
        >
          <textarea
            disabled={status !== "awaiting_message"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder={placeholder}
            rows={3}
            className="w-full rounded-xl bg-neutral-900 text-white placeholder: text-zinc-400 p-4 outline-none resize-none text-[15px]"/>
            <div className="flex items-center justify-between border-t border-neutral-800/50 pt-2 px-1">
            {/* FÜR ZEILENUMBRUCH */}
            <div className="text-[10px] uppercase tracking-tighter text-zinc-500 font-bold">
              <span className="text-zinc-400">SHIFT + ENTER</span> FÜR ZEILENUMBRUCH
            </div>
            <Button
              className="h-9 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              type="submit"
              variant="default"
              disabled={status !== "awaiting_message" || !message.trim()}
            >
              <span className="text-xs font-bold mr-2">SENDEN</span>
              <Icons.arrowRight className="w-3. 5 h-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Chat;