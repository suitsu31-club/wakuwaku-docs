import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

export const revalidate = false;

// The default `multilingual` tokenizer handles both English and Japanese.
export const { staticGET: GET } = createFromSource(source);
