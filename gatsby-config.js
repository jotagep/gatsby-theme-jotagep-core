const path = require('path');
const withDefaults = require(`./utils/default-options`);

module.exports = (themeOptions) => {
    const options = withDefaults(themeOptions);
    const { local = true, airtable, cms = false } = themeOptions;
    return  {
        siteMetadata: {
            title: 'Soluble Theme Source',
            author: 'Soluble Studio',
            description: 'Source built by Soluble Team',
            siteUrl: '',
            primaryLanguage: 'es',
            suffix: ''
        },
        plugins: [
            'gatsby-plugin-react-helmet',
            {
                resolve: `gatsby-source-airtable`,
                options: airtable
            },
            {
                resolve: 'gatsby-source-filesystem',
                options: {
                    path: options.contentPath,
                    name: 'content',
                },
            },
            ...(cms ? [
                {
                    resolve: 'gatsby-source-filesystem',
                    options: {
                    path: options.uploadsPath,
                    name: 'uploads',
                    },
                },
            ] : []),
            {
                resolve: 'gatsby-source-filesystem',
                options: {
                    path: options.assetPath,
                    name: 'images',
                },
            },
            {
                resolve: 'gatsby-plugin-sharp',
                options: {
                    defaultQuality: 80,
                }
            },
            'gatsby-transformer-sharp',
            ...(local ? [ 
                {
                    resolve: 'gatsby-transformer-remark',
                    options: {
                        plugins: [
                        {
                            resolve: 'gatsby-remark-video',
                            options: {
                            width: '100%',
                            height: 'auto',
                            preload: 'auto',
                            muted: true,
                            autoplay: true,
                            playsinline: true,
                            controls: true,
                            loop: true
                            }
                        },
                        {
                            resolve: 'gatsby-remark-relative-images',
                            options: {
                            name: 'uploads',
                            },
                        },
                        {
                            resolve: 'gatsby-remark-images',
                            options: {
                            maxWidth: 1280,
                            quality: 90,
                            withWebp: true,
                            srcSetBreakpoints: [ 576 ],
                            linkImagesToOriginal: false
                            },
                        },
                        {
                            resolve: 'gatsby-remark-copy-linked-files',
                            options: {
                            destinationDir: 'static',
                            },
                        },
                        ],
                    },
                },
            ]: [])
        ].filter(Boolean),
    }
}