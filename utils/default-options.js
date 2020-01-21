module.exports = themeOptions => {
    const basePath = themeOptions.basePath || `/`;
    const contentPath = themeOptions.contentPath || `content/pages`;
    const assetPath = themeOptions.assetPath || `content/assets`;
    const uploadsPath = themeOptions.uploadsPath || `content/uploads`;
    const locale =  themeOptions.locale || true;
    const airtable =  themeOptions.airtable || false;

    return {
        basePath,
        contentPath,
        assetPath,
        uploadsPath,
        locale,
        airtable
    }
}