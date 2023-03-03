import { IHotModuleReplacement } from '../types'
const Module = require('node:module')
const originalExtensions = Module._extensions
export default function (this: IHotModuleReplacement) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    // const originalRequire = Module.prototype.require
    // const originalCompile = Module.prototype._compile
    Module._extensions = new Proxy(originalExtensions, {
        get(target, prop) {
            const requestedExtension = target[prop]
            return (module, filename) => {
                self.setHMRHooks(module)
                requestedExtension(module, filename)
            }
        },
    })
}
