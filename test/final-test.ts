/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/lib.es6.d.ts" />


import * as assert from 'power-assert';
import {final} from '../src/final';

	
@final class NoExtend{}



describe(`@final decorated class`,()=>{
	
	//@final class NoExtend{}	//decorated class occured error in mocha/guess-typescript
	
	context(`NoExtend -> Childclass -> GrandchildClass`,()=>{
		it(`base class should not be error`,()=>{
			assert.doesNotThrow(()=>{
				new NoExtend();
			})
		})
		
		class ChildClass extends NoExtend{}
		
		it(`new ChildClass() should be error`,()=>{
			assert.throws(()=>{
				new ChildClass();
			})
		});
		
		class GrandchildClass extends NoExtend{} 
		
		it(`new GrandchildClass() should be error`,()=>{
			assert.throws(()=>{
				new GrandchildClass();
			})
		});
	})
})

class BaseClass{}
@final class NoExtendChild extends BaseClass{}
class AnotherChild extends BaseClass{}
class NoExtendGrandchild extends NoExtendChild{}
class AnotherGrandchild extends AnotherChild{}

describe(`@final decorated class`,()=>{
	context(`BaseClass -> NoExtendChild -> NoExtendGrandchild`,()=>{
		
		it(`new BaseClass() should not be error`,()=>{
			assert.doesNotThrow(()=>{
				new BaseClass();
			})
		})
		
		it(`new NoExtendChild() should not be error`,()=>{
			assert.doesNotThrow(()=>{
				new NoExtendChild();
			})
		})
		
		it(`new NoExtendGrandchild() should be error`,()=>{
			assert.throws(()=>{
				new NoExtendGrandchild();
			})
		})
	})
	
	context(`BaseClass -> AnotherChild -> AnotherGrandchild`,()=>{
		it(`new AnotherChild() should not be error`,()=>{
			assert.doesNotThrow(()=>{
				new AnotherChild();
			})
		})
		it(`new AnotherGrandchild() should not be error`,()=>{
			assert.doesNotThrow(()=>{
				new AnotherGrandchild();
			})
		})
	})
	
	
	
})
