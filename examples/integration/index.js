import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import Filter, { reducer as flterReducer, filterActions, buildInitialState, buildSelector } from 'redux-filter';
import sweaters from './data.js';

// build out initial state
const initialState = buildInitialState({
    subjectsCollection: sweaters,
    filterableCriteria: [
        {
            title: 'Sweater Type',
            attribute: 'type'
        },
        {
            title: 'Color',
            attribute: 'color'
        },
        {
            title: 'Size',
            attribute: 'size'
        },
        {
            title: 'Designer',
            attribute: 'designer'
        },
        {
            title: 'Retail Price',
            attribute: 'price',
            ranges: [
                {
                    displayValue: 'Up - $49.99',
                    range: {
                        min: 0,
                        max: 49.99
                    }
                },
                {
                    displayValue: '$50.00 - $99.99',
                    range: {
                        min: 50.00,
                        max: 99.99
                    }
                }
            ]
        }
    ],
    filterableCriteriaSortOptions: {
        type: (items) => [...items].sort(),
        color: (items) => [...items].sort()
    }
});



// create an unconnected redux store
const store = createStore(combineReducers({
    filterState: flterReducer
}),
// filter state can exist anywhere on the state tree. You will need to pass a resolver to the selector
{filterState: initialState});

// create a selector with config options
// including a resolver that points where the filter state lives withing the state tree
const selector = buildSelector([], .6, [
    {
        title: 'Price - Lowest to Highest',
        fn: (items) => {
            return [...items].sort((a, b) => a.price - b.price);
        }
    },
    {
        title: 'Price - Highest to Lowers',
        fn: (items) => {
            return [...items].sort((a, b) => b.price - a.price);
        }
    }
], state => state.filterState);


// call the actions from anything
let unsubscribe = store.subscribe(() => {
    console.log(selector(store.getState()));
});

store.dispatch(filterActions.goToPage(9));
store.dispatch(filterActions.toggleFilter('color', 'Red'));
store.dispatch(filterActions.toggleFilter('color', 'Blue'));

store.dispatch(filterActions.clearAllFilters());
