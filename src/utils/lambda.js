export function lambda(collection, fn) {
    // return collection.map((item) => {
    //     return [item, fn(item)];
    // }).sort((a, b) => {
    //     return b[1] - a[1];
    // }).map((item) => {
    //     return item[0];
    // });
    return collection.sort((a, b) => {
        return fn(a) - fn(b);
    });
}