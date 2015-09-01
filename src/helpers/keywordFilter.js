import Fuse from 'fuse.js'
import { searchKeys, searchThreshold } from '../config.js';


export default function searchByKeyword(items, searchText) {

    if (searchText === undefined || searchText === '') return items;

    var f = new Fuse(items, {
        caseSensitive: false,
        includeScore: false,
        shouldSort: false,
        threshold: searchThreshold,
        keys: searchKeys
    });

    return f.search(searchText);

}