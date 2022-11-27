// declare const Module: any
declare const module: any
import { UseHotModuleReplacementOptions } from './types'

const Module = require('node:module')
import addHMRHooks from './methods/addHMRHooks'
import useCollectDependencies from './methods/useCollectDependencies'
import useIgnore from './methods/useIgnore'
import useStartWatching from './methods/useStartWatching'
import use_load from './methods/use_load'
const defaultOptions = {
    doubleSaveDiscardMs: 600,
}
export default (options: UseHotModuleReplacementOptions) => {
    const settings = Object.assign(defaultOptions, options)
    // TODO: use proxy here instead of just monkey-patching so all future extensions are tracked automatically
    const savedExtensions = Module._extensions
    const _extensions = {}
    Object.keys(savedExtensions).forEach(extension => {
        _extensions[extension] = function (module, filename) {
            addHMRHooks(module)
            savedExtensions[extension](module, filename)
        }
    })
    Module._extensions = _extensions
    const parents = {}
    const collectDependencies = useCollectDependencies(parents)
    const ignore = useIgnore(settings.ignore)
    const doubleSaveDiscardMs = settings.doubleSaveDiscardMs
    const watching = {}
    const startWatching = useStartWatching({
        watching,
        collectDependencies,
        ignore,
        addHMRHooks,
        parents,
        doubleSaveDiscardMs,
    })
    use_load({
        ignore,
        parents,
        startWatching,
    })
    // monkey-patch require
    // const originalRequire = Module.prototype.require
    // const originalCompile = Module.prototype._compile
    if (module.parent && !module.parent.hot) {
        addHMRHooks(module.parent)
    }

    // regexp to decide if module should be ignored; also can be a function accepting string and returning true/false
    // if foo.js or any files that foo.js depend on are modified this callback is invoked
    // by this time module cache entry for 'foo' already cleaned and module reloaded, requiring again is the easiest way of geting reference to new module. We need to assign it to local foo variable to make our local code in this file aware of it.
}
