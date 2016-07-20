import flattenRecursive, {recurseLevel} from './flattenRecursive.js';

function saveFn(attribute, key, fn) {
    return {
        [`${attribute}__${key}`]: fn
    };
}

function accumulate(collection, value) {
    if (!collection[value]) {
        collection[value] = 0;
    }
    collection[value]++;
    return collection;
}

export function getFrequencyOfUniqueValues(attribute, items) {
    return valueMap(attribute, items, (prev, currentVal) => {
        if (currentVal === undefined)
            return prev;

        if (currentVal instanceof Array) {
            currentVal.forEach(val => {
                prev = accumulate(prev, val);
            });
        } else {
            prev = accumulate(prev, currentVal);
        }
        return prev;
    });
}

function valueMap(attribute, items, fn) {
    return items.reduce((prev, currentItem) => {
        return fn(prev, currentItem[attribute]);
    }, {});
}

export function uniqueGeneric(configValue, items, keySortFn = null) {
    const {title, attribute} = configValue;
    const options = getFrequencyOfUniqueValues(attribute, items);
    const filterFns = Object.keys(options).reduce((acc, key) => {
        const fn = item => {
            if (item[attribute]instanceof Array) {
                return item[attribute].indexOf(key) > -1;
            }
            return item[attribute] === key;
        };
        return {
            ...acc,
            ...saveFn(attribute, key, fn)
        };
    }, {});

    let keys = Object.keys(options);
    // keys might have a sort function
    if (typeof keySortFn === 'function') {
        keys = keySortFn(keys);
    }

    return {
        filterFns,
        values: {
            title,
            values: keys.map(key => {
                return {value: key, count: options[key], attribute: attribute};
            })
        }
    };

}

function buildRangeFn(min, max, attribute) {
    return function(item) {
        return item[attribute] >= min && item[attribute] <= max;
    };
}

function find(arr, fn) {
    for (let i = 0, len = arr.length; i < len; i++) {

        if (fn(arr[i])) {
            return arr[i];
        }
    }
}

function within(min, max, num) {
    return num >= min && num <= max;
}

export function uniqueRanges(configValue, items, sortFn = null) {
    const {title, attribute, ranges} = configValue;
    let filterFns = {};

    let options = valueMap(attribute, items, (prev, currentValue) => {
        // find which range i falls in
        const foundRange = find(ranges, rangeObj => {
            const {min, max} = rangeObj.range;
            return within(min, max, currentValue);
        });

        // if we did not find a range that matches, bail
        if (!foundRange) {
            return prev;
        }

        const {min, max} = foundRange.range;
        // build range fn
        filterFns = {
            ...filterFns,
            ...saveFn(attribute, foundRange.displayValue, buildRangeFn(min, max, attribute))
        };

        accumulate(prev, foundRange.displayValue);
        return prev;
    });

    let keys = Object.keys(options);
    if (typeof sortFn === 'function') {
        keys = sortFn(keys);
    }

    return {
        filterFns,
        values: {
            title,
            values: keys.map(key => {
                return {count: options[key], attribute, value: key};
            })
        }
    };

}

export function uniqueObject(configValue, items, sortFn) {
    const {
        attribute,
        title,
        id,
        attributeDisplayValue = 'title'
    } = configValue;

    let {values, filterFns} = flattenRecursive(attribute, items, id, saveFn, attributeDisplayValue);

    if (typeof sortFn === 'function') {

        values = recurseLevel(values, 'children', sortFn);
    }

    return {
        filterFns,
        values: {
            title,
            values
        }
    };

}

function getUniqueValues(configValue, items, sortFn) {
    if (configValue.ranges) {
        return uniqueRanges(configValue, items, sortFn);
    }
    if (configValue.hierarchy) {
        return uniqueObject(configValue, items, sortFn);
    }
    return uniqueGeneric(configValue, items, sortFn);
}

export function buildOptionsList(items, criteria, sortOptions) {

    return criteria.reduce((acc, crit) => {

        const {values, filterFns} = getUniqueValues(crit, items, sortOptions[crit.attribute]);

        return {
            optionGroups: (acc.optionGroups || []).concat(values),
            filterFns: {
                ...acc.filterFns,
                ...filterFns
            }
        };

    }, {});

}
