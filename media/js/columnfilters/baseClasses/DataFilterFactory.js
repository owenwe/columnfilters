// DataFilterFactory Class
// collection: a collection of VDataColumnFilterWidget objects
var VDataFilterFactory = Backbone.View.extend({
	'types':[],
	'activeColumn':null,
	
	'notify':function(level, title, message) {
		this.trigger('notify', level, title, message);
	},
	
	'savedState':null,
	'saveState':function() {
		var af = this.activeFilter();
		if(af) {
			var fw = af.activeType();
			this.savedState = {
				'type':af.type,
				'label':af.getLabel(),
				'subtype':fw.attributes.type
			};
			if(af.type==='enum' || af.type==='biglist') {
				_.extend(this.savedState, {'dataCol':fw.attributes.model.get('currentColumn')});
			}
		} else {
			this.savedState = null;
		}
	},
	'restoreState':function() {
		if(this.savedState) {
			this.load(this.savedState.dataCol, this.savedState.type, this.savedState.label, this.savedState.subtype);
		} else {
			//check if there is an active filter; hide it if so
			var af = this.activeFilter();
			if(af) {
				af.hide();
			}
		}
	},
	
	'activeFilter':function(){
		//return any active && visible filter widgets (should only be 1)
		var af = this.collection.findWhere({'active':true,'visible':true});
		return af?af.attributes:false;
	},
	
	'getFilterValue':function() {
		return this.activeFilter().activeType().attributes.getValue();
	},
	
	'setFilterValue':function(filter) {
		//first we have to find the current filter widget
		var fw = this.collection.findWhere({'type':filter.type});
		if(fw) {
			// fw is a DataColumnFilterWidget (container of widgets of a specific type)
			fw.attributes.setFilterValue(filter.filterValue);
		}
		return this;
	},
	
	'updateFilterLabel':function(newLabel) {
		if(_.isString(newLabel)) {
			var af = this.activeFilter();
			if(af) {
				af.setLabel(newLabel);
			}
		}
	},
	
	'updateMultiColumnFilter':function(columns) {
		switch(this.activeFilter().type) {
			case 'biglist':
				this.activeFilter().activeType().attributes.updateMultiColumns(columns);
				break;
		}
	},
	
	'show':function() {
		var af = this.activeFilter();
		if(af){
			af.show();
		}
		return this;
	},
	'hide':function() {
		var af = this.activeFilter();
		if(af){
			af.hide();
		}
		return this;
	},
	
	'enable':function() {
		//enable the active filter
		var af = this.activeFilter();
		if(af){
			af.enable();
		}
		return this;
	},
	'disable':function() {
		//disable the active filter
		var af = this.activeFilter();
		if(af) {
			af.disable();
		}
		return this;
	},
	
	'reset':function(resetAll) {
		if(resetAll) {
			
		} else {
			var af = this.activeFilter();
			if(af) {
				af.reset();
				af.setLabel('');
			}
		}
		return this;
	},
	
	// displays the requested filter widget type
	'load':function(dataCol, dataType, dataLabel, subType) {
		//console.log(['dataCol: ',dataCol, ', dataType: ',dataType, ', dataLabel: ', dataLabel, ', subType: ', subType].join(''));
		//find it in the collection
		var reqfw = this.collection.findWhere({'type':dataType}),
			curfw = this.activeFilter();
		if(reqfw) {
			//if not asking for the currently visible filter widget, and there is one visible, hide it
			if(curfw && (curfw.cid!=reqfw.cid)) {
				curfw.hide();
			}
			
			//set the data label for the widget
			reqfw.attributes.setLabel(dataLabel);
			
			//perform any extra tasks before showing filter widget
			//for enum types
			if(reqfw.attributes.type==='enum') {
				//tell the widget to set up for dataCol
				reqfw.attributes.getSubType('in').attributes.config(dataCol);
			} else if(reqfw.attributes.type==='biglist') {
				// change out biglist filter widget data
				reqfw.attributes.getSubType('equals').attributes.config(dataCol);
			}
			
			//show the requested filter widget
			reqfw.attributes.show();
			
			if(_.isString(subType)) {
				reqfw.attributes.changeSubType(subType);
			}
		}
		return this;
	},
	
	// 
	'postConfig':function() {
		this.collection.each(function(filterWidget) {
			filterWidget.attributes.setFactory(this);
		}, this);
	},
	
	
	'tagName':'div',
	'className':'cf-filter-factory',
	'initialize':function(options) {
		if(options.hasOwnProperty('collection')) {
			// collection of VDataColumnFilterWidget (where models[n].attributes == VDataColumnFilterWidget)
			this.types = options.collection.pluck('type');
			
			// append the filter widget DOM element to the filter factory element
			var that = this;
			this.$el.append($.map(options.collection.models, function(fwm) {
				return fwm.attributes.$el.hide();//this works
			}));
			
			if(options.hasOwnProperty('showOnInit') && options.showOnInit) {
				options.collection.at(0).attributes.show();
			}
		} else {
			console.error('a collection must be passed with the VDataFilterFactory constructor.');
		}
	},
	'render':function() { return this; }
});
