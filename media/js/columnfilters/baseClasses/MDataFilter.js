// Data Column Filters Container Model
var MDataFilter = Backbone.Model.extend({
	/*
	when the collection pulls data down it will be in this format:
	[]{
		name:<string> the descriptive name
		category:<string> key for separating data filters
		collection:[]{
			name:<string> the descriptive name for labels
			column:<string> the table column name used in the query
			type:<string> the type of data
			filters:collection[] {
				description:<string>
				value:<custom>
		}
	}
	*/
	
	initialize:function(options) {
		
	}
});
