const React = require("react");

const { LangProvider } = require('./context/LangContext');

exports.wrapRootElement = ({ element }, themeOptions) => {
  return (
    <LangProvider options={themeOptions}>
      {element}
    </LangProvider>
  );
}