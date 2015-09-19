# Redux Filter

Higher order component for filtering collection. 

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
    
Examples coming soon. 
