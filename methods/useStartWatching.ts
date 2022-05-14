import nodeWatch from 'node-watch'
const Module = require('module')
const triggeredFilenames: string[] = []
let isDiscard = false
export default ({
        watching,
        collectDependencies,
        ignore,
        addHMRHooks,
        parents,
        doubleSaveDiscardMs,
    }) =>
    path => {
        if (ignore(path)) return
        if (watching[path]) return
        watching[path] = nodeWatch(
            path,
            { persistent: false },
            async (eventType, filename) => {
                if (doubleSaveDiscardMs > -1) {
                    if (triggeredFilenames.includes(filename)) {
                        isDiscard = true
                        return
                    }
                    triggeredFilenames.push(filename)
                    await new Promise(resolve =>
                        setTimeout(resolve, doubleSaveDiscardMs)
                    )
                    triggeredFilenames.splice(
                        triggeredFilenames.indexOf(filename),
                        1
                    )
                    if (triggeredFilenames.length) return
                    if (isDiscard) {
                        isDiscard = false
                        return
                    }
                }

                const oldModule = require.cache[path]
                const deps = oldModule ? collectDependencies(oldModule) : []
                const reloaded = {}

                for (let d = 0; d < deps.length; ++d) {
                    for (let l = 0; l < deps[d].length; ++l) {
                        const path = deps[d][l]
                        if (reloaded[path]) {
                            continue
                        }
                        reloaded[path] = true
                        const oldModule: any = require.cache[path]
                        const disposeHandlers = oldModule.hot._disposeHandlers
                        if (disposeHandlers) {
                            for (const disposeHandler of disposeHandlers) {
                                await disposeHandler()
                            }
                        }
                        const newModule = new Module(path, oldModule.parent)
                        addHMRHooks(newModule)
                        try {
                            newModule.load(path)
                            require.cache[path] = newModule
                            const ps = parents[path]
                            for (const parentPath in ps) {
                                const parent: any = require.cache[parentPath]
                                // TODO: try/catch here?
                                parent.hot._acceptedDependencies[path]?.(path)
                            }
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }
            }
        )
    }
