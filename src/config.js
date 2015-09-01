export const filterFn = Array.prototype.every;

export const collection = []; // this is the data source

// todo: config for filterable items

export const searchKeys = []; // keys keyword searching works on

/**
 * At what point does the search keyword search algorithm give up.
 * A threshold of 0.0 requires a perfect match (of both letters and location),
 * a threshold of 1.0 would match anything.
 **/
const searchThreshold = .2;
