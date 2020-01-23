const marked =  require('marked');

marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false
});

module.exports.getMarkedText = (text) => {
    return marked(text).replace(/\n$/, '');
}