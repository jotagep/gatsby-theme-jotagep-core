module.exports = themeOptions => {
    const basePath = themeOptions.basePath || `/`;
    const templatesPath = themeOptions.templatesPath || `src/templates`;
    const assetPath = themeOptions.assetPath || `content/assets`;
    const contentPath = themeOptions.contentPath || `content/pages`;
    const uploadsPath = themeOptions.uploadsPath || `content/uploads`;

    return {
        basePath,
        contentPath,
        assetPath,
        uploadsPath,
        templatesPath
    }
}