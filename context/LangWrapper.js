import { useLang } from './LangContext';

export default function LangWrapper({children, language}) {
    const { lang, setLang } = useLang();

    if (language && lang !== language) {
        setLang(language)
    }

    return children;
}
