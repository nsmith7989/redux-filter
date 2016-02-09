# Redux Filter
[![Build Status](https://travis-ci.org/nsmith7989/redux-filter.svg?branch=master)](https://travis-ci.org/nsmith7989/redux-filter)
[![Coverage Status](https://coveralls.io/repos/nsmith7989/redux-filter/badge.svg?branch=master&service=github)](https://coveralls.io/github/nsmith7989/redux-filter?branch=master)

Higher Order React Component for filtering (and sorting) a collection of items. This is especially useful in product filters that
 mimic the sorting/filtering behavior of Amazon or Best Buy. See [the Sweater Example](https://github.com/nsmith7989/redux-filter/tree/master/examples/product-filtering).

## Usage - With Existing Redux Store

### Store and Reducer Setup

        import {createStore, combineReducers} from 'redux';

        import { reducer as filterReducer, filterActions } from 'redux-filter';

        // 1. Pick a mount point where your filter state will live.
        const reducers = {
            // ... your other reducers here
            filters: filterReducer
        };

        const reducer = combineReducers(reducers);

        // 2. create your store, passing in some initial state at the same mount point
        const store = createStore(
            reducer,
            filters: {

              // things that are filtered
              subjects: window.SUBJECTS,

              // attributes that you filter.
              // Component will return a unique list of attributes for each filterableCriteria
              filterableCriteria: [
                  {
                      title: 'Filter By Practice Area',
                      attribute: 'practices'
                  },
                  {
                      title: 'Filter Alphabetically',
                      attribute: 'initial'
                  }
              ],

              // keys on each subject that will be searched on
              searchKeys: ['title', 'subhead', 'practices'],

              // if you need to order the filterableCriteria output
              filterableCriteriaSortOptions: {
                  tags: items => [...items].sort()
              }
            }
        );

        // 3. *IMPORTANT* Dispatch the init action
        store.dispatch(filterActions.init());

### Selector

Build a selector for accessing your filter state. Pass in a function that resolves your filter state form the full state tree

        import { buildSelector } from 'redux-filter';
        const selector = buildSelector(state => state.filters);

        // use when getting filter state
        const filterState = selector(store.getState());

 See [results](#results) for what is returned form the filter selector


## Usage - Component

Wrap filter App in `<Filter>`, passing in config options as props to `<Filter>`. The component will handle the filter
 state of your application and expose actions to change filters and keyword searches.


    import React from 'react';
    import Filter from 'redux-filter';
    import App from './components/App';

    const config = {

      // things that are filtered
      subjects: window.SUBJECTS,

      // attributes that you filter.
      // Component will return a unique list of attributes for each filterableCriteria
      filterableCriteria: [
          {
              title: 'Filter By Practice Area',
              attribute: 'practices'
          },
          {
              title: 'Filter Alphabetically',
              attribute: 'initial'
          }
      ],

      // keys on each subject that will be searched on
      searchKeys: ['title', 'subhead', 'practices'],

      // if you need to order the filterableCriteria output
      filterableCriteriaSortOptions: {
          tags: items => [...items].sort()
      }
    };

    // render as usual, passing in config to <Filter>
    React.render(<Filter {...config}>
            <App />
        </Filter>,
        document.getElementById('team-filter-root')
    );

`<Filters />` will inject the following `props` into the child component:

### Results
- `collection` `{Array.<Object>}`. The sorted/filtered list of subjects after filters have been applied.  

- `keyword` `{string}`. The currently applied search keyword

- `optionGroups` `{Array.<Object>}`. Unique values of the attributes from subjects taken from the `filterableCriteria` option.
It also `count`s the number of subjects that meet the attribute.

- `currentPage` `{Number}`. Current page after calling `goToPage`. NOTE: if a filter is applied `currentPage` will be set to 1.

Example:


    {
        title: "Sweater Type",
        values: [
            {
                value: "Cashmere",
                count: 69,
                attribute: "type"
            },
            {
                value: "V-Neck",
                count: 57,
                attribute: "type"
            },
            {
                value: "Cardigans",
                count: 59,
                attribute: "type"
            },
            {
                value: "Crew and Scoop",
                count: 54,
                attribute: "type"
            },
            {
                value: "Cowl & Turtleneck",
                count: 61,
                attribute: "type"
            }
        ]
    }



### Actions

- `init` `{function(void):void}`. Initialize the filter state. MUST be called after store creation if using with an existing redux store. 

- `clearFilters` `{function(filterAttribute{string}):void}`. Clear all filters of a given type.

- `keywordSearch` `{function(string):void}`. Search the collection by keyword.

- `toggleFilter` `{function(filterAttribute, filterValue):void}` Toggle a filter by attribute and value.
If a filter of that attribute is not applied it will be added. If a filter of that attribute was applied it will be removed.

- `toggleOnly` `{function(filterAttribute, filterValue):void}` Remove all other filters of this attribute, except the one applied.
Useful in select box or radio button scenarios.

- `goToPage` `{function(pageNum):void}`. Set the currentPage to `pageNum`

## `<Filter />` props or InitialState passed to a redux store

### `subjects` `{Array<Object>}`
 Default: `[]`

 Things that will be filtered. After running through the filtering/sorting logic, `subjects` becomes `collection`.

### `filterableCriteria` `{Array<Object>}`
Default: `[]`

Attributes on subjects that you want to filter. Each object in this array will build up a unique list of properties based
on `subjects` and inject as `optionGroups` into your component. See the example under `optionGroups` for example of output

Each criteria can he marked as `hierarchical` which will trigger hierarchical `optionGroups`. See `examples/hiearchy-filter`

### `filterableCriteriaSortOptions` `{Object.<string, function>}`
Default: `{}`

Object of callback functions used to order `optionGroups`

To order the sweater `type`, for example:

    filterableCriteriaSortOptions: {
        type: (items) => [...items].sort()
    }

### `sortItems` `{Array.<Object>}`
Default: `[]`

Sort functions to be applied to subjects *after* filtered. Usually this is 'Sort by Price - Lowest to Highest' or
similar. The first object will be applied as the initial sort function.

### `searchThreshold` `{number} 0 - 1`
 Default: `.2`

 If using keyword search:
 At what point does the search keyword search algorithm give up.
 A threshold of 0.0 requires a perfect match (of both letters and location),
 a threshold of 1.0 would match anything.

### `searchKeys` `{Array.<string>}`
Default: `[]`

Attributes on each subject that are searched with the keyword search.

### `middleware` `{Array.<function>}`
Default: `[]`

Functions that will serve as arbitrary [Redux Middleware](http://rackt.github.io/redux/docs/advanced/Middleware.html).

### `initialState` `{Object}`
Default: `{}`

Start the filter with some initial state. Usually this will be restoring state that was serialized and stored from middleware.
See the examples folder for a demonstration on restoring state from a url hash.

## Todo

- [x] Paging
