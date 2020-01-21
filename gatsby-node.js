const fs = require(`fs`)
const path = require(`path`)
const mkdirp = require(`mkdirp`)
const Debug = require(`debug`)
const { createFilePath, createRemoteFileNode } = require('gatsby-source-filesystem');
const { fmImagesToRelative } = require('gatsby-remark-relative-images');
//const { getMarkedText } = require('./src/utils/marked');

const debug = Debug(`gatsby-theme-soluble-source`);
const withDefaults = require(`./utils/default-options`);

exports.onPreBootstrap = ({ store }, themeOptions) => {
    const { program } = store.getState()
    const { contentPath, assetPath, uploadsPath, locale } = withDefaults(themeOptions)
  
    const dirs = [
      path.join(program.directory, contentPath),
      path.join(program.directory, assetPath),
    ];

    if (locale) {
        dirs.push(path.join(program.directory, uploadsPath));
    }
  
    dirs.forEach(dir => {
      debug(`Initializing ${dir} directory`)
      if (!fs.existsSync(dir)) {
        mkdirp.sync(dir)
      }
    })
  }

exports.createPages = ({ actions, graphql, ...props }, themeOptions) => {
    const { createPage } = actions;
    console.log(themeOptions);
}