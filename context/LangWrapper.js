import { useEffect } from 'react';
import { useLang } from './LangContext';

export default function LangWrapper({children, language}) {
    console.log(language);
    const { setLang } = useLang();

    useEffect(() => {
        setLang(language);
    }, [language]);

    return children;
}
