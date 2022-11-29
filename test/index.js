import fs from 'fs';
import path from 'path';
import c from 'kleur';
import child_process from 'child_process';
import { fileURLToPath } from 'url';

const agadoo = fileURLToPath(new URL('../cli.js', import.meta.url));

const exec = (cmd) =>
	new Promise((fulfil, reject) => {
		child_process.exec(cmd, (err, stdout, stderr) => {
			if (err) {
				reject(err);
			} else {
				fulfil();
			}
		});
	});

const pass = path.resolve('test/pass');
const fail = path.resolve('test/fail');

let failed = false;

{
	const dirs = fs.readdirSync(pass);

	console.log(c.bold().cyan('should pass'));

	for (const dir of dirs) {
		process.chdir(`${pass}/${dir}`);

		try {
			await exec(agadoo);
			console.log(`${c.bold().green('✓')} ${dir}`);
		} catch (err) {
			failed = true;
			console.log(`${c.bold().red('✗')} ${dir}`);
		}
	}
}

console.log();

{
	const dirs = fs.readdirSync(fail);

	console.log(c.bold().cyan('should fail'));

	for (const dir of dirs) {
		process.chdir(`${fail}/${dir}`);

		try {
			await exec(agadoo);
			failed = true;
			console.log(`${c.bold().red('✗')} ${dir}`);
		} catch (err) {
			console.log(`${c.bold().green('✓')} ${dir}`);
		}
	}
}

console.log();

if (failed) {
	console.log('FAILED\n');
	process.exit(1);
}
