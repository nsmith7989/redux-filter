import React, { Component, render } from 'react';
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
        })

    }

    render() {
        const { optionGroups } = this.props;
        const items = optionGroups.map((group, idx) => {
            const { title, values } = group;
            return <div key={idx}>
                <header>{title}</header>
                {this.renderOptionGroup((values))}
            </div>
        });
        return <div className="filters">
            <h2>Filters</h2>
            {items}
        </div>
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
        </div>
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
                    <p>No Sweaters found.</p>
                }
            </div>
        </div>;
    }

}

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

    ]
};


render(
    <Filter {...config}>
        <App />
    </Filter>,
    document.getElementById('root')
);