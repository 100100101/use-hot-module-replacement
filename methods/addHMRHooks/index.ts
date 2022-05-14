import useAccept from './useAccept'
import useDecline from './useDecline'
import useDispose from './useDispose'
import useRemoveDisposeHandler from './useRemoveDisposeHandler'
import useRequireAccept from './useRequireAccept'
const Module = require('module')
export default module => {
    const resolve = name => {
        return Module._resolveFilename(name, module)
    }
    const hot: any = {
        // private stuff
        _acceptedDependencies: {},
        _declinedDependencies: {},
        _selfAccepted: false,
        _selfDeclined: false,
        _disposeHandlers: [],
        // _main: hotCurrentChildModule !== moduleId,
        // Module API
        active: true,
        /*
          // TODO: Management API
          check: hotCheck,
          apply: hotApply,

          status: function(l) {
            if (!l) return hotStatus;
            hotStatusHandlers.push(l);
          },
          addStatusHandler: function(l) {
            hotStatusHandlers.push(l);
          },
          removeStatusHandler: function(l) {
            var idx = hotStatusHandlers.indexOf(l);
            if (idx >= 0) hotStatusHandlers.splice(idx, 1);
          }

          //inherit from previous dispose call
          data: hotCurrentModuleData[moduleId]
        */
    }
    const accept = useAccept({ hot, resolve })
    Object.assign(hot, {
        accept,
        decline: useDecline({ hot, resolve }),
        dispose: useDispose({ hot }),
        addDisposeHandler: useDispose({ hot }),
        removeDisposeHandler: useRemoveDisposeHandler({ hot }),
        requireAccept: useRequireAccept({ accept }),
    })
    module.hot = hot
}
