"use client";
import type { I18nProviderProps } from "fumadocs-ui/contexts/i18n";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import SearchDialog from "@/components/search";

export function Provider({
  children,
  i18n,
}: {
  children: ReactNode;
  i18n: I18nProviderProps;
}) {
  return (
    <RootProvider
      search={{ SearchDialog }}
      i18n={i18n}
      theme={{
        // Switching language changes the `[lang]` root segment, so Next remounts this
        // provider on the client, and next-themes renders its no-flash <script> again.
        // React warns about scripts created on the client (they never run) unless they
        // are data blocks. The server copy stays executable; the client copy is inert.
        scriptProps: {
          type:
            typeof window === "undefined"
              ? "text/javascript"
              : "application/json",
        },
      }}
    >
      {children}
    </RootProvider>
  );
}
