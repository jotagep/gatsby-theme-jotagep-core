const React = require("react");

const { LangProvider } = require('./context/LangContext');
const { GlobalProvider } = require('./context/GlobalContext');

const LangWrapper = require('./context/LangWrapper').default;

exports.wrapRootElement = ({ element }, themeOptions) => {
  return (
    <LangProvider options={themeOptions}>
      {element}
    </LangProvider>
  );
}

exports.wrapPageElement = ({ element,  props }) => {
  const { pageContext } = props;

  const initialGlobalValues = {
    ...pageContext.seo && {seo: pageContext.seo},
    ...pageContext.url && { url: pageContext.url },
    ...pageContext.pageUrl && { pageUrl: pageContext.pageUrl }
  }

  return (
    <LangWrapper language={pageContext.language} >
      <GlobalProvider value={initialGlobalValues}>
        {element}
      </GlobalProvider>
    </LangWrapper>
  );
}

