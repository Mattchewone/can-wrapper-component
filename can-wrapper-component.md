@module {function} can-wrapper-component
@parent can-views
@collection can-ecosystem
@package ./package.json
@description This makes creating wrapper components much easier, so you can forward bindings down to specific child of the parent component.
@signature `wrapperComponent({ tag, view, ViewModel, elementToBindTo })`
`can-wrapper-component` exports a function used to define custom elements.
	
	@param {String} tag
	see [can-component.prototype.tag]
	@param {String} view
	see [can-component.prototype.view]
	@param {Object} ViewModel
	see [can-component.prototype.ViewModel]
	@param {Function} elementToBindTo
	A function that receives the frag which should return element in which to forward all bindings

@body

## Use
```html
<my-awesome-input></my-awesome-input>

<script type="module">
import { wrapperComponent } from "can/everything";

wrapperComponent({
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
</script>
```
@codepen

This will forward all bindings to the `input` except those specified in the `ViewModel` these will be used for the component `viewModel`.
