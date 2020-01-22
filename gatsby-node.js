const fs = require(`fs`);
const path = require(`path`);
const mkdirp = require(`mkdirp`);
const Debug = require(`debug`);
const { createFilePath, createRemoteFileNode } = require('gatsby-source-filesystem');
const { fmImagesToRelative } = require('gatsby-remark-relative-images');
//const { getMarkedText } = require('./src/utils/marked');

const debug = Debug(`gatsby-theme-soluble-source`);
const withDefaults = require(`./utils/default-options`);

exports.onPreBootstrap = ({ store }, themeOptions) => {
    const { program } = store.getState()
    const { contentPath, assetPath, uploadsPath, local = true, cms = false } = withDefaults(themeOptions)
  
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
                    language: edge.node.frontmatter.language,
                    name: edge.node.frontmatter.templateKey
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
                template_key: {glob: "*",  ne: "_translation"}
              }
            }
          ) {
            edges {
              node {
                id
                data {
                  template_key
                  Name
                }
              }
            }
          }
        }`);

        const pages = dataAirtable.data.allAirtable.edges;

        pages.forEach(edge => {
          createPage({
            path: `/${edge.node.data.Name}`,
            component: path.resolve(`${__dirname}/src/templates/index.js`),
            context: {
                id: edge.node.id,
                name: edge.node.data.Name
            }
          });
        })
    }
}

exports.onCreateNode = async ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  
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

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type MarkdownRemarkFrontmatter implements Node {
      en: String,
      es: String,
      key: String
    }
  `;

  createTypes(typeDefs)
}