import React, { useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { graphql, useStaticQuery } from 'gatsby';

import { useLang } from '../../context/LangContext';
import GlobalContext from '../../context/GlobalContext';

import Header from './Header';
import Footer from './Footer';

import defaultImage from '../img/default-sharing-image.png';

export default function Layout({
    children
}) {
    const { lang } = useLang();
    const { seo, pageUrl } = useContext(GlobalContext);

    const data = useStaticQuery(graphql`
        {
            site {
                siteMetadata {
                    title
                    description
                    suffix
                }
            }
        }
    `);

    const defaultTitle = data.site.siteMetadata.title;
    const defaultDescription = data.site.siteMetadata.description;
    const suffix = data.site.siteMetadata.suffix;

    useEffect(() => {
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);            
        }

        if (typeof window !== 'undefined') {
            setViewportHeight();
            window.addEventListener('resize', setViewportHeight);
            window.addEventListener('orientationchange', setViewportHeight);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', setViewportHeight);
                window.removeEventListener('orientationchange', setViewportHeight);
            }
        }
    }, []);

    const title = seo && seo.title ? `${seo.title}${!seo.ishome ? suffix : ''}` : defaultTitle;
    const description = seo && seo.description ? seo.description : defaultDescription;
    const sharingImageSrc = seo && seo.image && seo.image.childImageSharp ? `${seo.image.childImageSharp.resize.src.substr(1)}` : defaultImage;

    return (
        <>
            <Helmet>
                <html lang={lang} />
                <title>{title}</title>
                {pageUrl ? <link rel="canonical" href={pageUrl} /> : null}
                {seo && seo.noindex ? <meta name="robots" content="noindex" /> : null}
                {/* {alternateLang && !blockHrefLang ? alternateLang.map((item, i) => (
                    <link key={i} rel="alternate" hreflang={item.frontmatter.language} href={`${url}${isProjectSlug ? item.fields.projectSlug : (item.fields.slug !== '/' ? item.fields.slug : '')}`} />
                )) : null} */}
                <meta name="title" content={title} />                
                {description ? <meta name="description" content={description} /> : null}
                <meta property="og:type" content="website" />
                {pageUrl ? <meta property="og:url" content={pageUrl} /> : null}
                <meta property="og:title" content={title} />
                {description ? <meta property="og:description" content={description} /> : null}
                {sharingImageSrc ? (<meta property="og:image" content={sharingImageSrc} />) : null}
                <meta property="twitter:card" content="summary_large_image" />
                {pageUrl ? <meta property="twitter:url" content={pageUrl} /> : null}
                <meta property="twitter:title" content={title} />
                {description ? <meta property="twitter:description" content={description} /> : null}
                {sharingImageSrc ? (<meta property="twitter:image" content={sharingImageSrc} />) : null}
            </Helmet>
            <div>
                <Header />
                <main>
                    {children}
                </main>
                <Footer />
            </div>
        </>
    )
}
