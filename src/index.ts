// declare const Module: any
declare const module: any
import { UseHotModuleReplacementOptions } from '../types'

const Module = require('node:module')
import setHMRHooks from './setHMRHooks'
import useCollectDependencies from './useCollectDependencies'
import useIgnore from './useIgnore'
import useStartWatching from './useStartWatching'
import use_load from './use_load'
const defaultOptions = {
    doubleSaveDiscardMs: 600,
}
export default (options: UseHotModuleReplacementOptions) => {
    const settings = Object.assign(defaultOptions, options)
    const originalExtensions = Module._extensions
    Module._extensions = new Proxy(originalExtensions, {
        get(target, prop) {
            const requestedExtension = target[prop]
            return function (module, filename) {
                setHMRHooks(module)
                requestedExtension(module, filename)
            }
        },
    })
    const parents = {}
    global.parent_ = parents
    const collectDependencies = useCollectDependencies(parents)
    const ignore = useIgnore(settings.ignore)
    const doubleSaveDiscardMs = settings.doubleSaveDiscardMs
    const watching = {}
    const startWatching = useStartWatching({
        watching,
        collectDependencies,
        ignore,
        setHMRHooks,
        parents,
        doubleSaveDiscardMs,
    })
    use_load({
        ignore,
        parents,
        startWatching,
        setHMRHooks,
    })

    const setStartHMRHooks = module => {
        const moduleParent = module.parent
        if (!moduleParent) {
            return
        }
        if (!moduleParent.hot) {
            setHMRHooks(moduleParent)
        }
        setStartHMRHooks(moduleParent)
    }

    setStartHMRHooks(module)
}
