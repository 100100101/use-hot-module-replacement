export declare namespace globalThis {
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
}
export type UseHotRequireReturn = {
    value: any
    // callback: (hotAcceptCallback: HotAcceptCallback) => HotAcceptCallback
    callback: any
}
export type UseHotRequire = (path: string) => UseHotRequireReturn
export type HotAcceptCallback = (module: any) => void
export declare const useHotRequire: UseHotRequire
// export = globalThis
// export default globalThis
// export as namespace globalThis
