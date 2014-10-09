// DataFilterFactory Class
// collection: a collection of VDataColumnFilterWidget objects
var VDataFilterFactory = Backbone.View.extend({
	types:[],
	activeColumn:null,
	
	activeFilter:function(){
		//return any visible filter widgets (should only be 1)
		var af = this.collection.findWhere({active:true});
		return af?af.attributes:false;
	},
	
	getFilterValue:function() {
		return this.activeFilter().activeType().attributes.getValue();
	},
	
	setFilterValue:function(filter) {
		//first we have to find
		var fw = this.collection.findWhere({'type':filter.type});
		if(fw) {
			fw.attributes.reset();
			fw.attributes.setFilterValue(filter.filterValue);
		}
	},
	
	enable:function() {
		//enable the active filter
		var af = this.activeFilter();
		if(af){
			af.enable();
		}
	},
	disable:function() {
		//disable the active filter
		var af = this.activeFilter();
		if(af) {
			af.disable();
		}
	},
	
	// displays the requested filter widget type
	load:function(dataType,dataCol,dataLabel,subType) {
		//find it in the collection
		var reqfw = this.collection.findWhere({'type':dataType}),
			curfw = this.activeFilter();
		if(reqfw) {
			//if not asking for the currently visible filter widget, and there is one visible, hide it
			if(curfw && (curfw.cid!=reqfw.cid)) {
				curfw.hide();
			}
			//set the active column value
			this.activeColumn = dataCol;
			
			//set the data label for the widget
			reqfw.attributes.setLabel(dataLabel);
			
			//show the requested filter widget
			reqfw.attributes.show();
			
			if(_.isString(subType)) {
				reqfw.attributes.changeSubType(subType);
			}
		}
	},
	
	
	tagName:'div',
	className:'cf-filter-factory',
	initialize:function(options) {
		
		if(options.hasOwnProperty('collection')) {
			var ffEl = this.$el,
				ffTypes = this.types;
			options.collection.each(function(filterWidget) {
				filterWidget.attributes.hide();
				ffEl.append(filterWidget.attributes.el);
				ffTypes.push(filterWidget.attributes.type);
			});
			
			if(options.hasOwnProperty('showOnInit') && options.showOnInit) {
				options.collection.at(0).attributes.show();
			}
		}
	},
	render:function() {
		return this;
	}
});
