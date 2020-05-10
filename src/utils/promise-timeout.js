export const promiseTimeout = (promise, timeoutMs) => {
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in '+ timeoutMs + 'ms.');
        }, timeoutMs);
    })
  
    return Promise.race( [ promise, timeout ]);
}
  