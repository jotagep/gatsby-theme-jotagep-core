const React = require("react");

const { LangProvider } = require('./context/LangContext');

exports.wrapRootElement = ({ element }, themeOptions) => {
  const { dictionaryConstants } = themeOptions;
  return (
    <LangProvider dictionary={dictionaryConstants}>
      {element}
    </LangProvider>
  );
}