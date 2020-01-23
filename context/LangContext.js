import React, { useState, useContext, createContext, useMemo } from 'react';
import { useStaticQuery, graphql } from "gatsby"

const LangContext = createContext(null)

const LangProvider = ({children, options = {}}) => {

    const dataTranslate = useStaticQuery(graphql`
        query  {
            local: allMarkdownRemark(
                filter: {
                    frontmatter: {
                        templateKey: {
                            eq: "_translation"
                        }
                    }
                }
            ) {
                edges {
                    node {
                        frontmatter {
                            key
                            es
                            en
                        }
                    }
                }
            }
            airtable: allAirtable(filter: {data: {templateKey: {eq: "_translation"}}}) {
                edges {
                    node {
                        id
                        data {
                            key
                            es
                            en
                        }
                    }
                }
            }
        }        
    `);

    const translateInitial = options.dictionaryConstants || {};

    if (options.local) {
        const dataLocal = dataTranslate.local.edges;
        dataLocal.reduce((translates, edge) => {
            const {key, ...translateData} = edge.node.frontmatter 
            translates[key] = translateData;
            return translates;
        }, translateInitial);
    }

    if (options.airtable) {
        const dataAirtable = dataTranslate.airtable.edges;
        dataAirtable.reduce((translates, edge) => {
            const {key, ...translateData} = edge.node.data 
            translates[key] = translateData;
            return translates;
        }, translateInitial);
    }

    const [state, setState] = useState({
        lang: null,
        translate: translateInitial
    });

    const value = useMemo(() => {
        return { state, setState }
    }, [state]);

    return <LangContext.Provider value={value}>{children}</LangContext.Provider>
} 

// Hooks
function useLang() {
    const { state, setState } = useContext(LangContext);

    function setLang(lang) {
        setState(state => ({
            ...state,
            lang
        }))
    }

    return { lang: state.lang, setLang }
}

function useTranslate(key) {
    const { state } = useContext(LangContext);

    return state.translate[key] && state.translate[key][state.lang];
}

export {
    LangProvider,
    useLang,
    useTranslate
}