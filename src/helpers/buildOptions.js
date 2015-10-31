const filterFns = {};

let filterableCriteria;

function saveFn(attribute, key, fn) {
    filterFns[attribute + '__' + key ] = fn;
}

function accumulate(collection, value) {
    if(!collection[value]) {
        collection[value] = 0;
    }
    collection[value]++;
    return collection;
}

export function getFrequencyOfUniqueValues(attribute, items) {
    return valueMap(attribute, items, (prev, currentVal) => {
        if (currentVal === undefined) return prev;

        if(currentVal instanceof Array) {
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
    const { title, attribute, children } = configValue;
    const options = getFrequencyOfUniqueValues(attribute, items);
    // save functions
    Object.keys(options).forEach(key => {
        const fn = item => {
            if (item[attribute] instanceof Array) {
                return item[attribute].indexOf(key) > -1;
            }
            return item[attribute] === key;
        };
        saveFn(attribute, key, fn);
    });

    let keys = Object.keys(options);
    // keys might have a sort function
    if(typeof keySortFn === 'function') {
        keys = keySortFn(keys);
    }

    const result = {
        title,
        values: keys.map(key => {
            return {
                value: key,
                count: options[key],
                attribute: attribute
            };
        })
    };

    if (children) {
        result['children'] = children.map(child => uniqueGeneric(child, items));
    }

    return result;

}

function buildRangeFn(min, max, attribute) {
    return function(item) {
        return item[attribute] >= min && item[attribute] <= max;
    };
}

function find(arr, fn) {
    for(let i = 0, len = arr.length; i < len; i++) {

        if(fn(arr[i])) {
            return arr[i];
        }
    }
}

function within(min, max, num) {
    return num >= min && num <= max;
}

export function uniqueRanges(configValue, items, sortFn = null) {
    const {title, attribute, ranges} = configValue;

    let options = valueMap(attribute, items, (prev, currentValue) => {
        // find which range i falls in
        const foundRange = find(ranges, rangeObj => {
            const {min, max} = rangeObj.range;
            return within(min, max, currentValue)
        });
        accumulate(prev, foundRange.displayValue);
        return prev;
    });

    console.log(options);

    // loop over all ranges
    for(let i = 0, len = ranges.length; i < len; i++) {
        const { min, max } = ranges[i].range;
        const displayVal = ranges[i].displayValue;

        //loop over all items and find any with attribute within that range (inclusive)
        for(let j = 0, jlen = items.length; j < jlen; j++) {

            let attr = +items[j][attribute];
            // check if within range
            if (attr >= min && attr <= max) {
                if (!options[displayVal]) {
                    options[displayVal] = {
                        fn: buildRangeFn(min, max, attribute),
                        count: 0
                    };
                }
                options[displayVal].count++;
            }
        }
    }

    let values = Object.keys(options).map(key => {

        // save reference to this function for later
        saveFn(attribute, key, options[key].fn);

        return {
            value: key,
            count: options[key].count,
            attribute
        };
    });

    return {
        title,
        values
    };
}

function getUniqueValues(configValue, items, sortFn) {
    return configValue.ranges ?
    uniqueRanges(configValue, items, sortFn) :
    uniqueGeneric(configValue, items, sortFn);
}

export function buildOptionsList(items, criteria, sortOptions) {
    filterableCriteria = criteria;

    let optionGroups = filterableCriteria.map(criteria => {
        return getUniqueValues(criteria, items, sortOptions[criteria.type]);
    });

    return {
        optionGroups,
        filterFns
    };
}
