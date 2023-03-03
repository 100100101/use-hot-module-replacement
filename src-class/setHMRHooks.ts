import { HotModuleReplacement } from './'
const Module = require('node:module')
export default function (module) {
    const resolve = name => {
        return Module._resolveFilename(name, module)
    }
    // copied directly from webpack HMR
    // https://github.com/webpack/webpack/blob/0257f6c6e41255cf26230c099fb90140f1f0e0bb/lib/HotModuleReplacement.runtime.js#L77
    const hot = {
        // private stuff
        _acceptedDependencies: {},
        _declinedDependencies: {},
        _selfAccepted: false,
        _selfDeclined: false,
        _disposeHandlers: [],
        // _main: hotCurrentChildModule !== moduleId,

        // Module API
        active: true,
        accept: function (dep, callback) {
            if (typeof dep === 'undefined') hot._selfAccepted = true
            else if (typeof dep === 'function') hot._selfAccepted = dep
            else if (typeof dep === 'object')
                for (let i = 0; i < dep.length; i++)
                    hot._acceptedDependencies[resolve(dep[i])] =
                        callback ||
                        function () {
                            //
                        }
            else
                hot._acceptedDependencies[resolve(dep)] =
                    callback ||
                    function () {
                        //
                    }
        },
        decline: function (dep) {
            if (typeof dep === 'undefined') hot._selfDeclined = true
            else if (typeof dep === 'object')
                for (let i = 0; i < dep.length; i++)
                    hot._declinedDependencies[resolve(dep[i])] = true
            else hot._declinedDependencies[resolve(dep)] = true
        },
        dispose: function (callback) {
            const _disposeHandlers: any = hot._disposeHandlers
            _disposeHandlers.push(callback)
        },
        addDisposeHandler: function (callback) {
            const _disposeHandlers: any = hot._disposeHandlers
            _disposeHandlers.push(callback)
        },
        removeDisposeHandler: function (callback) {
            const _disposeHandlers: any = hot._disposeHandlers
            const idx = _disposeHandlers.indexOf(callback)
            if (idx >= 0) _disposeHandlers.splice(idx, 1)
        },
    }
    module.hot = hot
}
