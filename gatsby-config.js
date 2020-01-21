const path = require('path');
const withDefaults = require(`./utils/default-options`);

module.exports = (themeOptions) => {
    const options = withDefaults(themeOptions);
    const { 
        airtableOptions = {}
    } = themeOptions;
    return  {
        siteMetadata: {
            title: 'Soluble Theme Components',
            author: 'Soluble Studio',
            description: 'Components built by Soluble Team'
        },
        plugins: [
            'gatsby-plugin-react-helmet',
            {
                resolve: `gatsby-plugin-layout`,
                options: {
                    component: require.resolve('./src/components/Layout'),
                },
            },
            {
                resolve: "gatsby-plugin-page-creator",
                options: {
                    path: path.join(__dirname, "src/pages"),
                },
            },
            ...(options.airtable && airtableOptions.apiKey ? [
                 {
                    resolve: `gatsby-source-airtable`,
                    options: airtableOptions
                }
            ] : []),
            ...(options.locale ? [
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
                    path: options.contentPath,
                    name: 'content',
                },
            },
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
        ].filter(Boolean),
    }
}