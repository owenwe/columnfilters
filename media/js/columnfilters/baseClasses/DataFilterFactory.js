// DataFilterFactory Class
var VDataFilterFactory = Backbone.View.extend({
	types:[],
	activeColumn:null,
	activeFilter:function(){
		//return any visible filter widgets (should only be 1)
		return this.collection.findWhere({active:true});
	},
	getFilterValue:function() {},
	enable:function() {
		//enable the active filter
		var af = this.activeFilter();
		if(af){
			af.attributes.enable();
		}
	},
	disable:function() {
		//disable the active filter
		var af = this.activeFilter();
		if(af) {
			af.attributes.disable();
		}
	},
	load:function(dataType,dataCol,dataLabel) {
		//find it in the collection
		var reqfw = this.collection.findWhere({'type':dataType}),
			curfw = this.activeFilter();
		if(reqfw) {
			//if not asking for the currently visible filter widget, and there is one visible, hide it
			if(curfw && (curfw.cid!=reqfw.cid)) {
				curfw.attributes.hide();
			}
			//set the active column value
			this.activeColumn = dataCol;
			
			//set the data label for the widget
			reqfw.attributes.setLabel(dataLabel);
			
			//show the requested filter widget
			reqfw.attributes.show();
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
				//filterWidget.attributes.$el.hide();
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
