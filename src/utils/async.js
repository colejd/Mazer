export function timeout(ms, cancellationToken) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
        if(cancellationToken) {
            cancellationToken.register(reject);
        }
    });
}

// https://stackoverflow.com/a/32897819
export function CancellationToken(parentToken){
    if(!(this instanceof CancellationToken)){
        return new CancellationToken(parentToken)
    }
    this.isCancellationRequested = false;
    var cancellationPromise = new Promise(resolve => {
        this.cancel = e => {
        this.isCancellationReqested = true;
        if(e){
            resolve(e);
        }
        else
        {
            var err = new Error("cancelled");
            err.cancelled = true;
            resolve(err);
        }
        };
    });
    this.register = (callback) => {
        cancellationPromise.then(callback);
    }
    this.createDependentToken = () => new CancellationToken(this);
    if(parentToken && parentToken instanceof CancellationToken){
        parentToken.register(this.cancel);
    }
}