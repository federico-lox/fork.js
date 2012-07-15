/**
 * A cross-platform callback processor for non-blocking JavaScript
 *
 * @author Federico "Lox" Lucignano <https://plus.google.com/117046182016070432246>
 * @see https://github.com/federico-lox/fork.js
 */
(function(context){
	//help minification
	var undefType = 'undefined';

	function init(){
		if(context.postMessage){
			//browsers with cross-origin communication support
			return function(func){
				var pid = Math.random().toString(),
					proc;

				proc = function(e){
					if(e.data === pid){
						func();
						context.removeEventListener('message', proc, true);
					}
				};

				context.addEventListener('message', proc, true);
				context.postMessage(pid, '*');
			};
		}else if(typeof process !== undefType){
			//Node
			return function(func){
				process.nextTick(func);
			};
		}else if(typeof setTimeout !== undefType){
			//older browsers and exotic plarforms, e.g. Applcelerator Titanium Mobile
			return function(func){
				setTimeout(func, 0);
			};
		}else{
			//Sad JS environment is sad :(
			return function(func){
				func();
			};
		}
	}

	//UMD
	if(typeof define === 'function' && define.amd){
		//AMD module
		define('fork', init);
	}else if(typeof module === 'object' && module.exports){
		//CommonJS module
		module.exports = init();
	}else{
		//traditional namespace
		context.fork = init();
	}

	//help garbage collection
	undefType = null;
}(this));