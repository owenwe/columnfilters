/* Data Column Filters Container Model
 * this model can be thought of as a named group of all the filters the user wants saved 
 * for instance, an instance of this model could contain filters that limit the results
 * of a automobile database table to only electric cars made in California 
*/
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
