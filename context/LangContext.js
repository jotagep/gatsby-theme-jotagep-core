import {createContext} from 'react'

const LangContext = createContext(null)

export const LangProvider = LangContext.Provider
export default LangContext;