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
        active: true,
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
