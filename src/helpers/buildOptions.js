const filterFns = {};

let filterableCriteria, filterableCriteriaSortOptions;

function saveFn(attribute, key, fn) {
    filterFns[attribute + '__' + key ] = fn;
}

function uniqueGeneric(configValue, items) {
    const {title, attribute} = configValue;
    let options = {};

    // we do different things based on whether its a multiple or not
    let itemInMultiple = false;

    const addOption = attr => {
        if (!options[attr]) {
            options[attr] = 0;
        }
        options[attr]++;
    };

    for(let i = 0, len = items.length; i < len; i++) {
        let attr = items[i][attribute];

        if (!attr) continue; //skip undefined

        if (attr instanceof Array) { // deal with array
            attr.forEach(addOption);
            itemInMultiple = true;
        } else {
            addOption(attr);
        }
    }

    let keys = Object.keys(options);

    const sortFn = filterableCriteriaSortOptions[attribute];
    if (typeof sortFn === 'function') {
        keys = sortFn(keys);
    }

    let valuesKey = keys.map(key => {

        if (!itemInMultiple) {
            const fn = item => item[attribute] === key;
            saveFn(attribute, key, fn);
        } else {
            const fn = item => item[attribute].indexOf(key) > -1;
            saveFn(attribute, key, fn);
        }

        return {
            value: key,
            count: options[key],
            attribute
        };
    });

    return {
        title,
        values: valuesKey
    };
}

function buildRangeFn(min, max, attribute) {
    return function(item) {
        return item[attribute] >= min && item[attribute] <= max;
    };
}

function uniqueRanges(configValue, items) {
    const {title, attribute, ranges} = configValue;

    let options = {};

    // loop over all ranges
    for(let i = 0, len = ranges.length; i < len; i++) {
        const {min, max} = ranges[i].range;
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

function getUniqueValues(configValue, items) {
    return configValue.ranges ? uniqueRanges(configValue, items) : uniqueGeneric(configValue, items);
}

export function buildOptionsList(items, criteria, sortOptions) {
    filterableCriteria = criteria;
    filterableCriteriaSortOptions = sortOptions;
    let optionGroups = [];
    // loop over all items, get unique options from config
    for(let i = 0, len = filterableCriteria.length; i < len; i++) {
        optionGroups.push(getUniqueValues(filterableCriteria[i], items));
    }

    return {
        optionGroups,
        filterFns
    };
}