// DataColumnFilterWidget Class
var VDataColumnFilterWidget = Backbone.View.extend({
	type:'text',
	visible:false,
	filterTypes:[],
	activeType:function() {
		return this.collection.findWhere({visible:true});
	},
	getFilterValue:function() {},
	setLabel:function(label) {
		$('div.cf-widget-type-label',this.$el).html(label);
	},
	show:function() {
		this.visible = true;
		this.$el.show();
	},
	hide:function() {
		this.visible = false;
		this.$el.hide();
	},
	enable:function() {
		var ddbtn = $('button.dropdown-toggle',this.$el);
		if(ddbtn) {
			ddbtn[0].disabled = false;
		}
		var at = this.activeType();
		if(at) {
			at.attributes.enable();
		}
	},
	disable:function() {
		console.log('data column filter widget disable');
		//disable the drop down
		var ddbtn = $('button.dropdown-toggle',this.$el);
		if(ddbtn) {
			ddbtn[0].disabled = true;
		}
		
		//need to get active widget and call disable on it
		var at = this.activeType();
		if(at) {
			console.log('calling disable on active type');
			console.log(at);
			at.attributes.disable();
		}
	},
	reset:function() {},
	
	tagName:'div',
	className:'cf-filter-widget',
	events:{
		'click ul.dropdown-menu li a':function(e) {
			//this == view, e == event object
			//find the visible filter widget
			var at = this.activeType(),
				selectedTypeStr = $(e.currentTarget).html(),
				selAt = this.collection.findWhere({'type':selectedTypeStr});
			
			if(at && (selectedTypeStr!=at.attributes.type)){
				
				$('span.cf-widget-type-selector-btn-title', this.$el).html(selectedTypeStr);
				at.attributes.hide();
				
			}
		}
	},
	initialize:function(options) {
		if(options.hasOwnProperty('type')) {
			this.type = options.type;
		}
		//should be passed in: type, collection
		this.$el.addClass('cf-filter-widget-'+this.type);
		
		//build selector drop down
		var typeSelectorDropdown = $(document.createElement('ul')).attr({'role':'menu'}).addClass('dropdown-menu'),
			typeSelector = $(document.createElement('div')).addClass('cf-widget-type-selector btn-group pull-left').append(
				$(document.createElement('div')).addClass('cf-widget-type-label pull-left'),
				$(document.createElement('button')).attr({'type':'button','data-toggle':'dropdown'})
												   .addClass('btn btn-default btn-xs dropdown-toggle')
												   .append('<span class="cf-widget-type-selector-btn-title"></span> <span class="caret"></span>'),
				typeSelectorDropdown
		),
			typesContainer = $(document.createElement('div')).addClass('cf-widget-types-container pull-left');
		if(options.hasOwnProperty('collection')) {
			$('span.cf-widget-type-selector-btn-title',typeSelector).html(options.collection.at(0).attributes.type);
			var dsp = this.dispatcher;
			options.collection.each(function(widgetType) {
				widgetType.attributes.hide();
				typeSelectorDropdown.append(
					$(document.createElement('li')).append($(document.createElement('a')).attr({'href':'#'}).html(widgetType.attributes.type))
				);
				typesContainer.append(widgetType.attributes.el);
			});
			//show the first widget type
			options.collection.at(0).attributes.show();
		}
		this.$el.append([typeSelector,typesContainer]);
	},
	render:function() { return this; }
});
