function readonly(target, propertyKey){
	let p = target[propertyKey];
	
	let eSetter = (val:any)=>{
		throw Error(`Cannot set property ${propertyKey} of ${target} which is readonly.`);
	}
	
	Object.defineProperty(
		target,
		propertyKey,
		{
			get:()=>p,
			set:eSetter,
			enumerable:true,
			configurable:true
		}
	);
}
class A{
	@readonly static PROP = 1;
}
console.log(A.PROP);	//1
A.PROP = 100;	//Uncaught TypeError: Cannot set property PROP of function A() {} which is readonly.
