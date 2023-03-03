export default ({ hot }) =>
    callback => {
        hot._beforeUpdateHandlers.push(callback)
    }
