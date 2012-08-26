/**
 * A cross-platform callback processor for non-blocking JavaScript
 *
 * @author Federico "Lox" Lucignano <http://plus.ly/federico.lox>
 * 
 * @see https://github.com/federico-lox/fork.js
 * @see http://jsfiddle.net/federico_lox/r2ey7/
 */

/*global define, module*/
(function (context) {
	'use strict';

	//help minification
	var undefType = 'undefined',
		dfqProto,
		run;

	if (context.postMessage) {
		//browsers with cross-origin communication support
		run = function (func) {
			var pid = Math.random().toString(),
				proc;

			proc = function (e) {
				if (e.data === pid) {
					func();
					context.removeEventListener('message', proc, true);
				}
			};

			context.addEventListener('message', proc, true);
			context.postMessage(pid, '*');
		};
	} else if (typeof process !== undefType) {
		//Node
		run = function (func) {
			process.nextTick(func);
		};
	} else if (typeof setTimeout !== undefType) {
		//older browsers and exotic plarforms,
		//e.g. Applcelerator Titanium Mobile
		run = function (func) {
			setTimeout(func, 0);
		};
	} else {
		//Sad JS environment is sad :(
		run = function (func) {
			func();
		};
	}

	function Queue(callbacks) {
		this.callbacks = (callbacks instanceof Array) ?
				callbacks : [callbacks];
	}

	dfqProto = Queue.prototype;
	dfqProto.push = function (callback) {
		this.callbacks.push(callback);
	};

	dfqProto.run = run;

	function defer(callbacks) {
		return (new Queue(callbacks)).run();
	}

	defer.Queue = Queue;

	function init() {
		return defer;
	}

	//UMD
	if (typeof define === 'function' && define.amd) {
		//AMD module
		define('defer', init);
	} else if (typeof module === 'object' && module.exports) {
		//CommonJS module
		module.exports = init();
	} else {
		//traditional namespace
		context.fork = init();
	}

	//help garbage collection
	undefType = null;
}(this));