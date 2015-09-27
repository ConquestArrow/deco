/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../typings/lib.es6.d.ts" />

import "../node_modules/reflect-metadata/";


function capsule<T extends Function>(t:T):T|void{
	let base = t;
	
	let pName = "custom:private:"+t["name"];
	console.log("pName:"+pName);
	
	/*
	for(let i in t.prototype){
		let o = t.prototype[i];
		Object.defineProperty(
			o,
			pName,
			{
				value:true,
				enumerable:false,
				configurable:false
			}
		)
	}*/
	
	for(let i in (<any>t).prototype){
		let o = (<any>t).prototype[i];
		
		console.log(`o:${o.name},value:${o}`)
		//metadata
		//if(Reflect.hasMetadata(pName,o))continue;
		Reflect.defineMetadata(
			pName,
			t,
			o
		);
		console.log("[set metadata]",Reflect.getOwnMetadataKeys(o));
		
		//old style
		/*
		if(o[pName])continue;
		Object.defineProperty(
			o,
			pName,
			{
				value:true,
				enumerable:false,
				configurable:false
			}
		)
		*/
	}
	
	return t;
}


/*
function privated(target:any, key:string|symbol){
	let p = target[key];
	
	delete this[key];
	
	const pName = "isCapsuled_"+target.constructor.name;
	console.log("@privated:"+pName);
	console.log(Object.getOwnPropertyNames(target));
	
	let pGet = function(){
		let capsuled = pGet.caller[pName];
		console.log(`pGet.caller:${capsuled}`);
		if(capsuled)return p;
		else {
			throw Error(`Cannot read @privated property ${key}`);
		}
	}
	let pSet = function(val:any){
		let capsuled = pSet.caller[pName];
		console.log(`pSet.caller:${capsuled}`);
		if(capsuled)p = val;
		else{
			throw Error(`Cannot set @privated property ${key}`);
		}
	}
	
	Object.defineProperty(
		target,
		<string>key,
		{
			set:pSet,
			get:pGet,
			enumerable:false,
			configurable:true
		}
	);
	
	
}
*/

/*
 * ES6 standard
 */
/*
declare interface ES6Function extends Function{
	name:string;
}
*/

/**
 * decorator for private class property
 */
export function privated<T>(target:T, key:string|symbol):void;
/**
 * decorator for private class method
 */
export function privated<T>(target:T, key:string|symbol, desc:PropertyDescriptor):PropertyDescriptor;

export function privated<T>(target:T, key:string|symbol, desc?:PropertyDescriptor):any{
	//console.log(`property[${key}] will privater`)
	let p = <any>target[key];
	delete target[key];
	
	const pName = "custom:private:"+target.constructor.name;
	
	const protoNames = Object.getOwnPropertyNames(target);
	const protoLen = protoNames.length;
	for(let i=0|0;(i|0)<(protoLen|0);i++){
		//let o = target[protoNames[i]];
		let pd = Object.getOwnPropertyDescriptor(target, protoNames[i]);
		
		
		if(!pd.get && !pd.set){
			//function
			let o = target[protoNames[i]];
			if(Reflect.hasMetadata(pName,o)){
				continue;
			}
			Reflect.defineMetadata(
				pName,
				target.constructor,
				o
			);
			Reflect.defineMetadata(
				"debug:propname",
				key,
				o
			);
		}else{
			//getter/setter function metadata
			
			if(pd.get && !Reflect.hasMetadata(pName,pd.get) ){
				Reflect.defineMetadata(
					pName,
					target.constructor,
					pd.get
				);
				Reflect.defineMetadata(
					"debug:propname",
					key,
					pd.get
				);
			}
			if(pd.set && !Reflect.hasMetadata(pName,pd.set)){
				Reflect.defineMetadata(
					pName,
					target.constructor,
					pd.set
				);
				Reflect.defineMetadata(
					"debug:propname",
					key,
					pd.set
				);
			}
		}
		
		
	}
	
	
	
	//const pName = "isCapsuled_"+target.constructor.name;
	//console.log("@privated:"+`[${<string>key}]`+pName);
	//console.log(Object.getOwnPropertyNames(target));
	
	let isMember = function isMember(accessor:Function, isGetter:boolean, targetClass:T){
		let isM:boolean = false;
		for(let s of Object.getOwnPropertyNames(targetClass)){
			
			//method
			if(isGetter===null){
				const pd = Object.getOwnPropertyDescriptor(targetClass,s);
				if(!pd.get && !pd.set){
					//function
					isM = targetClass[s] === accessor;
					if(isM)break;
				}else{
					//getter/setter
					/*
					console.log(`pd.get:${pd.get}`)
					console.log(`pd.set:${pd.set}`)
					console.log(`accessor:${accessor}`)
					console.log(`accessor.caller:${accessor.caller}`)
					*/
					isM = (pd.get === accessor) || (pd.set === accessor);
					if(isM){
						//console.log("isM:",isM);
						//console.log("pd.get:",pd.get)
						//console.log("pd.set:",pd.set)
						break;
					}
				}
				
				
				
			}
			else{
				
				//property
				
				const pd = Object.getOwnPropertyDescriptor(targetClass,s);
				//console.log("pd:"+JSON.stringify(pd));
				
				const pdAcc = isGetter ? pd.get : pd.set;
				if(pdAcc){
					isM = pdAcc === accessor.caller;
					if(isM){
						//console.log(`target[${s}] has get`);
						break;
					}
				}else if(!(isGetter ? pd.set : pd.get) && targetClass[s] instanceof Function){
					//console.log(`[${s}] instanceOf Function:${ target[s] instanceof Function }`);
					isM = targetClass[s] === accessor.caller;
					if(isM){
						//console.log(`target[${s}] is method`);
						break;
					}
				}
			}
			
			
		}
		return isM;
	};
	
	const pGet = function(){
		//let capsuled = pGet.caller[pName];
		const capsuled = 
			Reflect.hasMetadata(pName, pGet.caller) && 
			Reflect.getMetadata(pName, pGet.caller)===target.constructor;
		
		//console.log(`pGet.caller:${pGet.caller}`);
		//console.log(`pGet.caller.name:${pGet.caller.name}`);
		//console.log("hasOwn:"+target.constructor.hasOwnProperty());
		//console.log(`pGet.caller===pGet:${pGet.caller===pGet}`);
		if(pGet.caller===pGet)return;
		
		//console.log(`isMember:${isMember}`);
		
		//console.log(`${Reflect.getMetadata("debug:propname",pGet.caller)}[capsuled]:${capsuled}, pGet.caller===privated2:${pGet.caller===privated} , pGet.caller.caller===privated2:${pGet.caller.caller===privated}`);
		/*
		console.log(Object.getOwnPropertyNames(target.constructor.prototype));
		console.log(`Obj.protoOf:${Object.getPrototypeOf(pGet.caller)}`)
		console.log("hasOwn:"+target.constructor.prototype.hasOwnProperty(pGet.caller))
		console.log(`(<any>target).constructor.prototype.isPrototypeOf(pGet.caller):${(<any>target).constructor.prototype.isPrototypeOf(pGet.caller)}`);
		*/

		if(capsuled && isMember(pGet, true, target))return p;
		else if(pGet.caller===privated){
			//console.log(`caller===privated2:${pGet.caller===privated2}`);
			return;
		}
		else {
			throw Error(`Cannot read @privated property ${key}`);
		}
	};
	const pSet = function(val:any){
		//let capsuled = pSet.caller[pName];
		const capsuled = Reflect.hasMetadata(pName,pSet.caller) && Reflect.getMetadata(pName,pSet.caller)===target.constructor;
		
		//console.log(`pSet.caller:${pSet.caller}`);
		/*
		console.log(`pSet.caller:${capsuled}`);
		console.log(`Reflect.hasMetadata(pName,pSet.caller):${Reflect.hasMetadata(pName,pSet.caller)}`);
		console.log(`pSet.caller:${pSet.caller}`);
		console.log(`target:${target.constructor}`);
		console.log(`[${pName}]:${Reflect.getMetadata(pName,pSet.caller)}`);
		console.log(`pSet.caller===<any>(target):${pSet.caller===<any>(target)}`);
		*/
		if(capsuled && isMember(pSet, false, target))p = val;
		else if(pSet.caller===privated){
			return;
		}
		else{
			throw Error(`Cannot set @privated property ${key}`);
		}
	};
	
	const pFunc = function(...args:any[]){
		const capsuled = Reflect.hasMetadata(pName,pFunc.caller) && Reflect.getMetadata(pName,pFunc.caller)===target.constructor;
		
		/*
		let isMember = target.hasOwnProperty(pFunc.caller.name);
		console.log(`caller:${target.constructor.name}`)*/
		
		
		
		
		if(capsuled && isMember(pFunc.caller,null,target)){
			desc.value.apply(this,args);
			//console.log(desc.value.apply(this,args));
		}
		else{
			//console.log(`caller:${pFunc.caller}`);
			//console.log(`isMember:${isMember(pFunc.caller,null,target)}`)
			/*console.log(`[${pName}]:${Reflect.getMetadata(pName,pFunc.caller)}`);
			console.log(`["debug:propname"]:${Reflect.getMetadata("debug:propname",pFunc.caller)}`);*/
			
			
			throw Error(`Cannot call @privated method "${key}"`);
		}
	}
	
	
	if(desc){
	//class method
		return {
			enumerable:false,
			value:pFunc
		};
	}else{
	//class property
		Object.defineProperty(
			target,
			key,
			{
				set:pSet,
				get:pGet,
				enumerable:false,
				configurable:true
			}
		);
	}
	
	
} 

//const hoge = Symbol("hoge");

//@capsule
/*
class P{
	@privated private prop:number;
	@privated private prop2nd:string;
	
	
	constructor(){
		//Object.seal(this);
	}
	//private [hoge] = 1;
	
	fuga:string;
	
	func(n:number){
		this.prop = n;
	}
	
	method(){void 0;}
	method2(){void 1;}
	get hoge(){
		"get hoge";
		return this.prop;};
	set hoge(val:number){this.prop = val;};
}
*/


/*
var p = new P();
p.func(100);
//console.log(`p.hoge:${p.hoge}`);
p.hoge = 10000;
p.func(p.hoge);
//p["prop"] = 100;
console.log(`P.properties:${Object.getOwnPropertyNames(p)}`);
console.log(`P.properties:${Object.getOwnPropertyNames(P.prototype)}`);
console.log(`P.metadata1:${Reflect.getMetadataKeys(P.prototype)}`);
console.log(`P.metadata2:${Reflect.getOwnMetadataKeys(P.prototype)}`);
console.log(`p.func.metadata:${Reflect.getMetadataKeys(p.func)}`);



var f = ()=>{
	console.log("f------------------");
	return this["prop"];
};
var sym = Reflect.getMetadataKeys(p.func)[0];
Reflect.defineMetadata(
	sym,
	P.prototype.constructor,
	f
)
Object.defineProperty(
	P,
	"f",
	{
		get:f
	}
)
console.log(P["f"]);
//console.log(f());
*/
/*
Reflect.defineMetadata(
	Reflect.getMetadataKeys(p.fuga)[0],
	P.prototype.constructor,
	p.newMethod
);
*/
//p["prop2nd"] = "1";

/*
var x = new X();
x.func(123);
x.func2(456);
x.P();
*/

//p["prop"] = 100;
//p.prop = 100;
//console.log(p.func.isCapsuled);
//p.prop = 1;
//console.log(`[outer]p.prop:${p.prop}`);
