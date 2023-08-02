import path from 'path';
import { rollup } from 'rollup';
import * as acorn from 'acorn';
import virtual from '@rollup/plugin-virtual';

export async function check(input) {
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

	const result = await bundle.generate({
		format: 'esm'
	});

	const { code } = result.output[0];

	const ast = acorn.parse(code, {
		ecmaVersion: 'latest',
		sourceType: 'module'
	});

	const nodes = ast.body.filter((node) => {
		return node.type !== 'ImportDeclaration';
	});

	console.log(code);

	return {
		shaken: nodes.length === 0
	};
}
