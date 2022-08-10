
export const get = async (path, params) => {
    let paramsUrl = '';
    if (params) {
        paramsUrl = '?'
        for (let param of params) {
            paramsUrl += param.key + '=' + param.value + '&';
        }
        paramsUrl = paramsUrl.substring(0, paramsUrl.length - 1);
    }
    return await fetch(process.env.REACT_APP_BACKEND_URL + path + paramsUrl , {
        method: 'GET',
    }).then(res => { 
        if (res.ok) {
            return res.clone().json();
        }
        throw new Error(res.clone().json());
    });
}

export const post = async (path, params, payload) => {
    let paramsUrl = '';
    if (params) {
        paramsUrl = '?'
        for (let param of params) {
            paramsUrl += param.key + '=' + param.value + '&';
        }
        paramsUrl = paramsUrl.substring(0, paramsUrl.length - 1);
    }
    return await fetch(process.env.REACT_APP_BACKEND_URL + path + paramsUrl , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    }).then(res => { 
        if (res.ok) {
            return res;
        } else {
            throw new Error(res);
        }
    });
}
