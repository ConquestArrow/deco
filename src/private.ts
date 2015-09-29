/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../typings/lib.es6.d.ts" />

import "../node_modules/reflect-metadata/";



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
	const pOrig = `${pName}:original`;
	
	const protoNames = Object.getOwnPropertyNames(target);
	const protoSymbols = Object.getOwnPropertySymbols(target);
	const protoLen = protoNames.length;
	const symLen = protoSymbols.length;
	const Len = protoLen + symLen;
	for(let i=0|0;(i|0)<(Len|0);i++){
		//let o = target[protoNames[i]];
		
		const pKey = 
			(i<protoLen)?
				protoNames[i] :
				protoSymbols[i-protoLen];
		
		let pd = Object.getOwnPropertyDescriptor(target, pKey);
		
		
		if(!pd.get && !pd.set){
			//function
			let o = target[pKey];
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
	
	let isMember = function isMember(accessor:Function, isGetter:boolean, targetClass:T, repFunc?:Function){
		let isM:boolean = false;
		
		const props = Object.getOwnPropertyNames(targetClass);
		const syms = Object.getOwnPropertySymbols(targetClass);
		const pLen = props.length;
		const sLen = syms.length;
		const Len = pLen + sLen;
		
		for(let i=0|0; (i|0)<(Len|0); i++ ){
			
			const s = 
				(i<pLen)?
					props[i] :
					syms[i-pLen];
			
			//method
			if(isGetter===null){
				const pd = Object.getOwnPropertyDescriptor(targetClass,s);
				if(!pd.get && !pd.set){
					//function
					if(Reflect.hasMetadata(pOrig,pd.value)){
						isM = Reflect.getMetadata(
							pOrig,
							pd.value
						) === accessor;
					}else{
						isM = pd.value === accessor;
					}
					
					if(isM)break;
				}else{
					//getter/setter

					isM = (pd.get === accessor) || (pd.set === accessor);
					if(isM){
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
		
		//if(pGet.caller===pGet)return;
		

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
		
		
		
		
		if(capsuled && isMember(pFunc.caller,null,target, pFunc)){
			desc.value.apply(this,args);
			//console.log(desc.value.apply(this,args));
		}
		else{
			throw Error(`Cannot call @privated method "${key}"`);
		}
	}
	
	
	if(desc){
	//class method
		
		Reflect.defineMetadata(
			pName,
			target.constructor,
			pFunc
		);
		Reflect.defineMetadata(
			pOrig,
			desc.value,
			pFunc
		)
		
		return <PropertyDescriptor>{
			enumerable:false,
			configurable:desc.configurable,
			value:pFunc
		};
	}else{
	//class property
		
		Reflect.defineMetadata(
			pName,
			target.constructor,
			pGet
		);
		Reflect.defineMetadata(
			pName,
			target.constructor,
			pSet
		);
		
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

