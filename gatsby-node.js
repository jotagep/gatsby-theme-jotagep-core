const fs = require(`fs`);
const path = require(`path`);
const mkdirp = require(`mkdirp`);
const Debug = require(`debug`);
const { createFilePath, createRemoteFileNode } = require('gatsby-source-filesystem');
const { fmImagesToRelative } = require('gatsby-remark-relative-images');
const { getMarkedText } = require('./utils/marked');

const debug = Debug(`gatsby-theme-soluble-source`);
const withDefaults = require(`./utils/default-options`);

exports.onPreBootstrap = async ({ store, graphql }, themeOptions) => {
    const { program } = store.getState()
    const { contentPath, assetPath, uploadsPath } = withDefaults(themeOptions);
    const { local = true, cms = false } = themeOptions;
  
    const dirs = [
      path.join(program.directory, assetPath)
    ];

    if (local) {
      dirs.push(path.join(program.directory, contentPath));
    }
    if (cms) {
      dirs.push(path.join(program.directory, uploadsPath));
    }
  
    dirs.forEach(dir => {
      debug(`Initializing ${dir} directory`)
      if (!fs.existsSync(dir)) {
        mkdirp.sync(dir)
      }
    })
  }

exports.createPages = async ({ actions, graphql, ...props }, themeOptions) => {
    const { createPage } = actions;
    const {templatesPath } = withDefaults(themeOptions)

    const dataUrl = await graphql(`
      {
        site {
            siteMetadata {
              siteUrl
              primaryLanguage
            }
        }
      }
    `);

    const primaryLanguage = dataUrl.data.site.siteMetadata;
    let url = dataUrl.data.site.siteMetadata.siteUrl ? dataUrl.data.site.siteMetadata.siteUrl.trim() : '';
    if (url.slice(-1) !== '/') {
      url += '/';
    }

    if (themeOptions.local) {
        const dataLocal = await graphql(`
        {
          allMarkdownRemark(
              filter: {
                  frontmatter: {
                      templateKey: {
                          glob: "*",
                          ne: "_translation"
                      }
                  }
              }
          ) {
              edges {
                  node {
                      id
                      fields {
                          slug
                      }
                      frontmatter {
                          templateKey
                          language
                          seo {
                            title
                            description
                            image {
                                childImageSharp {
                                    resize(width: 1200, height: 630) {
                                        src
                                    }
                                }
                            }
                            noIndex
                            removeSuffix
                        }
                      }
                  }
              }
          }
        }`);

        const pages = dataLocal.data.allMarkdownRemark.edges;

        pages.forEach(edge => {
            createPage({
                path: edge.node.fields.slug,
                component: path.resolve(`${__dirname}/src/templates/index.js`),
                context: {
                    id: edge.node.id,
                    url,
                    pageUrl: `${url}${edge.node.fields.slug}`,
                    language: edge.node.frontmatter.language || primaryLanguage,
                    name: edge.node.frontmatter.templateKey,
                    seo: edge.node.frontmatter.seo
                },
            });
        });

    }

    if (themeOptions.airtable) {
        const dataAirtable = await graphql(`
        {
          allAirtable(
            filter: {
              data: {
                templateKey: {glob: "*",  ne: "_translation"}
              }
            }
          ) {
            edges {
              node {
                id
                table
                data {
                  templateKey
                  language
                  slug
                  seoTitle
                  seoDescription
                  noIndex
                  removeSuffix
                  seoImage {
                    localFiles {
                      childImageSharp {
                        resize(width: 1200, height: 630) {
                            src
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }`);

        const pages = dataAirtable.data.allAirtable.edges;

        pages.forEach(edge => {
          const seo = {
            title: edge.node.data.seoTitle,
            description: edge.node.data.seoDescription,
            image: edge.node.data.seoImage ? edge.node.data.seoImage.localFiles[0] : null,
            noIndex: edge.node.data.noIndex,
            removeSuffix: edge.node.data.removeSuffix
          }

          createPage({
            path: `/${edge.node.data.slug}/`,
            component: path.resolve(`${templatesPath}/${edge.node.data.templateKey}.js`),
            context: {
                id: edge.node.id,
                url,
                pageUrl: `${url}${edge.node.data.slug}`,
                language: edge.node.data.language || primaryLanguage,
                seo
            }
          });
        })
    }
}

exports.onCreateNode = async ({ node, actions, store, cache, createNodeId, getNode }) => {
  const { createNode, createNodeField } = actions;
  
  fmImagesToRelative(node); // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
      let value = createFilePath({ node, getNode });
      const slugParts = value.split('-');

      if (slugParts.length > 1) {
          value = slugParts.pop();

          if (slugParts[0] !== '/index') {
              value += `${slugParts.join('-').replace('/', '')}/`;

              const slashSlugParts = slugParts.join('-').split('/').filter(i => (!!i));
              singleValue = slashSlugParts[slashSlugParts.length - 1];
          } else if (!value) {
              value = '/';
          }
      }

      createNodeField({
          name: `slug`,
          node,
          value,
      });
  }
}

exports.createSchemaCustomization = ({ actions, cache, }) => {
  const { createTypes, createFieldExtension } = actions;

  createFieldExtension({
      name: "md",
      args: {
          animate: {
              type: "Boolean!",
              defaultValue: false
          }
      },
      extend: (options) => ({
          resolve(source, args, context, info) {
              if (source[info.fieldName]) {
                  return getMarkedText(source[info.fieldName]);
              } 
              return null;
          }
      })
  });

  const typeDefs = `
    type MarkdownRemark implements Node @infer{
      frontmatter: Frontmatter
    }

    type Frontmatter {
      templateKey: String
      en: String,
      es: String,
      key: String,
      seo: SeoMarkdown
    }

    type SeoMarkdown {
      title: String,
      description: String,
      image: File @fileByRelativePath,
      noindex: Boolean,
      removeSuffix: Boolean,
    }


  `;

  createTypes(typeDefs)
}