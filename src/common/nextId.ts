let lastId = 0;
export function nextId(prefix: string = Date.now().toString()) {
    return `${prefix}_${++lastId}`;
}