/**
 * Logger middleware. Logs the action and the resulting state to the console
 * @param store
 */
const logger = store => next => action => {
    console.group(action.type);
    console.info('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    console.groupEnd(action.type);
    return result;
};

export default logger;