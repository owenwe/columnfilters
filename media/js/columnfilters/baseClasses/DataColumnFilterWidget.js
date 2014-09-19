// DataColumnFilterWidget Class
var VDataColumnFilterWidget = Backbone.View.extend({
	type:'text',
	isVisible:false,
	filterTypes:[],
	activeType:function() {},
	getFilterValue:function() {},
	show:function() {
		this.isVisible = true;
		this.$el.show();
	},
	hide:function() {
		this.isVisible = false;
		this.$el.hide();
	},
	enable:function() {},
	disable:function() {},
	load:function(filterWidgetType) {},
	reset:function() {},
	
	tagName:'div',
	className:'cf-filter-widget',
	initialize:function(options) {
		if(options.hasOwnProperty('type')) {
			this.type = options.type;
		}
		//should be passed in: type, collection
		this.$el.addClass('cf-filter-widget-'+this.type);
		
		//build selector drop down
		var typeSelectorDropdown = $(document.createElement('ul')).attr({'role':'menu'}).addClass('dropdown-menu'),
			typeSelector = $(document.createElement('div')).addClass('cf-widget-type-selector btn-group pull-left').append(
				$(document.createElement('span')).addClass('cf-widget-type-label'),
				$(document.createElement('button')).attr({'type':'button','data-toggle':'dropdown'})
												   .addClass('btn btn-default btn-xs dropdown-toggle')
												   .append('<span class="cf-widget-type-selector-btn-title"></span> <span class="caret"></span>'),
				typeSelectorDropdown
		),
			typesContainer = $(document.createElement('div')).addClass('cf-widget-types-container pull-left');
		if(options.hasOwnProperty('collection')) {
			$('span.cf-widget-type-selector-btn-title',typeSelector).html(options.collection.at(0).attributes.type);
			options.collection.each(function(widgetType) {
				widgetType.attributes.$el.hide();
				typeSelectorDropdown.append(
					$(document.createElement('li')).append(
						$(document.createElement('a')).attr({'href':'#'})
													  .html(widgetType.attributes.type)
													  .click(
													  	{'selectedType':widgetType.attributes},
														evtFunc_FilterWidgetTypeSelected)
					)
				);
				typesContainer.append(widgetType.attributes.el);
			});
			//show the first widget type
			options.collection.at(0).attributes.$el.show();
		}
		this.$el.append([typeSelector,typesContainer]);
	},
	render:function() { return this; }
});
