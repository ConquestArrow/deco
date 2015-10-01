# TypeScript/ES7(ES2016) decorator samples


## `@seal` : Class instances cannot add property (like Java/C# class) 

```
"use strict";
@seal
class A{
    prop = 1;
}
var a = new A();
a.prop2 = 100;      //error!:Uncaught TypeError: Can't add property prop2, object is not extensible
```

 * [source code](./src/seal.ts)
 * [TypeScript/ES6+ES7でクラスメンバーの追加を阻止](http://qiita.com/ConquestArrow/items/68de51c92febd80ba21d)


## `@readonly` : Pseudo class constraint property

```
class A{
    @readonly static PROP = 1;
}

A.PROP; //1
A.PROP = 100;   //runtime error!
```

 * [sample code](./src/const.ts)
 * [TypeScript/ES7でクラス定数](http://qiita.com/ConquestArrow/items/9fb13bc06af48f333d13)

## `@privated` : Pseudo private access modifier

```
class A{
	@privated private prop;
	@privated private method(){};
}
var a = new A();
a["prop"];		//runtime error!
a["method"]();	//runtime error!
```

 + [source code](./src/private.ts) | [sample test code](./test/private-test.ts)
 * [TypeScript/ES7でprivate風メソッド、プロパティ](http://qiita.com/ConquestArrow/items/e707ea70822ec82220da)
 
## `@final` : No inherit class
 
```
@final class A{}
class ExA extends A{}
var e = new ExA();	//runtime error!
```

 * [source code](./src/final.ts) | [sample test code](./test/final-test.ts)
 * [TypeScript/ES7で継承不可なクラス](http://qiita.com/ConquestArrow/items/2739e37871f748beeb36)