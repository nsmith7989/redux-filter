import React, { cloneElement, Component } from 'react';
import { bindActionCreators } from 'redux';
import createStoreFromSubjects from './store/index.js';
import * as actions from './actions/creators.js';
import filterFactory from './selectors/filter.js'


function buildSelector(searchKeys, searchThreshold) {
    // build filter selector
    const filter = filterFactory(searchKeys, searchThreshold);
    return function(state) {
        return {
            collection: filter(state),
            appliedFilters: state.appliedFilters,
            keyword: state.keywordSearch,
            optionGroups: state.optionGroups
        }
    }
}

// bind action creators to the store

class Filter extends Component {

    constructor(props) {
        super(props);
        const {
            subjects = [],
            filterableCriteria = [],
            filterableCriteriaSortOptions = {},
            searchThreshold = .2,
            searchKeys = []
            } = props;

        // instantiate here
        this.store = createStoreFromSubjects(subjects, {
            filterableCriteria, filterableCriteriaSortOptions
        });

        // bind action creators to the store
        this.actions = Object.keys(actions).reduce((prev, actionKey) => {
            prev[actionKey] = (...args) => this.store.dispatch(actions[actionKey](...args));
            return prev;
        }, {});

        // build selector based on props
        this.select = buildSelector(searchKeys, searchThreshold);

        // compute first state
        this.state = this.select(this.store.getState());

    }

    computeState() {
        const nextState = this.select(this.store.getState());
        this.setState(nextState);
    }

    componentWillMount() {
        // subscribe to the store
        this.store.subscribe(() => this.computeState());
    }

    render() {

        const { props, state } = this;
        const allProps = {
            ...props,
            ...state
        };

        const {
            children,
            dispatch,
            collection,
            optionGroups,
            keyword,
            appliedFilters } = allProps;

        const boundActions = this.actions;

        return cloneElement(children, {
            ...boundActions,
            collection,
            optionGroups,
            keyword,
            appliedFilters
        });

    }

}

export default Filter;

