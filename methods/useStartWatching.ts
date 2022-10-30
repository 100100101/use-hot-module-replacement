import nodeWatch from 'node-watch'
import { Hot } from '../types'
const Module = require('node:module')
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
                if (!oldModule) return
                const deps = collectDependencies(oldModule)
                const reloaded = {}

                for (let d = 0; d < deps.length; ++d) {
                    for (let l = 0; l < deps[d].length; ++l) {
                        const path = deps[d][l]

                        if (reloaded[path]) {
                            continue
                        }
                        reloaded[path] = true
                        const oldModule: any = require.cache[path]
                        const oldModuleHot: Hot = oldModule.hot

                        const disposeHandlers = oldModuleHot._disposeHandlers

                        for (const disposeHandler of disposeHandlers) {
                            await disposeHandler()
                        }
                        const newModule = new Module(path, oldModule.parent)
                        addHMRHooks(newModule)

                        try {
                            newModule.load(path)
                            require.cache[path] = newModule
                            const parentAcceptedDependencies = parents[path]

                            for (const parentPath in parentAcceptedDependencies) {
                                const parentAcceptedModule: any =
                                    require.cache[parentPath]

                                const parentAcceptedModuleHot: Hot =
                                    parentAcceptedModule.hot

                                const childDisposeHandlers =
                                    parentAcceptedModuleHot._childDisposeDependencies

                                for (const childDisposeHandler of Object.values(
                                    childDisposeHandlers
                                )) {
                                    if (
                                        typeof childDisposeHandler ===
                                        'function'
                                    ) {
                                        await childDisposeHandler()
                                    }
                                }
                                parentAcceptedModuleHot._childDisposeDependencies =
                                    {}

                                const acceptedDependency =
                                    parentAcceptedModuleHot
                                        ._acceptedDependencies[path]
                                acceptedDependency?.(path)
                            }
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }
            }
        )
    }
