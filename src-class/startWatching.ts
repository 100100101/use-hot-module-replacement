import { IHotModuleReplacement } from '../types'
const Module = require('module')
const watch = require('node-watch')
export default function (this: IHotModuleReplacement, path) {
    const ignoreRule = this.settings.ignoreRule
    if (ignoreRule) {
        const isIgnorePath = this.checkIsIgnorePath(path)
        if (isIgnorePath) return
    }
    const isModuleWatching = !!this.watching[path]
    if (isModuleWatching) return

    const moduleWatcher = watch(
        path,
        { persistent: false },
        (eventType, filename) => {
            const oldModule = require.cache[path]

            const deps: any = oldModule
                ? this.collectDependencies(oldModule)
                : []
            const reloaded = {}

            for (let d = 0; d < deps.length; ++d) {
                for (let l = 0; l < deps[d].length; ++l) {
                    const path = deps[d][l]
                    if (reloaded[path]) {
                        continue
                    }
                    reloaded[path] = true
                    const oldModule: any = require.cache[path]
                    if (oldModule.hot._disposeHandlers) {
                        oldModule.hot._disposeHandlers.forEach(h => h())
                    }
                    const newModule = new Module(path, oldModule.parent)
                    this.setHMRHooks(newModule)
                    try {
                        newModule.load(path)
                        require.cache[path] = newModule
                        const ps = this.parents[path]
                        for (const parentPath in ps) {
                            const parent: any = require.cache[parentPath]
                            if (parent.hot._acceptedDependencies[path]) {
                                // TODO: try/catch here?
                                parent.hot._acceptedDependencies[path](path)
                            }
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }
    )
    this.watching[path] = moduleWatcher
}
