/*
 * fork.js API unit tests
 *
 * @author Federico "Lox" Lucignano <https://plus.google.com/117046182016070432246>
 */

describe("API", function(){
	describe("fork", function(){
		var a = function(){};

		it("should be a function", function(){
			expect(fork instanceof Function).toBe(true);
		});
	});
});
