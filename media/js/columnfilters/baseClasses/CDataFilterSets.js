// Collection for the DataFiltersControlBar class
var CDataFilterSets = Backbone.Collection.extend({
	'model':MFilterSet,
	
	'initialize':function(options) {
		if(_.has(options,'url')) {
			this.url = options.url;
		}
	}
});