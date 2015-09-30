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
			throw Error(`A class "${base.name}" cannot extend. class "${thisname}" is invalid.`);
		}
		
        return a;
    };

    func.prototype = base.prototype;
	
	//console.log(`name:${func.prototype.constructor.name}`)

    return func;
}
/*
@final class NoExtend{}
class Extended extends NoExtend{}
class ExExtended extends Extended{}

var Rename = NoExtend;
class RenameExtend extends Rename{}

var e1 = new NoExtend();
//var e2 = new Extended();
//var e3 = new ExExtended();
var r1 = new Rename();
var r2 = new RenameExtend();
*/