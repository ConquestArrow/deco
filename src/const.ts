"use strict";
class A{
	static get PROP(){return 1;}
}

console.log(A.PROP);
//A.PROP = 100;
//console.log(A.PROP);

namespace nsA{
	export const PROP = 1;
}
nsA.PROP;//1
//nsA.PROP = 100;
console.log(nsA.PROP);


function readonly(target: any, propertyKey: string | symbol){
	let p = target[propertyKey];
	
	let eSetter = (val:any)=>{
		throw TypeError(`Cannot set property ${propertyKey} of ${target} which is readonly.`);
	}
	
	Object.defineProperty(
		target,
		<string>propertyKey,
		{
			get:()=>p,
			set:eSetter,
			enumerable:true
		}
	);
}

class B{
	@readonly static PROP = 1;
}
console.log(B.PROP);

B.PROP = 100;
console.log(B.PROP);