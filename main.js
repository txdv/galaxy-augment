/*
	This library lets you augment callback parameters of functions as well.
*/
(function () {
	var galaxy = require('galaxy');
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
		var testAsync = galaxy.star(test, { returnObject: ["year", "month", "day"] });
		console.log(yield testAsync());
	});
})();
