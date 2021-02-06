
export function tryJSONParse(
    jsonStr: any,
    options: {
        empty?: any,
        catch?: (error: any) => void,
        reviver?: (this: any, key: string, value: any) => any
    } = {}
) {
    let result = options.empty;
    try { result = JSON.parse(jsonStr, options.reviver); }
    catch (e) { options.catch && options.catch(e); }
    return result;
}
