# agadoo

*[Ag-a-doo-doo-doo, push pineapple, shake the tree](https://www.youtube.com/watch?v=POv-3yIPSWc)*


## What this does

Tells you whether the JavaScript library you're building is tree-shakeable.

## What it doesn't do

Tell you why tree-shaking fails, if it does. Maybe in a future version.

## Hold up — tree what now?

With the advent of JavaScript modules (`import` and `export`), it's possible to build libraries that are *tree-shakeable*. This means that a user of your library can import just the bits they need, without burdening their users with all the code they're *not* using.

For example, the [eases-jsnext](https://github.com/Rich-Harris/eases-jsnext) library contains a grab-bag of [Robert Penner's easing equations](http://robertpenner.com/easing/), presented as a JavaScript module. I can use it like this in my code...

```js
import * as eases from 'eases-jsnext';

for (let t = 0; t <= 1; t += 0.05) {
  const eased = eases.cubicInOut(t)
  const str = repeat('*', eased * 20);
  console.log(str);
}

function repeat(str, num) {
  let result = '';
  num = Math.round(num);
  while (num--) result += str;
  return result;
}
```

...and all the easing functions that I *haven't* used will get removed during bundling, if I'm using a modern bundler such as Rollup, webpack or Parcel. Here's what that bundle would look like with Rollup:

```js
'use strict';

function cubicInOut(t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0
}

for (let t = 0; t <= 1; t += 0.05) {
  const eased = cubicInOut(t);
  const str = repeat('*', eased * 20);
  console.log(str);
}

function repeat(str, num) {
  let result = '';
  num = Math.round(num);
  while (num--) result += str;
  return result;
}
```

...and here's the result of running it:

```

*
*
**
***
*****
*******
**********
*************
***************
*****************
******************
*******************
*******************
********************
********************
********************
```

But I digress. The point is that this works because eases-jsnext is a tree-shakeable library.


## Using agadoo

Inside your project folder, run Agadoo like so:

```bash
npx agadoo
```

You can install it as a development dependency and run it each time you `npm publish` — if tree-shaking fails, publishing will be aborted:

```bash
npm install -D agadoo
```

```js
// package.json
{
  "scripts": {
    "prepublishOnly": "agadoo"
  }
}
```

You can specify the module if necessary:

```bash
agadoo dist/my-library.js
```


## Help! My library isn't tree-shakeable and I'm not sure why

Firstly, make sure you're exposing a JavaScript module using the "module" field of your package.json (aka [pkg.module](https://github.com/rollup/rollup/wiki/pkg.module)).

If tree-shaking still fails, it's because Rollup thinks that there are side-effects somewhere in your code. Follow these guidelines:

* Avoid transpilers like Babel and Bublé (and if you're using TypeScript, target a modern version of JavaScript)
* Export plain functions
* Don't create instances of things on initial evaluation — instantiate lazily, when the functions you export are called


## License

[LIL](LICENSE).