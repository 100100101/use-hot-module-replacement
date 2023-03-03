import { IHotModuleReplacement } from '../types'
import checkIsBuiltinModule from './checkIsBuiltinModule'
export default function (this: IHotModuleReplacement, path) {
    if (checkIsBuiltinModule(path)) {
        return true
    }
    const ignoreRule = this.settings.ignoreRule
    if (typeof ignoreRule === 'function') {
        return ignoreRule(path)
    }
    if (ignoreRule instanceof RegExp) {
        return !!ignoreRule.exec(path)
    }
}
