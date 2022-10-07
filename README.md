# be-counted

*be-counted* enables an HTML button (for example) to keep track of how many times it has been clicked.

Or in twitter-speak - it provides a primitive signal on an island of interactivity, which reactively renders to the UI the number of times the button was clicked.

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


## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-counted';
</script>
```

