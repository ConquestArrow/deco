"use strict";
export function seal<T extends Function>(t:T):T|void{
    let base = t;

    function construct(constructor:T, args:any[]) {
        let c: any = function () {
            return constructor.apply(this, args);
        };
        c.prototype = constructor.prototype;
        return new c();
    }

    let func: any = (...args:any[])=>{
        let a = construct(base, args);
        Object.seal(a); //ここで指定
        return a;
    };

    func.prototype = base.prototype;

    return func;
}