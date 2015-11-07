import React, { Component } from 'react';
import { render } from 'react-dom';
import qs from 'qs';
import Filter from 'redux-filter';

import data from './data.json';

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

    renderRecurse(children) {
        const { toggleFilter, appliedFilters } = this.props;
        return <ul>
            {children.map(child => {
                const { value, count, attribute } = child;
                const style = active(appliedFilters, attribute, value) ? {
                    background: 'yellow'
                } : {};
                return <li>
                    <div style={style} onClick={() => toggleFilter(attribute, value)} >{value} ({count})</div>
                    {child.children && this.renderRecurse(child.children)}
                </li>;
            })}
        </ul>;
    }

    renderTopLevel(topObj) {
        const { value, children } = topObj;
        return <div>
            <header>{value}</header>
            {this.renderRecurse(children)}
        </div>;
    }
    render() {
        const { optionGroups } = this.props;
        // so there is only one option group
        const items = optionGroups[0].values.map(item => this.renderTopLevel(item));

        return <div className="filters">{items}</div>;
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

class App extends Component {

    render() {
        const {collection} = this.props;
        return <div className="product-filter">
            <Filters {...this.props} />
            <div className="products">
                {
                    collection.length ?
                    collection.map((product, idx) => <Product key={idx} {...product} />) :
                    <p>No subjects found.</p>
                }
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
    if (!Object.keys(state.appliedFilters).length) return '';
    return qs.stringify({
        appliedFilters: state.appliedFilters
    });
};

function hashURLFromState(state) {
    window.location.hash = `#!/?${filters(state)}`;
}

const getStateFromHash = () => {
    const filterString = window.location.hash.replace('#!/?', '');
    return qs.parse(filterString)
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
    subjects: data,
    filterableCriteria: [
        {
            title: 'attributes',
            attribute: 'filterableCriteria',
            hierarchy: true,
            id: 'content_id',
            attributeDisplayValue: 'title'
        }
    ],
    middleware: [
        logger, urlhash
    ],
    initialState: getStateFromHash()
};


render(
    <Filter {...config}>
        <App />
    </Filter>,
    document.getElementById('root')
);
