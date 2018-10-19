const path = require('path');
const { rollup } = require('rollup');
const virtual = require('rollup-plugin-virtual');

exports.check = input => {
	const resolved = path.resolve(input);

	return rollup({
		input: '__agadoo__',
		plugins: [
			virtual({
				__agadoo__: `import ${JSON.stringify(resolved)}`
			})
		],
		onwarn: (warning, handle) => {
			if (warning.code !== 'EMPTY_BUNDLE') handle(warning);
		}
	}).then(bundle => bundle.generate({
		format: 'esm'
	})).then(output => {
		console.log(`\`\`\`\n${output.code}\n\`\`\``);

		return {
			shaken: output.code.replace(/^import .*$/gm, '').trim() === ''
		};
	});
};