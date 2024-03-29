#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { check } from './index.js';

const input = process.argv[2] || get_input();
const relative = path.relative(process.cwd(), input);

const result = await check(input);

if (result.shaken) {
	console.error(`Success! ${relative} is fully tree-shakeable`);
} else {
	error(`Failed to tree-shake ${relative}`);
}

function error(msg) {
	console.error(msg);
	process.exit(1);
}

function get_input() {
	if (!fs.existsSync('package.json')) {
		error(`Could not find package.json`);
	}

	const pkg = JSON.parse(fs.readFileSync('package.json'), 'utf-8');

	const unresolved = pkg.module || pkg.main || 'index';
	const resolved = resolve(unresolved);

	if (!resolved) {
		error(`Could not resolve entry point`);
	}

	return resolved;
}

function resolve(file) {
	if (is_directory(file)) {
		return if_exists(`${file}/index.mjs`) || if_exists(`${file}/index.js`);
	}

	return if_exists(file) || if_exists(`${file}.mjs`) || if_exists(`${file}.js`);
}

function is_directory(file) {
	try {
		const stats = fs.statSync(file);
		return stats.isDirectory();
	} catch (err) {
		return false;
	}
}

function if_exists(file) {
	return fs.existsSync(file) ? file : null;
}
