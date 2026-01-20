"use client";

import { Button } from "@/components/button";
import { Icons } from "@/components/icons";
import { readDataStream } from "@/lib/read-data-stream";
import { AssistantStatus, Message } from "ai/react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

const ASSISTANT_NAME = "ARMAP - Assurance & Resilience Mapping";

const DotAnimation = () => {
  const dotVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const containerVariants = {
    initial: { transition: { staggerChildren: 0 } },
    animate: { transition: { staggerChildren: 0.5, staggerDirection: 1 } },
    exit: { transition: { staggerChildren: 0.5, staggerDirection: 1 } }
  };

  const [key, setKey] = useState(0);

  return (
    <motion.div
      key={key}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex gap-x-0.5 -ml-1"
      variants={containerVariants}
      onAnimationComplete={() => setKey((prevKey) => prevKey + 1)}
    >
      {[...Array(3)].map((_, i) => (
        <motion.span key={i} variants={dotVariants}>
          .
        </motion.span>
      ))}
    </motion.div>
  );
};

const Chat = () => {
  const placeholder = "Schreibe deine Nachricht…";
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [threadId, setThreadId] = useState<string>("");
  const [error, setError] = useState<unknown | undefined>(undefined);
  const [status, setStatus] = useState<AssistantStatus>("awaiting_message");

  // Auto-Scroll ans Ende
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status !== "awaiting_message") return;
    if (!message.trim()) return;

    setStatus("in_progress");

    // Nutzer-Nachricht sofort anzeigen
    setMessages((msgs: Message[]) => [
      ...msgs,
      { id: "", role: "user", content: message.trim() }
    ]);

    const formData = new FormData();
    formData.append("message", message.trim());
    formData.append("threadId", threadId);

    // Eingabefeld leeren
    setMessage("");

    const result = await fetch("/api/assistant", {
      method: "POST",
      body: formData
    });

    if (result.body == null) {
      setStatus("awaiting_message");
      throw new Error("The response body is empty.");
    }

    try {
      for await (const { type, value } of readDataStream(
        result.body.getReader()
      )) {
        switch (type) {
          case "assistant_message": {
            setMessages((msgs: Message[]) => [
              ...msgs,
              {
                id: value.id,
                role: value.role,
                content: value.content[0].text.value
              }
            ]);
            break;
          }
          case "assistant_control_data": {
            setThreadId(value.threadId);
            // letzte User-Nachricht per Kopie mit ID versehen
            setMessages((msgs: Message[]) => {
              if (msgs.length === 0) return msgs;
              const updated = [...msgs];
              const lastIdx = updated.length - 1;
              updated[lastIdx] = { ...updated[lastIdx], id: value.messageId };
              return updated;
            });
            break;
          }
          case "error": {
            setError(value);
            break;
          }
        }
      }
    } catch (error) {
      setError(error);
    }

    setStatus("awaiting_message");
  };

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (status === "awaiting_message" && message.trim()) {
        // submit auslösen
        const form = (e.currentTarget as HTMLTextAreaElement).closest("form");
        form?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-black to-neutral-950">
      <div className="flex flex-col w-full max-w-3xl mx-auto px-6 md:px-12 pt-8 pb-32">
        {/* Header mit Avatar */}
        <header className="flex items-center gap-4 mb-6">
          <img
            src="/armap-avatar.png"
            alt="ARMAP Avatar"
            className="w-20 h-20 rounded-xl border border-neutral-800 object-cover bg-neutral-900"
          />
          <div>
            <h1 className="text-3xl md:text-4xl text-zinc-100 font-extrabold leading-tight">
              {ASSISTANT_NAME}
            </h1>
            <p className="text-sm text-zinc-400">Dein Assurance & Resilience Mapping Assistant</p>
          </div>
        </header>

        {error != null && (
          <div className="relative bg-red-500 text-white px-6 py-4 rounded-md mb-4">
            <span className="block sm:inline">Error: {(error as any).toString()}</span>
          </div>
        )}

        {/* Nachrichtenbereich */}
        <div className="flex flex-col w-full gap-3">
          {messages.map((m: Message, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={(m.id || "msg") + "-" + idx}
                className={`w-full flex ${isUser ? "justify-end" :  "justify-start"}`}
              >
                {! isUser ?  (
                  // Bots Nachricht - grid layout für volle Breite
                  <div className="w-full">
                    <div className="grid grid-cols-[2.5rem_1fr] gap-3 w-full">
                    {/* Avatar separat*/}
                    <div className="flex justify-center">
                    <img
                      src="/armap-avatar.png"
                      alt="ARMAP Avatar"
                      className="w-10 h-10 rounded-full border border-neutral-800 object-cover bg-neutral-900"
                    />
                    </div>

                    {/* Nachrichtblase */}
                    <div className="w-full">
                      <div className="rounded-2xl px-4 py-3 shadow border bg-neutral-900 text-zinc-100 border-neutral-800">
                        <ReactMarkdown className="whitespace-pre-wrap leading-relaxed">
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>

                ) : (
                  // Users Nachricht, begrenzt für 85%
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-blue-600 text-white grid place-items-center text-xs font-semibold select-none">
                      Du
                    </div>
                    <div className="rounded-2xl px-4 py-3 shadow border bg-blue-600 text-white border-blue-500">
                      <ReactMarkdown className="whitespace-pre-wrap">
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {status === "in_progress" && (
            <div className="w-full flex justify-start mt-1">
              <div className="flex items-center gap-3">
                <img
                  src="/armap-avatar.png"
                  alt="ARMAP Avatar"
                  className="w-10 h-10 rounded-full border border-neutral-800 object-cover bg-neutral-900"
                />
                <span className="text-zinc-300 flex items-center gap-2">
                  <Icons.spinner className="animate-spin w-4 h-4" />
                  ARMAP tippt <DotAnimation />
                </span>
              </div>
            </div>
          )}

          {/* Spacer für das fixierte Eingabefeld */}
          <div ref={bottomRef} className="h-40" />
        </div>
      </div>

      {/* Eingabebereich – breiter und höher, fixiert */}
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-2 p-3 text-white bg-black/70 backdrop-blur-sm fixed left-1/2 -translate-x-1/2 bottom-6 w-[92%] max-w-3xl border border-neutral-800 rounded-2xl shadow-xl"
      >
        <textarea
          disabled={status !== "awaiting_message"}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleTextareaKeyDown}
          placeholder={placeholder}
          rows={5}
          className={`w-full rounded-xl bg-neutral-900 text-white placeholder:text-zinc-400 p-4 outline-none
            ${status !== "awaiting_message" ? "opacity-70" : "opacity-100"}
            focus:ring-2 focus:ring-blue-600 border border-neutral-800`}
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            Enter senden • Shift+Enter Zeilenumbruch
          </div>
          <Button
            className="flex items-center gap-2 px-4 py-2"
            variant="ghost"
            type="submit"
            disabled={status !== "awaiting_message"}
            aria-label="Nachricht senden"
            title="Nachricht senden"
          >
            Senden
            <Icons.arrowRight className="text-gray-200 hover:text-white transition-colors duration-200 ease-in-out w-5 h-5" />
          </Button>
        </div>
      </form>
    </main>
  );
};

export default Chat;
