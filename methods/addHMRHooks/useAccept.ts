export default ({ hot, resolve }) =>
    (dep, callback: any) => {
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
