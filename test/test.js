var swigql = require('../lib/index.js');

swigql.init({
	root: '.',
	allowErrors: true
});


exports["simple replacement"] = function (test) {
	test.expect(2);
	var txt = 'x {% bind test1 %} y',
	render  = swigql.compile(txt, { filename: 'simple_replacement.sql' }),
	results = render({ test1: 'works' });

	test.strictEqual(results[0], 'x $1 y');
	test.deepEqual(results[1], ['works']);

	test.done();
};

exports["repeated replacement"] = function (test) {
	test.expect(2);

	var txt = 'x {% bind test1 %} {% bind test1 %} y',
	render  = swigql.compile(txt, { filename: 'repeated_replacement.sql' }),
	results = render({ test1: 'works' });

	test.strictEqual(results[0], 'x $1 $1 y');
	test.deepEqual(results[1], ['works']);

	test.done();
};

exports["multi replacement"] = function (test) {
	test.expect(2);

	var txt = 'x {% bind test1 %} {% bind test2 %} y',
	render  = swigql.compile(txt, { filename: 'multi_replacement.sql' }),
	results = render({ test1: 'works', test2: 'also' });

	test.strictEqual(results[0], 'x $1 $2 y');
	test.deepEqual(results[1], ['works', 'also']);

	test.done();
};

exports["repeated use"] = function (test) {
	test.expect(4);

	var txt = 'x {% bind test1 %} y',
	render  = swigql.compile(txt, { filename: 'repeated_use.sql' }),
	results = render({ test1: 'works' });

	test.strictEqual(results[0], 'x $1 y');
	test.deepEqual(results[1], ['works']);

	results = render({ test1: 'again' });

	test.strictEqual(results[0], 'x $1 y');
	test.deepEqual(results[1], ['again']);

	test.done();
	
};
