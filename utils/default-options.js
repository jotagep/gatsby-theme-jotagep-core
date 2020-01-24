module.exports = themeOptions => {
    const basePath = themeOptions.basePath || `/`;
    const templatesPath = themeOptions.templatesPath || `src/templates`;
    const contentPath = themeOptions.contentPath || `content/pages`;
    const assetPath = themeOptions.assetPath || `static/assets`;
    const uploadsPath = themeOptions.uploadsPath || `static/uploads`;

    return {
        basePath,
        contentPath,
        assetPath,
        uploadsPath,
        templatesPath
    }
}