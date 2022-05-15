const Module = require('node:module')
type RequireAcceptReturn = {
    value: any
    // callback: (hotAcceptCallback: HotAcceptCallback) => HotAcceptCallback
    callback: any
}
type RequireAccept = (moduleValue: any) => RequireAcceptReturn | undefined
const useRequireAccept = ({ accept }) => {
    const requireAccept: RequireAccept = (moduleValue: any) => {
        // const findedModuleFromCache = Object.values(require.cache).find(module => {
        //     const exports =
        //     if()
        //     const isEsModule = module.exports.
        // })
        const requireCache = Object.values(require.cache)

        console.log(
            'Module:',
            moduleValue,
            // requireCache,
            requireCache[0],
            requireCache[requireCache.length - 1]
        )

        const t = 1
        if (t === 1) return
        const fullPathRequiredFile = Module._resolveFilename('path')
        const givenCallbacks: any[] = []
        // const currentModule
        const result: RequireAcceptReturn = {
            value: require(fullPathRequiredFile),
            callback: hotAcceptCallback => {
                givenCallbacks.push(hotAcceptCallback)
            },
        }

        accept(fullPathRequiredFile, async () => {
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
    return requireAccept
}
export default useRequireAccept
