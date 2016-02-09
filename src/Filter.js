import { cloneElement, Component, Children } from 'react';
import * as actions from './actions/creators.js';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root.js';
import { INIT } from './constants';

import buildSelector from './selectors/buildSelector';

const isDom = instance => {
    return typeof instance.type !== 'function';
};

class Filter extends Component {

    constructor(props) {
        super(props);
        const {
            subjects = [],
            filterableCriteria = [],
            filterableCriteriaSortOptions = {},
            searchThreshold = .2,
            searchKeys = [],
            sortItems = [],
            middleware = [],
            initialState = {}
            } = props;

        const middlewares = [
            thunk, ...middleware
        ];

        const finalStore = applyMiddleware(...middlewares)(createStore);

        this.store = finalStore(
            combineReducers({
                filter: rootReducer
            }),
            {
                filter: {
                    subjects,
                    filterableCriteria,
                    filterableCriteriaSortOptions,
                    searchThreshold,
                    searchKeys,
                    sortItems,
                    ...initialState
                }
            }
        );

        this.store.dispatch({
            type: INIT
        });

        // bind action creators to the store
        this.actions = Object.keys(actions).reduce((prev, actionKey) => {
            prev[actionKey] = (...args) => this.store.dispatch(actions[actionKey](...args));
            return prev;
        }, {});

        // build selector based on props
        this.select = buildSelector(state => state.filter);

        // if there is a sort function, apply it
        if (sortItems.length && (typeof sortItems[0].fn === 'function')) {
            this.actions.applySort(sortItems[0]);
        }

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

    componentWillReceiveProps(nextProps) {
        // check if subjecsts are different
        if(nextProps.subjects !== this.props.subjects) {
            this.actions.updateSubjects(nextProps.subjects);
        }
    }

    render() {

        const { props, state } = this;
        const allProps = {
            ...props,
            ...state
        };

        const {
            children,
            collection,
            optionGroups,
            keyword,
            sortItems,
            appliedFilters,
            sortFn,
            currentPage
            } = allProps;

        const boundActions = this.actions;

        // can only have one child
        Children.only(children);
        // enforce that child component must be a react element
        if (isDom(children)) {
            throw new Error('child must be a react component, not a dom element');
        }

        return cloneElement(children, {
            ...boundActions,
            collection,
            optionGroups,
            keyword,
            appliedFilters,
            sortItems,
            sortFn,
            currentPage
        });
    }

}

export default Filter;
