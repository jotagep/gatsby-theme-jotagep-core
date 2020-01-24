import { useLang } from './LangContext';

export default function LangWrapper({children, language}) {
    const { lang, setLang } = useLang();

    if (lang !== language) {
        setLang(language)
    }

    return children;
}
