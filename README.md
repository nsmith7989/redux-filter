# Redux Filter

Higher Order React Component for filtering (and sorting) a collection of items. This is especially useful in product filters that
 mimic the sorting/filtering behavior of Amazon or Best Buy.  

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

### Actions

- `clearFilters` `{function(filterAttribute{string}):void}`. Clear all filters of a given type. 

- `keywordSearch` `{function(string):void}`. Search the collection by keyword. 

- `toggleFilter` `{function(filterAttribute, filterValue):void}` Toggle a filter by attribute and value.
If a filter of that attribute is not applied it will be added. If a filter of that attribute was applied it will be removed.

- `toggleOnly` `{function(filterAttribute, filterValue):void}` Remove all other filters of this attribute, except the one applied.
Useful in select box or radio button scenarios. 

## `<Filter />` props

## Todo

- [ ] Sorting
- [ ] Paging
