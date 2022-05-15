import { Accept } from 'use-hot-module-replacement/types'
export default ({ hot, resolve }) => {
    const accept: Accept = (dep, callback) => {
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
    }
    return accept
}
