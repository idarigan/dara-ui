import { useI18n } from "../components/LanguageChanger";

export const useAppTranslation = () => {
  const { t, language, setLanguage, dir, languages } = useI18n();
  return { t, language, setLanguage, dir, languages };
};
