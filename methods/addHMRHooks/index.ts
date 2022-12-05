import useAccept from './useAccept'
import useDecline from './useDecline'
import useDispose from './useDispose'
import useRemoveDisposeHandler from './useRemoveDisposeHandler'
import useRequireAccept from './useRequireAccept'
import useAddChildrenDisposeDependency from './useAddChildrenDisposeDependency'
import { THot } from '../../types'
const Module = require('node:module')
export default module => {
    const resolve = name => {
        return Module._resolveFilename(name, module)
    }
    const hot = {
        _acceptedDependencies: {},
        _declinedDependencies: {},
        _selfAccepted: false,
        _selfDeclined: false,
        _disposeHandlers: [],
        _childDisposeDependencies: {},
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
    } as Partial<THot>
    const accept = useAccept({ hot, resolve })
    const dispose = useDispose({ hot, module })
    Object.assign(hot, {
        accept,
        decline: useDecline({ hot, resolve }),
        dispose,
        removeDisposeHandler: useRemoveDisposeHandler({ hot }),
        requireAccept: useRequireAccept({ accept }),
        addChildrenDisposeDependency: useAddChildrenDisposeDependency({ hot }),
    })
    module.hot = hot
}
