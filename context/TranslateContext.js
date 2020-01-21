import {createContext} from 'react'

const TranslateContext = createContext(null)

export const TranslateProvider = TranslateContext.Provider
export default TranslateContext;