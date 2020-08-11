
export function tryJSONParse(
    jsonStr: any,
    options: {
        empty?: any,
        catch?: (error: any) => void
    }
) {
    let result = options.empty;
    try { result = JSON.parse(jsonStr) || options.empty; } catch (e) { options.catch && options.catch(e); }
    return result;
}


