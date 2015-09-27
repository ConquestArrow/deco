"use strict";
function seal(target:Function){
	let ctor = target.prototype.constructor;
	//console.log("ctor:"+ctor);
	//Object.seal(ctor);
	//console.log(`ctor is sealed: ${Object.isSealed(ctor)}`);
	target.prototype.constructor = function(...args:any[]){
		
		Object.seal(this);
		console.log(`this:${this}, isSeald:${Object.isSealed(this)}`);
		<Function>ctor.apply(this, args);
	}
	console.log(`target:${target}`);
	console.log(`target.prototype: ${JSON.stringify(target.prototype)}`);
	console.log(`target.prototype.constructor:${target.prototype.constructor}`);
	
	let t = target;
	target = function(...args:any[]){
		t.apply(this, args);
		Object.seal(this);
	}
	
}

function sealed<T extends Function>(t:T):T|void{
	let base = t;
	
	/*
	let func = function(...args:any[]){
		return (function(baseFunc:Function, args:any[]){
			let c:any = function(){
				//Object.preventExtensions(this);
				//Object.seal(this);
				//console.log("prototypeOf:"+JSON.stringify(Object.getPrototypeOf(this)));
				//Object.freeze(this);
				console.log("repl constructor");
				let r:any = baseFunc.apply(this, args);
				Object.freeze(this);
				//Object.freeze(Object.getPrototypeOf(this));
				return r;
			}
			c.prototype = baseFunc.prototype;
			
			//Object.freeze(c);
			Object.freeze(c.prototype);
			//let ins = new c();
			//Object.freeze(ins);
			return new c();
		})(base, args);
	}*/
	
	function construct(constructor:T, args:any[]) {
		let c: any = function () {
			return constructor.apply(this, args);
		}
		c.prototype = constructor.prototype;
		return new c();
	}
	
	let func: any = (...args:any[])=>{
		let a = construct(base, args);
		Object.seal(a);
		return a;
	};
	
	func.prototype = base.prototype;
	
	return func;
}

@sealed
class A{
	prop = 1;
	constructor(){
		console.log("class A constructor!");
	}
	func(){
		//...
	}
}

@sealed
class B extends A{
	/*
	constructor(){
		super();
		console.log("class B constructor");
		Object.freeze(B.prototype);
		
		console.log(Object.getOwnPropertyNames(this));
	}
	func(){
		console.log("child overrided.");
	}*/
	
}

var a = new A();
//a.prop = 2;
//a.prop2 = 10;
//delete a.prop;
//a["prop2"] = 10;
//console.log(`a is sealed: ${Object.isSealed(a)}`);
//console.log(`a.prop:${a.prop}`);
//console.log(`a.prop2:${a.prop2}`);

var b = new B();
b.prop2 = 100;
console.log(b.prop2);

