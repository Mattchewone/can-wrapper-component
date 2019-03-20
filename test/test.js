var QUnit = require("steal-qunit");
var wrapperComponent = require("can-wrapper-component");
var DefineMap = require("can-define/map/map");
var stache = require("can-stache");
var domEvents = require("can-dom-events");

QUnit.module("can-wrapper-component");

QUnit.test("can-wrapper-component pass attrs down to nested child", function () {
	wrapperComponent({
		tag: "my-input",
		view: `<input />`,
		ViewModel: DefineMap.extend({}),
		elementToBindTo (frag) {
			return frag.children[0];
		}
	});

	var template = stache("<my-input value:from='input' />")({
		input: 'initial'
	});

	var fixture = document.getElementById("qunit-fixture");
	fixture.appendChild(template);

	// Initial value was set on the input
	QUnit.equal(document.querySelector('input').value, "initial");
});

QUnit.test("can-wrapper-component split attrs between parent component and child component", function () {
	wrapperComponent({
		tag: "my-input-1",
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

	var template = stache("<my-input-1 value:from='input' labelText:from='text' />")({
		input: 'something special',
		text: 'My Input'
	});

	var fixture = document.getElementById("qunit-fixture");
	fixture.appendChild(template);

	// Input has a value
	QUnit.equal(document.querySelector('input').value, "something special");
	// Label has text
	QUnit.equal(document.querySelector('label').innerText, "My Input");
});

QUnit.test("can-wrapper-component bindings work", function () {
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

	var inputVM = new DefineMap({
		input: 'something special',
		text: 'Name:'
	});

	var template = stache("<my-awesome-input value:bind='input' labelText:from='text' />")(inputVM);

	var fixture = document.getElementById("qunit-fixture");
	fixture.appendChild(template);

	var input = document.querySelector('input');

	// Input has a value
	QUnit.equal(input.value, "something special");
	// Label has text
	QUnit.equal(document.querySelector('label').innerText, "Name:");

	// Change the input
	input.value = "updated value";
	domEvents.dispatch(input, "change");

	// Input has changed
	QUnit.equal(inputVM.get('input'), "updated value");
});
