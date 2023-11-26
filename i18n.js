import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
 
const i18n = new I18n({
  en: {
    createUser: "Create user button",
  },
  sv: {
    createUser: "Skapa användare",
  },
});
export const changeLanguage = (lang) => {
    i18n.locale = lang;
  };
 
i18n.locale = Localization.locale;
i18n.enableFallback = true;
 
export default i18n;