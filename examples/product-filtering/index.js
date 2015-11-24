import React, { Component } from 'react';
import { render } from 'react-dom';
import qs from 'qs';
import Filter from 'redux-filter';
import sweaters from './data.js';

const active = (appliedFilters, attribute, value) => {
    return appliedFilters[attribute] && (appliedFilters[attribute].indexOf(value) > -1);
};

class Filters extends Component {

    renderOptionGroup(group) {
        const { toggleFilter, appliedFilters } = this.props;
        return group.map((item, idx) => {
            const { attribute, value } = item;
            const isActive = active(appliedFilters, attribute, value);
            const style = {
                background: isActive ? 'yellow': 'white'
            };
            return <div key={idx} style={style} onClick={() => toggleFilter(attribute, value)}>
                {item.value}
            </div>;
        });

    }

    sortItems() {
        const { sortItems, applySort } = this.props;
        const handleSortChange = (e) => {
            if (!e.target.value) return;
            const idx = e.target.value;
            applySort(sortItems[idx]);
        };
        return <select onChange={(e) => handleSortChange(e)} >
            <option value="" disabled>Sort Functions</option>
            {sortItems.map((item, idx) => {
                return <option key={idx} value={idx}>{item.title}</option>;
            })}
        </select>;
    }

    render() {
        const { optionGroups, clearAllFilters } = this.props;
        const items = optionGroups.map((group, idx) => {
            const { title, values } = group;
            return <div key={idx}>
                <header>{title}</header>
                {this.renderOptionGroup((values))}
            </div>;
        });
        return <div className="filters">
            <h2>Sorts</h2>
            {this.sortItems()}
            <h2>Filters</h2>
            {items}
            <h2>Clears</h2>
            <button onClick={() => clearAllFilters() }>Clear All Filters</button>
        </div>;
    }
}

class Product extends Component {
    render() {
        const { color, type, price, size, designer, title } = this.props;
        const attributes = ['color', 'type', 'price', 'designer'];
        return <div className="product">
            <header>{title}</header>
            {attributes.map((attr, idx) => (
                <p key={idx}>{attr.toUpperCase()}: {this.props[attr]}</p>
            ))}
        </div>;
    }
}

const PER_PAGE = 10;

class App extends Component {

    renderProducts() {

        const { currentPage, collection } = this.props;
        const productsInView = collection.slice(
            (+currentPage * PER_PAGE),
            (+currentPage * PER_PAGE) + PER_PAGE
        );
        if (collection.length) {
            return productsInView.map((product, idx) => {
                return <Product key={idx} {...product} />;
            });
        } else {
            return <p>No Sweaters found.</p>;
        }

    }

    renderPager() {
        const { collection, goToPage } = this.props;
        // calc number of pages we'd need
        const numPages = Math.ceil(collection.length / PER_PAGE);
        const pagerItems = [];
        for(let i = 1; i < numPages; i++) {
            pagerItems.push(<a onClick={() => goToPage(i)}>{i}</a>);
        }
        return pagerItems;
    }

    render() {
        return <div className="product-filter">
            <Filters {...this.props} />
            <div className="pager">{this.renderPager()}</div>
            <div className="products">
                {this.renderProducts()}
            </div>
        </div>;
    }

}

const logger = store => next => action => {
    console.group(action.type);
    console.info('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    console.groupEnd(action.type);
    return result;
};

const filters = state => {
    if (!Object.keys(state.appliedFilters).length && !state.page) return '';
    return qs.stringify({
        appliedFilters: state.appliedFilters,
        page: state.page
    });
};

function hashURLFromState(state) {
    window.location.hash = `#!/?${filters(state)}`;
}

const getStateFromHash = () => {
    const filterString = window.location.hash.replace('#!/?', '');
    return qs.parse(filterString);
};

const urlhash = store => next => action => {

    // call next action
    const nextResult = next(action);

    // build url out of current state
    const state = store.getState();

    hashURLFromState(state);

    return nextResult;
};



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
    },
    sortItems: [
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
    ],
    middleware: [
         urlhash
    ],
    initialState: getStateFromHash()
};


render(
    <Filter {...config}>
        <App />
    </Filter>,
    document.getElementById('root')
);
