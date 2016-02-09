import { createStore, combineReducers } from 'redux';
import { reducer as filterReducer, filterActions, buildSelector } from 'redux-filter';
import sweaters from './data.js';


const config = {
    subjects: sweaters,
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
};

const store = createStore(
    combineReducers({
        filter: filterReducer
    }),
    {
        filter: config
    }
);

// important to intialize
store.dispatch(filterActions.init());


// include resolver that points where the filter state lives withing the state tree
const selector = buildSelector(state => state.filter);

// call the actions from anything
let unsubscribe = store.subscribe(() => {
    console.log(selector(store.getState()));
});

store.dispatch(filterActions.goToPage(9));
store.dispatch(filterActions.toggleFilter('color', 'Red'));
store.dispatch(filterActions.toggleFilter('color', 'Blue'));

store.dispatch(filterActions.clearAllFilters());
