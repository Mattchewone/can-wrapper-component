# can-wrapper-component

This makes creating wrapper like components much easier, so you can forward bindings down to specific child of the parent component.

Example:
```js
WrapperComponent({
	tag: "my-awesome-input",
	view: `
		<label>{{ labelText }}</label>
		<input />
	`,
	ViewModel: DefineMap.extend({
		labelText: {
			default: ''
		}
	}),
	elementToBindTo (frag) {
		return frag.children[1];
	}
});
```
This will forward all bindings to the `input` except those specified in the `ViewModel` these will be used for the component `viewModel`.

Usage:
```stache
{{ let inputVal = 'Initial Value' }}
<my-awesome-input value:bind="inputVal" labelText:from="'Name:'" />
```

Would render:
```html
<label>Name:</label>
<input value="Initial Value" />
```
