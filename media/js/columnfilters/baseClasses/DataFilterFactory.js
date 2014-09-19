// DataFilterFactory Class
var VDataFilterFactory = Backbone.View.extend({
	types:[],
	activeFilter:function(){
		//return any visible filter widgets (should only be 1)
		//can we use the collection to find
		console.log(this.collection);
		
		return $('div.cf-filter-widget:visible',this.$el);
	},
	getFilterValue:function() {},
	enable:function() {},
	disable:function() {},
	load:function(dataCol,dataLabel) {
		//find it in the collection
		var reqfw = this.collection.findWhere({'type':dataCol}),
			curfw = this.activeFilter();
		if(reqfw) {
			//if not asking for the currently visible filter widget, and there is one visible, hide it
			if(curfw) {
				curfw.hide();
			}
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
