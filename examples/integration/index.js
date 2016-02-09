import { createStore, combineReducers } from 'redux';
import { reducer as flterReducer, buildStore, filterActions, buildSelector } from 'redux-filter';
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

const store = buildStore(config);


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
]);

console.log(store.getState());

// call the actions from anything
let unsubscribe = store.subscribe(() => {
    console.log(store.getState());
});

store.dispatch(filterActions.goToPage(9));
store.dispatch(filterActions.toggleFilter('color', 'Red'));
store.dispatch(filterActions.toggleFilter('color', 'Blue'));

store.dispatch(filterActions.clearAllFilters());
