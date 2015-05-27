// DataColumnFilterWidget Class
// collection: a collection of VFilterWidgetType (extended to an instance)
var VDataColumnFilterWidget = Backbone.View.extend({
	'type':'text',
	'visible':false,
	'active':false,
	
	'notify':function(level, title, message) {
		//console.log('VDataColumnFilterWidget notification event ('+level+', '+title+', '+message+')');
		this.getFactory().notify(level,title,message);
		this.trigger('notify', level, title, message);
	},
	'factory':[null],//hack to get a Backbone object to update a property
	'getFactory':function() {
		return this.factory[0];
	},
	'setFactory':function(f) {
		this.factory[0] = f;
	},
	
	'activeType':function() {
		return this.collection.findWhere({active:true});
	},
	'getSubType':function(subType) {
		return this.collection.findWhere({'type':subType});
	},
	
	'getFilterValue':function() {
		var at = this.activeType();
		if(at) {
			return at.getValue();
		} else {
			return false;
		}
	},
	
	'setFilterValue':function(filterValue) {
		var fwt = this.collection.findWhere({'type':filterValue.type});
		if(fwt) {
			// fwt is the sub filter widget
			fwt.attributes.setValue(filterValue);
		}
	},
	
	'getLabel':function() {
		return $('div.cf-widget-type-label',this.$el).html();
	},
	'setLabel':function(label) {
		$('div.cf-widget-type-label',this.$el).html(label);
	},
	
	'changeSubType':function(subType) {
		var at = this.activeType(),
			selAt = this.collection.findWhere({'type':subType});
		if(at && (subType!=at.attributes.type)){
			//change filter widget type selector label
			$('span.cf-widget-type-selector-btn-title', this.$el).html(subType);
			//hide current widget type
			at.attributes.hide();
			//show selected widget type
			selAt.attributes.show();
		}
	},
	
	'show':function() {
		this.visible = true;
		this.active = true;
		this.$el.show();
		//render the active type
		var at = this.activeType();
		if(at) {
			//console.log(this.type+':'+at.attributes.type);
			at.attributes.show();
		}
	},
	'hide':function() {
		this.visible = false;
		this.active = false;
		this.$el.hide();
	},
	
	'enable':function() {
		var ddbtn = $('button.dropdown-toggle',this.$el);
		if(ddbtn) {
			ddbtn[0].disabled = false;
		}
		var at = this.activeType();
		if(at) {
			at.attributes.enable();
		}
	},
	'disable':function() {
		//disable the drop down
		var ddbtn = $('button.dropdown-toggle',this.$el);
		if(ddbtn) {
			ddbtn[0].disabled = true;
		}
		
		//need to get active widget and call disable on it
		var at = this.activeType();
		if(at) {
			at.attributes.disable();
		}
	},
	
	'reset':function() {
		this.collection.each(function(filterWidget) {
			filterWidget.attributes.reset();
		});
	},
	
	'tagName':'div',
	'className':'cf-filter-widget row',
	
	'events':{
		// triggered when the type dropdown item is clicked
		'click ul.dropdown-menu li a':function(e) {
			this.changeSubType($(e.currentTarget).html());
		}
	},
	
	'initialize':function(options) {
		// ASSERTION: options will always have type and collection passed
		if(options.hasOwnProperty('type')) {
			this.type = options.type;
		} else {
			console.error('"type" must be passed with VDataColumnFilterWidget constructor');
		}
		
		this.$el.addClass('cf-filter-widget-'+this.type);
		
		//build selector drop down
		var typeSelectorDropdown = $(document.createElement('ul')).attr({'role':'menu'}).addClass('dropdown-menu pull-right'),
			typeSelector = $(document.createElement('div')).addClass('cf-widget-type-selector col-lg-4 col-md-4 col-sm-6 col-xs-4 row btn-group').append(
				$(document.createElement('div')).addClass('cf-widget-type-label text-right text-nowrap col-lg-8 col-md-7 col-sm-7 col-xs-12'),
				$(document.createElement('button')).attr({'type':'button','data-toggle':'dropdown'})
												   .addClass('btn btn-default btn-xs dropdown-toggle col-lg-3 col-md-4 col-sm-4 col-xs-12')
												   .append('<span class="cf-widget-type-selector-btn-title"></span> <span class="caret"></span>'),
				typeSelectorDropdown
		),
			typesContainer = $(document.createElement('div')).addClass('cf-widget-types-container col-lg-8 col-md-8 col-sm-6 col-xs-8');
		
		if(options.hasOwnProperty('collection')) {
			var that = this;
			typesContainer.append($.map(options.collection.models, function(fwm) {
				typeSelectorDropdown.append(
					$(document.createElement('li')).append($(document.createElement('a')).attr({'href':'#'}).html(fwm.attributes.type))
				);
				that.listenTo(fwm.attributes, 'notify', that.notify);// these are the VFilterWidgetType implementations
				return fwm.attributes.$el.hide();
			}));
			
			var firstWidget = options.collection.at(0).attributes;
			// show the first widget type and set the type selector drop down button title to its type
			$('span.cf-widget-type-selector-btn-title',typeSelector).html(firstWidget.type);
			firstWidget.active = true;
			firstWidget.show();
		} else {
			console.error('a collection must be passed with VDataColumnFilterWidget constructor');
		}
		
		// add the type selector and types container to the DOM element
		this.$el.append([typeSelector,typesContainer]);
	},
	'render':function() { return this; }
});
