export default ({ hot }) =>
    callback => {
        hot._disposeHandlers.push(callback)
    }
