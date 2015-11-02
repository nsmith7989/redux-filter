import matches from 'lodash.matches';


const filterFns = {};

let filterableCriteria;

function saveFn(attribute, key, fn) {
    filterFns[attribute + '__' + key] = fn;
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
        if (currentVal === undefined) return prev;

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
    const { title, attribute } = configValue;
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
    if (typeof keySortFn === 'function') {
        keys = keySortFn(keys);
    }

    return {
        title,
        values: keys.map(key => {
            return {
                value: key,
                count: options[key],
                attribute: attribute
            };
        })
    };

}

function buildRangeFn(min, max, attribute) {
    return function (item) {
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

    let options = valueMap(attribute, items, (prev, currentValue) => {
        // find which range i falls in
        const foundRange = find(ranges, rangeObj => {
            const {min, max} = rangeObj.range;
            return within(min, max, currentValue);
        });

        const { min, max } = foundRange.range;
        // build range fn
        saveFn(attribute, foundRange.displayValue, buildRangeFn(min, max, attribute));

        accumulate(prev, foundRange.displayValue);
        return prev;
    });

    let keys = Object.keys(options);
    if (typeof sortFn === 'function') {
        keys = sortFn(keys);
    }

    return {
        title,
        values: keys.map(key => {
            return {
                count: options[key],
                attribute,
                value: key
            };
        })
    };

}

export function uniqueObject(configValue, items, sortFn = null) {
    const { attribute, title } = configValue;

    const flatResults = {};

    items.forEach(item => {
        const attrObj = item[attribute];
        const keys = Object.keys(attrObj);
        keys.forEach(k => {
            // add to flat results if not there already
            if (!flatResults[k]) {
                flatResults[k] = {
                    count: 0,
                    values: []
                };
            }
            // icrement the count
            flatResults[k].count++;
            // if it has a parent save that info too
            if (attrObj[k].parent) {
                flatResults[k].parent = attrObj[k].parent;
            }

            // also save values (uniquely)
            if (!objectInArray(flatResults[k].values, attrObj[k])) {
                flatResults[k].values.push(attrObj[k]);
            } else {
            }

        });
    });

    return {
        title,
        values: createHeirachy(flatResults)
    };

}

function print(obj) {
    console.log(JSON.stringify(obj, null, ' '));
    return obj;
}

function objectInArray(arr, obj) {
    return arr.some(o => matches(o, obj));
}

function buildTree(parentKey, all) {
    const acc = [];
    if (all[parentKey]) {
        for (let i = 0, len = all[parentKey].length; i < len; i++) {
            const item = all[parentKey][i];
            const children = buildTree(item.key, all);
            const obj = {
                title: item.values[0].title,
                count: item.count,
                attribute: item.key,
                values: item.values
            };
            if (children.length) {
                obj.children = children;
            }
            acc.push(obj);
        }
    }
    return acc;
}

export function createHeirachy(obj) {

    // turn insideout
    const itemsByParent = Object.keys(obj).reduce((prev, key) => {
        const item = obj[key];
        item.key = key;
        if (item.parent) {
            if (!prev[item.parent]) {
                prev[item.parent] = [];
            }
            prev[item.parent].push(item);
        }
        return prev;
    }, {});

    // find top level parents
    const topKeys = Object.keys(obj).filter(key => {
        const item = obj[key];
        return !item.parent;
    });

    return topKeys.map(key => {
        const item = obj[key];
        return {
            title: item.values[0].title,
            attribute: key,
            values: item.values,
            count: item.count,
            children: buildTree(key, itemsByParent)
        };
    });

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
    filterableCriteria = criteria;

    let optionGroups = filterableCriteria.map(criteria => {
        return getUniqueValues(criteria, items, sortOptions[criteria.type]);
    });

    return {
        optionGroups,
        filterFns
    };
}
