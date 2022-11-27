/* eslint-disable @typescript-eslint/no-empty-interface */
declare namespace NHotModuleReplacement {
    interface Module {
        hot?: import('./').THot | undefined
    }
}

declare namespace NodeJS {
    interface Module extends NHotModuleReplacement.Module {}
}
