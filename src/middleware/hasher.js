/**
 * Given a state, hash, or otherwise change the url
 * In the future, this will probably be replaced by a router
 * Side effect, changes window location hash
 * @param state
 */
function hashURLFromState(state) {

}

const urlhash = store => next => action => {

    // call next action
    const nextResult = next(action);

    /**
     * Components needed to rebuild state
     */
    // build url out of current state
    const state = store.getState();

    hashURLFromState(state);

    return nextResult;
};

export default urlhash;