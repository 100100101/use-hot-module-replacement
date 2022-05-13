declare namespace globalThis {
    interface NodeModule {
        hot: {
            active: any
            accept: any
            decline: any
            dispose: any
            addDisposeHandler: any
            removeDisposeHandler: any
            _acceptedDependencies: any
            _declinedDependencies: any
            _selfAccepted: any
            _selfDeclined: any
            _disposeHandlers: any
            [key: string]: any
        }
    }
    type UseHotRequireReturn = {
        value: any
        // callback: (hotAcceptCallback: HotAcceptCallback) => HotAcceptCallback
        callback: any
    }
    type UseHotRequire = (path: string) => UseHotRequireReturn
    type HotAcceptCallback = (module: any) => void
    declare const useHotRequire: UseHotRequire
    interface global {
        vm: any
    }
}
