const path = require('path');
const { rollup } = require('rollup');
const virtual = require('rollup-plugin-virtual');

exports.check = async input => {
	const resolved = path.resolve(input);

	const bundle = await rollup({
		input: '__agadoo__',
		plugins: [
			virtual({
				__agadoo__: `import ${JSON.stringify(resolved)}`
			})
		],
		onwarn: (warning, handle) => {
			if (warning.code !== 'EMPTY_BUNDLE') handle(warning);
		}
	});

	const output = await bundle.generate({
		format: 'esm'
	});

	console.log(output.code);

	return {
		shaken: output.code.trim() === ''
	};
};