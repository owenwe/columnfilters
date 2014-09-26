// Data Filters Container Controller
var VDataFiltersContainer = Backbone.View.extend({
	
	/*
	this is only the view for the current filter group, it should NOT control
	the interaction of filter groups, only add/edit/remove of the view elements
	*/
	
	//filterCollectionGroups:null,
	add:function(columnFilter, filterData) {
		// add filter to current filter group
		// ASSERTION: filterData will be valid
		// columnFilter: {group,column,label}
		// filterData: {type:, value:}
		console.log('adding filter to group');
		//
		//this.filterCollectionGroups.add(new MDataFilter(columnFilter));
		//console.log(this.filterCollectionGroups.models);
	},
	
	tagName:'div',
	className:'panel-body cf-data-filters-container',
	events:{},
	template:_.template(CFTEMPLATES.dataFiltersControlBody,{variable:'container'}),
	initialize:function(options) {
		/*
		.nav : add > <li><a href="#column1" role="pill" data-toggle="pill">Column 1 <span class="badge pull-right">99</span></a></li>
		.tab-content : add > <div class="tab-pane" id="column1">
								<div class="list-group">
									<a href="#" class="list-group-item">Cras justo odio</a> ...
		*/
		
		this.$el.append(this.template({}));
	},
	render:function() {
		return this;
	}
});