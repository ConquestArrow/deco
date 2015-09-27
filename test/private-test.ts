/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/lib.es6.d.ts" />


import * as assert from 'power-assert';
import {privated} from '../src/private';
import "../node_modules/reflect-metadata/";

describe("@private decorated class property", ()=>{
	
	class Test{
		@privated private prop = 1;
		@privated private prop2nd = "";
		@privated private prop3rd = false;
		
		
		getPropMethod(){
			return this.prop;
		}
		
		getPropBracketAccessMethod(){
			return this["prop"];
		}
		
		private getPropPrivateMethod(){
			return this.prop;
		}
		
		static getPropStaticMethod(){
			return this["prop"];
		}
		
		get exProp(){
			return this.prop;
		}
		set exProp(val:number){
			this.prop = val;
		}
	}
	let t:Test = new Test();
	
	beforeEach(()=>{
		t = new Test();
	});
	
	
    context("internal access should not be error", ()=>{
		
		it("getPropMethod",()=>{
			assert.doesNotThrow(
				()=>{
					t.getPropMethod();
				}
			)
		});
		
		it(`getPropBracketAccessMethod`,()=>{
			assert.doesNotThrow(
				()=>{
					t.getPropBracketAccessMethod();
				}
			)
		});
		
		it(`[getPropPrivateMethod]()`,()=>{
			assert.doesNotThrow(
				()=>{
					t["getPropPrivateMethod"]();
				}
			)
		})
		
		it(`getter exProp`,()=>{
			assert.doesNotThrow(
				()=>{
					let a = t.exProp;
				}
			)
		})
		
		it(`setter exProp`,()=>{
			assert.doesNotThrow(
				()=>{
					t.exProp = 1;
				}
			)
		})
		
		it(`getPropStaticMethod`, ()=>{
			assert.doesNotThrow(
				()=>{
					Test.getPropStaticMethod();
				}
			);
			assert.notEqual(Test.getPropStaticMethod,undefined);
		})
    });
	
	context("external get access should be error", ()=>{
		
		it(`bracket access t["prop"]`,()=>{
			assert.throws(
				()=>{
					t["prop"];
				}
			)
		});
		
		it(`bracket access Test["prop"]`,()=>{
			assert.equal(Test["prop"],undefined);
		});
		
		
		it(`Object.getOwnPropertyDescriptor(t, "prop").value`,()=>{
			
			assert.throws(
				()=>{
					let pd = Object.getOwnPropertyDescriptor(t, "prop");
					pd.value;
				}
			)
		})
		
		it(`added method access "this["prop"]"`,()=>{
			assert.throws(
				()=>{
					t["newMethod"] = function(){
						return this["prop"];
					};
					t["newMethod"]();
				}
			)
		})
		
		it(`added method access "t["prop"]"`,()=>{
			t["newMethod"] = () =>{
				return t["prop"];
			};
			assert.throws(
				()=>{
					t["newMethod"]();
				}
			)
		})
		
		it(`metadata added access`,()=>{
			let meta = Reflect.getMetadataKeys(t.getPropMethod)[0];
			t["metaMethod"] = function(){
				return this["prop"];
			};
			Reflect.defineMetadata(
				meta,
				Test.prototype.constructor,
				t["metaMethod"]
			);
			assert.throws(
				()=>{
					t["metaMethod"]();
				}
			);
			
		});
		
		it(`defined property & metadata added access1`,()=>{
			const propName = "definedMetaMethod";
			Object.defineProperty(
				t,
				propName,
				{
					value:function(){
						return this["prop"];
					}
				}
			)
			
			let meta = Reflect.getMetadataKeys(t.getPropMethod)[0];
			Reflect.defineMetadata(
				meta,
				Test.prototype.constructor,
				t[propName]
			);
			assert.throws(
				()=>{
					t[propName]();
				}
			);
			
		});
		
		it(`defined property & metadata added access2`,()=>{
			const propName = "definedMetaMethod2";
			Object.defineProperty(
				t,
				propName,
				{
					get:function(){
						return this["prop"];
					}
				}
			)
			
			let meta = Reflect.getMetadataKeys(t.getPropMethod)[0];
			
			assert.throws(
				()=>{
					Reflect.defineMetadata(
						meta,
						Test.prototype.constructor,
						t[propName]
					);
					t[propName];
				}
			);
			
		});
		
	});
	
	context("external set access should error",()=>{
		it(`bracket access t["prop"] = 1;`, ()=>{
			assert.throws(
				()=>{
					t["prop"] = 1;
				}
			)
		});
		
		it(`bracket access Test["prop"] = 2;`, ()=>{
			Test["prop"] = 2;
			assert.notEqual(
				Test["prop"],t.getPropMethod(),
				`Test["prop"]:${Test["prop"]}`
			)
		});
		
		it(`Object.getOwnPropertyDescriptor(t, "prop").value`,()=>{
			
			assert.throws(
				()=>{
					let pd = Object.getOwnPropertyDescriptor(t, "prop");
					pd.value = 100;
				}
			)
		})
		
		it(`added method access "this["prop"]"`,()=>{
			t["newMethod"] = function(){
				this["prop"] = 1;
			};
			assert.throws(
				()=>{
					t["newMethod"]();
				}
			)
		})
		
		it(`added method access "t["prop"]"`,()=>{
			t["newMethod"] = () =>{
				t["prop"] = 1;
			};
			assert.throws(
				()=>{
					t["newMethod"]();
				}
			)
		})
		
		it(`metadata added access`,()=>{
			let meta = Reflect.getMetadataKeys(t.getPropMethod)[0];
			t["metaMethod"] = function(){
				this["prop"] = 1;
			};
			Reflect.defineMetadata(
				meta,
				Test.prototype.constructor,
				t["metaMethod"]
			);
			assert.throws(
				()=>{
					t["metaMethod"]();
				}
			);
			
		});
		
		
		it(`defined property & metadata added access1`,()=>{
			const propName = "definedMetaMethod";
			Object.defineProperty(
				t,
				propName,
				{
					value:function(){
						this["prop"] = 1;
					}
				}
			)
			
			let meta = Reflect.getMetadataKeys(t.getPropMethod)[0];
			Reflect.defineMetadata(
				meta,
				Test.prototype.constructor,
				t[propName]
			);
			assert.throws(
				()=>{
					t[propName]();
				}
			);
			
		});
		
		it(`defined property & metadata added access2`,()=>{
			const propName = "definedMetaMethod2";
			Object.defineProperty(
				t,
				propName,
				{
					set:function(val:any){
						this["prop"] = val;
					}
				}
			)
			
			let meta = Reflect.getMetadataKeys(t.getPropMethod)[0];
			
			assert.throws(
				()=>{
					Reflect.defineMetadata(
						meta,
						Test.prototype.constructor,
						t[propName]
					);
					t[propName] = 1;
				}
			);
			
		});
	});
	
	context("extended class access",()=>{
		class ExTest extends Test{
			constructor(){
				super();
			}
			
			getPropFromChildMethod(){
				return this["prop"];
			}
		}
		let ext:ExTest;
		beforeEach(()=>{
			ext = new ExTest();
		});
		
		it("ext.getPropMethod() should not be error",()=>{
			assert.doesNotThrow(
				()=>{
					ext.getPropMethod();
				}
			)
		});
		
		it(`ext["prop"] should not be error`,()=>{
			assert.throws(
				()=>{
					ext["prop"];
				}
			)
		});
		
		it("ext.getPropFromChildMethod() should be error",()=>{
			assert.throws(
				()=>{
					ext.getPropFromChildMethod();
				}
			)
		});
		
		
	});
});

describe("@privated decorated class method", ()=>{
	
	class MethodTest{
		@privated private method(){
			return true;
		}
		@privated private test(){}
		
		callMethod(){
			//this.method();
			this.method();
		}
		
		private callPrivateMethod(){
			this.method();
			//this["method"]();
		}
		
		static callStaticMethod(){
			//this["method"]();
		}
		
		
		get prop(){
			return this.method();
		}
		set prop(val:any){
			val = this.method();
		}
		
		get test2(){
			return this.test();
		}
	}
	let t:MethodTest = new MethodTest();
	beforeEach(()=>{
		t = new MethodTest();
	});
	
	context(`@privated method should be hidden`,()=>{
		
		it(`hasOwnProperty("method")===false`,()=>{
			assert.equal(t.hasOwnProperty("method"),false);
		});
		
		/*
		it(`"method" in t === false`,()=>{
			assert.equal("method" in t,false);
		});
		*/
		
	})
	
	context(`internal access should not be error`, ()=>{
		
		it("t.callMethod()",()=>{
			assert.doesNotThrow(()=>{
				t.callMethod();
			});
		});
		
		it(`t["callPrivateMethod"]()`,()=>{
			assert.doesNotThrow(()=>{
				t["callPrivateMethod"]();
			});
		});
		
		it("t.callStaticMethod()",()=>{
			assert.doesNotThrow(()=>{
				MethodTest.callStaticMethod();
			});
		});
		
		it("getter access",()=>{
			assert.doesNotThrow(()=>{
				t.prop;
				t.test2;
			});
		});
		
		it("setter access",()=>{
			assert.doesNotThrow(()=>{
				t.prop = 1;
			});
		});
		
	});
	
	context(`external access should be error`,()=>{
		
		it(`t.method()`,()=>{
			assert.throws(()=>{
				(<any>t).method();
			})
		})
		
		it(`t["method"]()`,()=>{
			assert.throws(()=>{
				t["method"]();
			})
		})
		
		it(`MethodTest.method()`,()=>{
			assert.throws(()=>{
				MethodTest["method"]();
			})
		})
		
		it(`Object.getOwnPropertyDescriptor(t, "method").value`,()=>{
			
			assert.throws(
				()=>{
					let pd = Object.getOwnPropertyDescriptor(t, "method");
					pd.value();
				}
			)
		})
		
		it(`added method access "this["method"]"`,()=>{
			assert.throws(
				()=>{
					t["newMethod"] = function(){
						this["method"]();
					};
					t["newMethod"]();
				}
			)
		})
		
		it(`added method access "t["method"]"`,()=>{
			t["newMethod"] = () =>{
				t["method"]();
			};
			assert.throws(
				()=>{
					t["newMethod"]();
				}
			)
		})
		
		it(`metadata added access`,()=>{
			let meta = Reflect.getMetadataKeys(t.callMethod)[0];
			t["metaMethod"] = function(){
				this["method"]();
			};
			Reflect.defineMetadata(
				meta,
				MethodTest.prototype.constructor,
				t["metaMethod"]
			);
			//t["metaMethod"]();
			assert.throws(
				()=>{
					t["metaMethod"]();
				}
			);
			
		});
		
		it(`defined property & metadata added access1`,()=>{
			const propName = "definedMetaMethod";
			Object.defineProperty(
				t,
				propName,
				{
					value:function(){
						this["method"]();
					}
				}
			)
			
			let meta = Reflect.getMetadataKeys(t.callMethod)[0];
			Reflect.defineMetadata(
				meta,
				MethodTest.prototype.constructor,
				t[propName]
			);
			assert.throws(
				()=>{
					t[propName]();
				}
			);
			
		});
		
		it(`defined property & metadata added access2`,()=>{
			const propName = "definedMetaMethod2";
			Object.defineProperty(
				t,
				propName,
				{
					get:function(){
						this["method"]();
					}
				}
			)
			
			let meta = Reflect.getMetadataKeys(t.callMethod)[0];
			
			assert.throws(
				()=>{
					Reflect.defineMetadata(
						meta,
						MethodTest.prototype.constructor,
						t[propName]
					);
					t[propName];
				}
			);
			
		});
	});
	
	context("extended class access",()=>{
		class ExTest extends MethodTest{
			constructor(){
				super();
			}
			
			callMethodFromChildMethod(){
				return this["method"]();
			}
			
		}
		let ext:ExTest;
		beforeEach(()=>{
			ext = new ExTest();
		});
		
		it("ext.callMethod() should not be error",()=>{
			assert.doesNotThrow(
				()=>{
					t.callMethod();
				}
			)
		});
		
		it("ext.callMethodFromChildMethod() should be error",()=>{
			assert.throws(
				()=>{
					ext.callMethodFromChildMethod();
				}
			)
		});
		
		
	});
	
	
});