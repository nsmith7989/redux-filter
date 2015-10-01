/**
 * Given a state, hash, or otherwise change the url
 * In the future, this will probably be replaced by a router
 * Side effect, changes window location hash
 * @param state
 */
function hashURLFromState(state) {
    // todo implement state hashing of applied filters
}

const filters = state => {
    if (!state.appliedFilters.size) return '';
    return state.appliedFilters.reduce((acc, set, attribute) => {
        for(let val of set.values()) {
            acc.push('filter=' + encodeURIComponent(attribute) + '__' + encodeURIComponent(val));
        }
        return acc;
    }, []).join('&');

};

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