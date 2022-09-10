# be-counted

*be-counted* enables an HTML button (for example) to keep track of how many times it has been clicked.

Or in twitter-speak - it provides a primitive signal on an island of interactivity, which reactively renders to the UI the number of times the button was clicked.

## Sample syntax:

```html
<span></span>
<button be-counted='{
    "transformWhenInc": {
        "span": "value"
    }
}'>Count</button>
```