const fs = require('fs');
const path = require('path');
const c = require('kleur');
const child_process = require('child_process');

const exec = cmd => new Promise((fulfil, reject) => {
	child_process.exec(cmd, (err, stdout, stderr) => {
		if (err) {
			reject(err);
		} else {
			fulfil();
		}
	});
});

async function main() {
	const pass = path.resolve('test/pass');
	const fail = path.resolve('test/fail');

	let failed = false;

	{
		const dirs = fs.readdirSync(pass);

		console.log(c.bold().cyan('should pass'));

		for (const dir of dirs) {
			process.chdir(`${pass}/${dir}`);

			try {
				await exec(`agadoo`);
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
				await exec(`agadoo`);
				failed = true;
				console.log(`${c.bold().red('✗')} ${dir}`);
			} catch (err) {
				console.log(`${c.bold().green('✓')} ${dir}`);
			}
		}
	}

	console.log();

	if (failed) {
		process.exit(1);
	}
}

main();