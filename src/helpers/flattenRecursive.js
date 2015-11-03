function recurse(arr, childAttribute, fn, parent) {
    parent = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
    for(let i = 0, len = arr.length; i < len; i++) {
        const item = arr[i];
        fn(item, parent);
        if (item[childAttribute]) {
            recurse(item[childAttribute], childAttribute, fn, item);
        }
    }
}

function recurseLevel(arr, childAttribute, fn) {
    fn(arr);
    for(let i = 0, len = arr.length; i < len; i++) {
        const item = arr[i];
        if (item[childAttribute]) {
            recurse(item[childAttribute], childAttribute, fn);
        }
    }
}

function objectInArray(arr, fn) {
    for(let i = 0, len = arr.length; i < len; i++) {
        if (fn(arr[i])) {
            return true;
        }
    }
    return false;
}

function find(arr, childAttribute, fn) {
    let result;
    for(let i = 0, len = arr.length; i < len; i++) {
        const item = arr[i];
        // check if this passes
        if (fn(item)) {
            return item;
        }
        if (item[childAttribute]) {
            // otherwise rescurse
            result = find(item[childAttribute], childAttribute, fn);
            if (result) {
                return result;
            }
        }

    }
    return false;
}

export default function flattenDedup(attribute, subjects, idField, sortFn) {

    const tree = [];

    subjects.forEach(subject => {
        recurse(subject[attribute], 'children', (item, parent) => {

            let parentArray;
            if (parent === null) {
                parentArray = tree;
            } else {
                // find parent node
                const parentNode = find(tree, 'children', i => i[idField] == parent[idField]);
                if (!parentNode.children) {
                    parentNode.children = [];
                }
                parentArray = parentNode.children;
            }

            // check if item already in parent
            if (!objectInArray(parentArray, i => i[idField] == item[idField])) {
                // add it
                parentArray.push({
                    [idField]: item[idField],
                    value: item.title,
                    count: 1,
                    filter: subject => {
                        // find the content id
                        return find(subject[attribute], 'children', attr => attr[idField] === item[idField]);
                    }
                });

            } else {
                // find and increment it
                const node = find(parentArray, 'children', i => i[idField] == item[idField]);
                node.count++;
            }
        });
    });

    if (sortFn) {
        // apply sort function to every level
        recurseLevel(tree, 'children', sortFn);
    }

    return tree;
}
