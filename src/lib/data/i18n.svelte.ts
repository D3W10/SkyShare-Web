import i18next from "i18next";

import enUS from "../translations/en-US.json";
import ptPT from "../translations/pt-PT.json";

export const languages = ["en", "en-US", "pt", "pt-PT"];

i18next.init({
    lng: "en-US",
    resources: {
        "en": { translation: enUS },
        "en-US": { translation: enUS },
        "pt": { translation: ptPT },
        "pt-PT": { translation: ptPT }
    }
});

export const i18n = $state({
    t: i18next.t,
    language: i18next.language
});

export async function changeLanguage(lng: string) {
    i18n.language = lng;
    i18n.t = await i18next.changeLanguage(lng);
}