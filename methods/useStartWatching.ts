import nodeWatch from 'node-watch'
import { THot } from '../types'
const Module = require('node:module')

// import { watch } from 'node:fs/promises'
// const ac = new AbortController()
// const { signal } = ac
// setTimeout(() => ac.abort(), 100000)
// try {
//     const watcher = watch(path, {
//         // signal
//         persistent: false,
//         recursive: false,
//     })
//     watching[path] = watcher
//     for await (const event of watcher) {
//         console.log('event', event, watcher, path)
//     }
// } catch (err) {
//     if (err.name === 'AbortError') return
//     throw err
// }
export default ({
    watching,
    collectDependencies,
    ignore,
    addHMRHooks,
    parents,
    doubleSaveDiscardMs,
}) => {
    let isDiscard = false
    const triggeredPaths: string[] = []
    return async path => {
        if (ignore(path)) return
        if (watching[path]) return

        const watchHandler = async (eventType, filename) => {
            if (doubleSaveDiscardMs > -1) {
                if (triggeredPaths.includes(path)) {
                    isDiscard = true
                    return
                }
                triggeredPaths.push(path)
                await new Promise(resolve =>
                    setTimeout(resolve, doubleSaveDiscardMs)
                )
                triggeredPaths.splice(triggeredPaths.indexOf(path), 1)
                if (triggeredPaths.length) return
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
                    const oldModuleHot: THot = oldModule.hot

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

                            const parentAcceptedModuleHot: THot =
                                parentAcceptedModule.hot

                            const childDisposeHandlers =
                                parentAcceptedModuleHot._childDisposeDependencies

                            for (const childDisposeHandler of Object.values(
                                childDisposeHandlers
                            )) {
                                if (typeof childDisposeHandler === 'function') {
                                    await childDisposeHandler()
                                }
                            }
                            parentAcceptedModuleHot._childDisposeDependencies =
                                {}

                            const acceptedDependency =
                                parentAcceptedModuleHot._acceptedDependencies[
                                    path
                                ]
                            acceptedDependency?.(path)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        }
        watching[path] = nodeWatch(path, { persistent: false }, watchHandler)
    }
}
