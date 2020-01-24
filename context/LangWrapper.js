import { useEffect } from 'react';
import { useLang } from './LangContext';

export default function LangWrapper({children, language}) {
    const { lang, setLang } = useLang();
    useEffect(() => {
        setLang(language);
    }, [language]);

    if (!lang) {
        return null;
    }

    return children;
}
