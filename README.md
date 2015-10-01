# Redux Filter

Higher Order React Component for filtering (and sorting) a collection of items. This is especially useful in product filters that
 mimic the sorting/filtering behavior of Amazon or Best Buy. See [the Sweater Example](https://github.com/nsmith7989/redux-filter/tree/master/examples/product-filtering).

## Usage

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

- `clearFilters` `{function(filterAttribute{string}):void}`. Clear all filters of a given type. 

- `keywordSearch` `{function(string):void}`. Search the collection by keyword. 

- `toggleFilter` `{function(filterAttribute, filterValue):void}` Toggle a filter by attribute and value.
If a filter of that attribute is not applied it will be added. If a filter of that attribute was applied it will be removed.

- `toggleOnly` `{function(filterAttribute, filterValue):void}` Remove all other filters of this attribute, except the one applied.
Useful in select box or radio button scenarios. 

## `<Filter />` props

### `subjects` `{Array<Object>}`
 Default: `[]`
 
 Things that will be filtered. After running through the filtering/sorting logic, `subjects` becomes `collection`.
 
### `filterableCriteria` `{Array<Object>}`
Default: `[]`

Attributes on subjects that you want to filter. Each object in this array will build up a unique list of properties based
on `subjects` and inject as `optionGroups` into your component. See the example under `optionGroups` for example of output
 
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

## Todo

- [ ] Paging
