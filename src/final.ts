/// <reference path="../typings/lib.es6.d.ts" />
export function final<T extends Function>(target:T):T|void{
	const base = target;

    function construct(constructor:T, args:any[]) {
        let c: any = function () {
            return constructor.apply(this, args);
        };
        c.prototype = constructor.prototype;
        return new c();
    }

    let func: any = function(...args:any[]){
        let a = construct(base, args);
		
		
		const thisname = Object.getPrototypeOf(this).constructor.name;
		
		if(thisname!==base.name){
			throw Error(`A class "${thisname}" cannot inherit from @final class "${base.name}".`);
		}
		
        return a;
    };

    func.prototype = base.prototype;
    return func;
}