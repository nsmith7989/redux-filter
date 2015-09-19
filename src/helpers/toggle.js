/**
 * {
 * [attribute]: [values],
 * [attribute]: [values]
 * }
 *
 */

export default function toggle(filters, key, value) {

    //copy
    filters = {...filters};

    let currentFilterArray = (filters[key] && filters[key].slice(0)) || [];
    // remove the reference to the current subject because we're mutating it
    delete filters[key];

    // check if the value is in the currentFilterArray, then add or remove it
    const indexOfValueInCurrentFilterArray = currentFilterArray.indexOf(value);
    if (indexOfValueInCurrentFilterArray > -1) {
        // remove value form array
        currentFilterArray.splice(indexOfValueInCurrentFilterArray, 1);
    } else {
        // add value to array
        currentFilterArray.push(value);
    }
    if (!currentFilterArray.length) {
        return {...filters}
    } else {
        return {...filters, [key]: currentFilterArray};
    }

}