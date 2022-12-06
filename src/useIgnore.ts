import checkIsBuiltinModule from './checkIsBuiltinModule'
export default ignoreRule => path => {
    if (checkIsBuiltinModule(path)) {
        return true
    }
    if (typeof ignoreRule === 'function') {
        return ignoreRule(path)
    }
    if (ignoreRule instanceof RegExp) {
        return !!ignoreRule.exec(path)
    }
}
