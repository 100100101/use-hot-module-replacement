const Module = require('node:module')
type RequireAcceptReturn = {
    value: any
    // callback: (hotAcceptCallback: HotAcceptCallback) => HotAcceptCallback
    callback: any
}
type RequireAccept = (path: string) => RequireAcceptReturn
const useRequireAccept = ({ accept }) => {
    const requireAccept: RequireAccept = (path: string) => {
        const fullPathRequiredFile = Module._resolveFilename(path)
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
