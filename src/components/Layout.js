import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { LangProvider } from '../../context/LangContext';
import { TranslateProvider } from '../../context/TranslateContext';

import Header from './Header';
import Footer from './Footer';

export default function Layout({children, ...props}) {
    console.log(props);
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

    return (
        <div>
            <Header />
                {children}
            <Footer />
        </div>
    )
}
