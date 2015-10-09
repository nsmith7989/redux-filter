export default {
    filterableCriteria: [{
        title: 'Type',
        attribute: 'type'
    }],
    subjects: [{title: 'foo'}, {title: 'bar'}],
    sortItems: [
        {
            title: 'Sort Type',
            fn: (items) => {
                return [...items].sort((a, b) => a.type - b.type);
            }
        }
    ],

}