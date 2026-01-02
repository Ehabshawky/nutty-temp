// app/providers.tsx
"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "../utils/i18n";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { SessionProvider } from "next-auth/react";
import { ChatbotProvider } from "../contexts/ChatbotContext";


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <LanguageProvider>
            <ChatbotProvider>
              {children}
            </ChatbotProvider>
          </LanguageProvider>
        </ThemeProvider>
      </I18nextProvider>
    </SessionProvider>
  );
}
