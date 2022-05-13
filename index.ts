// declare const Module: any
declare const module: any
import { UseHotRequire, UseHotRequireReturn } from './types/index.d'

const Module = require('module')
import addHMRHooks from './methods/addHMRHooks'
import useCollectDependencies from './methods/useCollectDependencies'
import useIgnore from './methods/useIgnore'
import useStartWatching from './methods/useStartWatching'
import use_load from './methods/use_load'
type Options = {
    ignore?: RegExp | ((path: string) => void)
}

export default (options: Options = {}) => {
    // TODO: use proxy here instead of just monkey-patching so all furure extensions are tracked automatically
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
    const ignore = useIgnore(options.ignore)
    const watching = {}
    const startWatching = useStartWatching({
        watching,
        collectDependencies,
        ignore,
        addHMRHooks,
        parents,
    })
    use_load({
        ignore,
        parents,
        startWatching,
    })
    // monkey-patch require
    // const originalRequire = Module.prototype.require
    // const originalCompile = Module.prototype._compile
    if (module.parent) {
        if (!module.parent.hot) {
            addHMRHooks(module.parent)
        }
    }

    const useHotRequire: UseHotRequire = (path: string) => {
        const fullPathRequiredFile = Module._resolveFilename(path)
        const givenCallbacks: any[] = []
        // const currentModule
        const result: UseHotRequireReturn = {
            value: require(fullPathRequiredFile),
            callback: hotAcceptCallback => {
                givenCallbacks.push(hotAcceptCallback)
            },
        }
        // console.log('fullPathRequiredFile:', fullPathRequiredFile)

        module.hot.accept(fullPathRequiredFile, async () => {
            let resolveModulePromise: any = null
            const modulePromise = new Promise(resolve => {
                resolveModulePromise = resolve
            })
            for (const givenCallback of givenCallbacks) {
                await givenCallback(modulePromise)
            }
            const module = require(fullPathRequiredFile)
            result.value = module
            resolveModulePromise(module)
        })
        return result
    }
    globalThis.__proto__.useHotRequire = useHotRequire
    // regexp to decide if module should be ignored; also can be a function accepting string and returning true/false
    // if foo.js or any files that foo.js depend on are modified this callback is invoked
    // by this time module cache entry for 'foo' already cleaned and module reloaded, requiring again is the easiest way of geting reference to new module. We need to assign it to local foo variable to make our local code in this file aware of it.
}
