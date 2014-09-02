/*
	This script adds a function called nova to galaxy which allows you to
	galaxy.star functions which have a callback in the form of
	function (error, result1, result2, ...)

	The user needs to provide an array of argument names
	[name1, name2, ...] and it will convert the callback
	into a function (error, result) where result is
	{
		name1: result1,
		name2: result2,
		...
	}

	This has been superceeded by https://github.com/bjouhier/galaxy/commit/ef5e174568ae346e5154cade98e28c4b2d0a6ab5
	which lets your use galaxy.star with options. So don't use it anymore.
*/
(function () {
	var galaxy = require('galaxy');
	galaxy.nova = function(obj, method, names) {
		return function() {
			var args = Array.prototype.slice.call(arguments, 0);
			var func = args[args.length - 1];
			if (typeof func == 'function') {
				args[args.length - 1] = function () {
					var result = { };
					for (var i = 0; i < names.length; i++) {
						result[names[i]] = arguments[i + 1];
					}
					func(arguments[0], result);
				};
			}
			return method.apply(obj, args);
		};
	};

	galaxy.augment = function (object, funcname, resultCallback, callbackCallback) {
		var func = object[funcname];
		object[funcname] = function() {
			var args = Array.prototype.slice.call(arguments, 0);
			var cb = args[args.length - 1];
			if (typeof cb === 'function') {
				args[args.length - 1] = function () {
					var args = Array.prototype.slice.call(arguments, 0);
					if (callbackCallback) {
						callbackCallback(args[1]);
					}
					cb.apply(null, args);
				};
			}
			var res = func.apply(object, args);
			if (resultCallback) {
				resultCallback(res);
			}
			return res;
		};
	};

	if (module.parent) {
		return;
	}

	function test(callback) {
		if (callback) {
			callback(null, 2014, 2, 15);
		}
	};

	galaxy.main(function *() {
		var testAsync = galaxy.star(nova(null, test, ["year", "month", "day"]));
		console.log(yield testAsync());
	});
})();

