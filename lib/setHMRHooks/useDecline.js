"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ hot, resolve }) => dep => {
    if (typeof dep === 'undefined')
        hot._selfDeclined = true;
    else if (typeof dep === 'object')
        for (let i = 0; i < dep.length; i++)
            hot._declinedDependencies[resolve(dep[i])] = true;
    else
        hot._declinedDependencies[resolve(dep)] = true;
};
//# sourceMappingURL=useDecline.js.map