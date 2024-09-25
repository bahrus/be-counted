# be-counted (🔢) [TODO]

*be-counted* enables an HTML button (for example) to keep track of how many times it has been clicked.  

Or in twitterese - it provides a primitive signal on an island of interactivity, which reactively renders to the UI the number of times the button was clicked.

*be-counted* is one of many enhancements/decorators/behaviors based on [*be-enhanced*](https://github.com/bahrus/be-enhanced).

[![Playwright Tests](https://github.com/bahrus/be-counted/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-counted/actions/workflows/CI.yml)
[![NPM version](https://badge.fury.io/js/be-counted.png)](http://badge.fury.io/js/be-counted)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-counted?style=for-the-badge)](https://bundlephobia.com/result?p=be-counted)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-counted?compression=gzip">


## Example 1 Counting silently [TODO]

```html
<button id=oButton be-counted>Count</button>
```


The value of the count can be obtained via (more or less):

```JavaScript
oButton.beEnhanced.beCounted.value;
oButton.beEnhanced.beCounted.addEventListener('value', e => {
    ...
})
```

"More or less" refers to needing to wait for the enhancement to load, which is a bit of a pain:

```JavaScript
await import('be-counted/behivior.js'0;
const beCounted = oButton.beEnhanced.whenResolved('be-counted');
console.log({value: beCounted.value});
beCounted.addEventListener('value', e => {
    // value has changed
})
```

To  alleviate that pain, be-counted has some built in mechanisms for sharing the value

## Example 2 Sharing the value

```html
<span></span>
<button be-counted="and share value with span">Count</button>
```

Specifying the places to share the value with is done via [DSSArray notation](https://github.com/bahrus/trans-render/wiki/VIII.--Directed-Scoped-Specifiers-(DSS)).

## Full specification

The full [specification](https://github.com/bahrus/be-counted/blob/baseline/types.d.ts) for this decorator is shown below:

```TypeScript
export interface EndUserProps {
    /**
     * How much to increment on each event
     */
    step?: number;
    /**
     * Don't allow count to exceed this number
     */
    ltOrEq?: number;
    /** Don't allow count to reach this number. */
    lt?: number;
    /**
     * Starting value of count, including after looping
     */
    min?: number;
    /**
     * Make count loop back to min value after hitting the ceiling set by ltOrEq or lt
     */
    loop?: boolean;
    /**
     * TR transform to perform after count increments
     * See https://github.com/bahrus/trans-render for syntax
     */
    xform?: XForm;
    /**
     * Specify how wide the surrounding DOM should be subject to the transformation.
     * Values specified here: https://github.com/bahrus/trans-render/blob/baseline/lib/types.d.ts#L388
     */
    transformScope?: Scope;
    /**
     * Slowly "awaken" a disabled element.  If the disabled attribute is not set to a number, or is set to "1", removes the disabled attribute.  If it is a larger number, decrements the number by 1. 
     */
    nudge?: boolean;
    /**
     * Event name to trigger count increment
     */
    incOn?: string;
    /**
     * Property to subscribe to trigger count increment
     */
    incOnSet?: string;
    
}
```


## Use case:  disable on click

One important use case for *be-counted* -- disabling a button once it's been clicked:

## JavaScriptObjectNotation

```html
<span></span>
<button be-counted='{
    "lt": 2,
    "transform": {
        "span": "value"
    },
    
}'>Count</button>
```



## Running locally

1.  Do a git clone or a git fork of repository https://github.com/bahrus/be-committed
2.  Install node.js
3.  Run "npm install" from location of folder created in step 1.
4.  Run npm run serve.  Open browser to http://localhost:3030/demo/

## Using from ESM Module:

```JavaScript
import 'be-counted/be-counted.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-counted';
</script>
```

