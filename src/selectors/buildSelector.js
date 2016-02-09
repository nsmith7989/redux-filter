import { collection } from './filter.js';

export default function buildSelector(stateResolver = state => state) {
    return function mapStateToProps(state) {

        const result = {
            collection: collection(stateResolver(state)),
            optionGroups: stateResolver(state).optionGroups,
            appliedFilters: stateResolver(state).appliedFilters,
            keyword: stateResolver(state).keywordSearch,
            sortFn: stateResolver(state).sortFn,
            currentPage: stateResolver(state).page
        };
    
        return result;
    };
}
