import { en } from "./en";
import { fa } from "./fa";
import { fr } from "./fr";

export const translations = {
  en,
  fa,
  fr,
};

export type TranslationKey = keyof typeof en;
export type AvailableLanguages = keyof typeof translations;
