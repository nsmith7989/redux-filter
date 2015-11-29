import omit from 'lodash.omit';
/**
 * {
 * [attribute]: [values],
 * [attribute]: [values]
 * }
 *
 */

function removeElement(obj, key, arr, index) {
    const removedArray = [
        ...arr.slice(0, index),
        ...arr.slice(index + 1)
    ];
    // if there is no items on the array, do not set a key on the filter object
    if (removedArray.length) {
        return {
            ...obj,
            [key]: removedArray
        };
    } else {
        // no item here, remove that key (in a non mutative way)
        return omit(obj, key);
    }
}

function addElement(obj, key, arr, value) {
    return {
        ...obj,
        [key]: arr.concat(value)
    };
}

export default function toggle(filters, key, value) {
    let currentFilterArray = filters[key] || [];
    // check if the value is in the currentFilterArray, then add or remove it
    const indexOfValueInCurrentFilterArray = currentFilterArray.indexOf(value);
    if (indexOfValueInCurrentFilterArray > -1) {
        return removeElement(filters, key, currentFilterArray, indexOfValueInCurrentFilterArray);
    } else {
        return addElement(filters, key, currentFilterArray, value);
    }
}

export function toggleOnly(filters, key, value) {
    return { ...filters, [key]: [value] };
}

export function clearFilter(filters, key) {
    return omit(filters, key);
}
