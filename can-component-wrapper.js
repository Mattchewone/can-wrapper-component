"use strict";

var stache = require("can-stache");
var stacheBindings = require("can-stache-bindings");
var viewCallbacks = require("can-view-callbacks");
var domMutate = require("can-dom-mutate");
var domData = require("can-dom-data-state");
var canReflect = require("can-reflect");
var namespace = require("can-namespace");

function wrapperComponent(options) {
	var tag = options.tag;
	var view = options.view;
	var ViewModel = options.ViewModel;
	var elementToBindTo = options.elementToBindTo;

	viewCallbacks.tag(tag, function(el, tagData) {
		domData.set.call(el, "preventDataBindings", true);
		var parentViewModel = new ViewModel();
		var frag = stache(view)(parentViewModel);
		
		// Get the schema for the VM passed in
		var ViewModelSchema = canReflect.getSchema(ViewModel);

		// Get a list of it's keys, we will assume that these define which
		// properties will be available on the actual component rather than the wrapped element
		var ViewModelSchemaKeys = Object.keys(ViewModelSchema.keys);

		var viewModelBindings = [],
			inputBindings = [];

		var childBindingContext = {
			element: elementToBindTo(frag),
			scope: tagData.scope,
			parentNodeList: tagData.parentNodeList
		};
		var parentBindingContext = {
			element: el,
			scope: tagData.scope,
			parentNodeList: tagData.parentNodeList,
			viewModel: null
		};

		var inputBindingSettings = {};
		// for (let attrNode of el.attributes) {
		for (var index = 0; index < el.attributes.length; index++) {
			var attrNode = el.attributes[index];
			var bindingData = stacheBindings.getSiblingBindingData(attrNode, {
				favorViewModel: true
			});
			if (ViewModelSchemaKeys.indexOf(bindingData.child.name) !== -1) {
				viewModelBindings.push(
					stacheBindings.makeDataBinding(attrNode, parentBindingContext, {
						favorViewModel: true
					})
				);
			} else {
				inputBindings.push(
					stacheBindings.makeDataBinding(
						attrNode,
						childBindingContext,
						inputBindingSettings
					)
				);
			}
		}

		stacheBindings.behaviors.initializeViewModel(
			viewModelBindings,
			{},
			function(props) {
				parentViewModel.update(props);
				return (parentBindingContext.viewModel = parentViewModel);
			},
			parentBindingContext
		);

		el.appendChild(frag);

		inputBindings.forEach(function(dataBinding) {
			dataBinding.binding.start();
		});

		domMutate.onNodeRemoval(el, function() {
			inputBindings.forEach(function(dataBinding) {
				dataBinding.binding.stop();
			});
		});
	});
}

module.exports = namespace.wrapperComponent = wrapperComponent;
