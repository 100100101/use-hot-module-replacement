declare const module: any
export declare namespace globalThis {
    interface NodeModule {
        hot: {
            active: any
            accept: any
            requireAccept: any
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
export type UseHotModuleReplacementOptions = {
    ignore?: RegExp | ((path: string) => void)
    doubleSaveDiscardMs?: number | -1
}
// export = globalThis
// export default globalThis
// export as namespace globalThis
