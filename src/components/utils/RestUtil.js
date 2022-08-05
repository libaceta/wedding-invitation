
export function get(path, params) {
    let paramsUrl = '';
    if (params) {
        paramsUrl = '?'
        for (let param of params) {
            paramsUrl += param.key + '=' + param.value + '&';
        }
        paramsUrl = paramsUrl.substring(0, paramsUrl.length - 1);
    }
    return fetch(process.env.REACT_APP_BACKEND_URL + path + paramsUrl , {
        method: 'GET',

    });
}
