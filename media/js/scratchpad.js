/*
	Each of these are added to an array for the column.
	option: AND/OR
	checkbox: NOT
	
	text:(equality) [text input] -limit to [a-zA-z0-9] -no wildcards
		 (search) [text input] -limit to [a-zA-z0-9] -wildcards
	
	number:(equality) n [=,<,>,<=,>=] [number stepper] -number type
		   (between) [number stepper1] [<,<=] n [>,>=] [number stepper2]
		   (select) [dropdown input list] :: translates to {column} IN(...)
		   (less-than) [<,<=] [number stepper]
		   (greater-than) [>,>=] [number stepper]
	
	date:(equality) d [=,<,>,<=,>=] [date input]
		 (between) [date input1] [<,<=] d [>,>=] [date input2]
		 (select) [date dropdown input list]
		 (before) [<,<=] [date input]
		 (after) [>,>=] [date input]
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

var eMeta = [
	{data:'fname', name:'fname', title:'first name', type:'string', cftype:'text', searchable:true, orderable:true},
	{data:'lname', name:'lname', title:'last name', type:'string', cftype:'text', searchable:true, orderable:true},
	{data:'status', name:'status', title:'status', type:'num', cftype:'boolean', searchable:true, orderable:true},
	{data:'hired', name:'hired', title:'hired', type:'date', cftype:'date', searchable:true, orderable:true},
	{data:'supervisor', name:'supervisor', title:'supervisor', type:'string', cftype:'text', searchable:true, orderable:true},
	{data:'area.name', name:'area', title:'area', type:'string', cftype:'text', searchable:true, orderable:true},
	{data:'programId', name:'programId', title:'program', type:'num', cftype:'number', searchable:true, orderable:true},
	{data:'notes', name:'notes', title:'notes', type:'string', cftype:'text', searchable:true, orderable:true}
];

// TODO need a type convert function to map DataTable's column types to our types
var eMetaClone = $.map(eMeta, function(c,i) { return {'label':c.title, 'type':c.cftype, 'name':c.data}; } );

$(document).ready(function(e) {
	
	/* these will come from the data table
	 * name = the column name used in the query (name)
	 * label = descriptve text for the column (title)
	 * type = the data type (sType)
	 * 		string - 
	 * 		num - 
	 * 		num-fmt -
	 * 		date - 
	 * 		 
	*/
	
	tc = [
		{'name':'text-column', 'type':'text', 'label':'Text'},
		{'name':'number-column', 'type':'number', 'label':'Number'},
		{'name':'date-column', 'type':'date', 'label':'Date'},
		{
			'name':'bool-column',
			'type':'boolean',
			'label':'Boolean',
			'render':function (data, type, full, meta) {
				console.log(type);
				console.log(data);
				console.log(meta);
				return data;
			}
		},
		{'name':'enum-column', 'type':'enum', 'label':'Enum'},
		{'name':'list-column', 'type':'big-list', 'label':'Big List'},
		{'name':'fk-column', 'type':'foreign-key', 'label':'Foreign Key'}
	];
	
	//df = new VDataFilters({table:'employees', tableColumns:tc, showFirst:'date-column', filterCategories:['user','public']});
	df = new VDataFilters({table:'employees', tableColumns:eMetaClone});
	
	$('div.container-fluid').append(df.el);
	
	$('#testButton').on('click', function(e) {
		//get filter data from columnfilters object (df)
		console.log(df.getCurrentFilter());
	});
});