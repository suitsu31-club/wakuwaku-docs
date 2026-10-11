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
    <RootProvider search={{ SearchDialog }} i18n={i18n}>
      {children}
    </RootProvider>
  );
}
