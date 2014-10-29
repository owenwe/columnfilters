// DataFilterFactory Class
// collection: a collection of VDataColumnFilterWidget objects
var VDataFilterFactory = Backbone.View.extend({
	types:[],
	activeColumn:null,
	
	savedState:null,
	saveState:function() {
		var af = this.activeFilter();
		if(af) {
			var fw = af.activeType();
			//console.log(af);
			//console.log(fw);
			this.savedState = {
				'dataCol':fw.attributes.currentColumn,
				'type':af.type,
				'label':af.getLabel(),
				'subtype':fw.attributes.type
			};
		} else {
			this.savedState = null;
		}
	},
	restoreState:function() {
		if(this.savedState) {
			//console.log(this.savedState);
			this.load(this.savedState.dataCol,this.savedState.type,this.savedState.label,this.savedState.subtype);
		} else {
			//check if there is an active filter; hide it if so
			var af = this.activeFilter();
			if(af) {
				af.hide();
			}
		}
	},
	
	activeFilter:function(){
		//return any active && visible filter widgets (should only be 1)
		var af = this.collection.findWhere({'active':true,'visible':true});
		return af?af.attributes:false;
	},
	
	getFilterValue:function() {
		return this.activeFilter().activeType().attributes.getValue();
	},
	
	setFilterValue:function(filter) {
		//first we have to find the current filter widget
		var fw = this.collection.findWhere({'type':filter.type});
		if(fw) {
			fw.attributes.reset();
			fw.attributes.setFilterValue(filter.filterValue);
		}
		return this;
	},
	
	updateFilterLabel:function(newLabel) {
		if(_.isString(newLabel)) {
			var af = this.activeFilter();
			if(af) {
				af.setLabel(newLabel);
			}
		}
	},
	
	show:function() {
		var af = this.activeFilter();
		if(af){
			af.show();
		}
		return this;
	},
	hide:function() {
		var af = this.activeFilter();
		if(af){
			af.hide();
		}
		return this;
	},
	
	enable:function() {
		//enable the active filter
		var af = this.activeFilter();
		if(af){
			af.enable();
		}
		return this;
	},
	disable:function() {
		//disable the active filter
		var af = this.activeFilter();
		if(af) {
			af.disable();
		}
		return this;
	},
	
	reset:function(resetAll) {
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
	load:function(dataCol, dataType, dataLabel, subType) {
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
			}
			
			
			//show the requested filter widget
			reqfw.attributes.show();
			
			if(_.isString(subType)) {
				reqfw.attributes.changeSubType(subType);
			}
		}
		return this;
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
