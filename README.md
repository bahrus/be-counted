# be-counted

*be-counted* enables an HTML button (for example) to keep track of how many times it has been clicked.

Or in twitterese - it provides a primitive signal on an island of interactivity, which reactively renders to the UI the number of times the button was clicked.

[![Playwright Tests](https://github.com/bahrus/be-counted/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-counted/actions/workflows/CI.yml)

<a href="https://nodei.co/npm/be-counted/"><img src="https://nodei.co/npm/be-counted.png"></a>

Size of package, including custom element behavior framework (be-decorated):

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-counted?style=for-the-badge)](https://bundlephobia.com/result?p=be-counted)

Size of new code in this package:

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-counted?compression=gzip">


## Sample syntax:

```html
<span></span>
<button be-counted='{
    "transform": {
        "span": "value"
    }
}'>Count</button>
```

The scope of the transform is configured  via the transformScope setting.

Adorning the button element with be-counted causes it to emit event be-decorated.counted.value-changed when the value of the counter changes.  The value of the count can also be obtained via: oButton.beDecorated.counted.value.

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
     * DTR transform to perform when count hits the maximum value
     * See https://github.com/bahrus/trans-render for syntax
     */
    transformWhenMax?: any;
    /**
     * DTR transform to perform after count increments
     * See https://github.com/bahrus/trans-render for syntax
     */
    transform?: {[key: string]: MatchRHS};
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

One important use case for *be-counted* -- disabling a button once it's been clicked:

```html
<span></span>
<button be-counted='{
    "lt": 2,
    "transform": {
        "span": "value"
    },
    "transformWhenMax": {
        ":initiator": {"disabled": true}
    }
}'>Count</button>
```

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

