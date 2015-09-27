"use strict";
class A{
    constructor(){
		this.prop = 1;
        Object.preventExtensions(this);
    }
    
}

class B extends A{
	//constructor(){super();}
}

//実行
console.log("hi!");
var a = new A();
//a.prop2 = 100;  

var b = new A();
b.prop2 = 100;