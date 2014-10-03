/*
	Each of these are added to an array for the column.
	option: AND/OR
	checkbox: NOT
	
	text:(equality) [text input] -limit to [a-zA-z0-9] -no wildcards
		 (search) [text input] -limit to [a-zA-z0-9] -wildcards
	
	number:(equality) n [=,<,>,<=,>=] [number stepper] -number type
		   (between) [number stepper1] [<,<=] n [>,>=] [number stepper2]
		   (select) [dropdown input list] :: translates to {column} IN(...)
	
	date:(equality) d [=,<,>,<=,>=] [date input]
		 (between) [date input1] [<,<=] d [>,>=] [date input2]
		 (select) [date dropdown input list]
		 (billing cycle) [option:1-15, 16-eom] [month select] [year select]
		 (year) [year list] -min year
		 (month) [month list]
		 (month day) [month list] [day list]
		 (day) [1-31 dropdown]
		 (weekday) [week day list]
	
	boolean: [radio set] -true label -false label
	
	enum: [dropdown list (options have a checkbox)]
	
	biglist: [typeahead] -scrollable -custom templates 1)local, 2)prefetch 3)remote
	
	foreignkeyfilter: TODO --all the above search controls, but for the referenced table
	
*/

var tc,df;

$(document).ready(function(e) {
	
	//these will come from the data table
	//name = the column name used in the query
	//type = the data type
	//label = descriptve text for the column
	tc = [
		{'name':'text-column', 'type':'text', 'label':'Text'},
		{'name':'number-column', 'type':'number', 'label':'Number'},
		{'name':'date-column', 'type':'date', 'label':'Date'},
		{'name':'bool-column', 'type':'boolean', 'label':'Boolean'},
		{'name':'enum-column', 'type':'enum', 'label':'Enum'},
		{'name':'list-column', 'type':'big-list', 'label':'Big List'},
		{'name':'fk-column', 'type':'foreign-key', 'label':'Foreign Key'}
	],
		df = new VDataFilters({table:'employees', tableColumns:tc, showFirst:'date-column', filterCategories:['user','public']});
	
	$('div.container-fluid').append(df.el);
});