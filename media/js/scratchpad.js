/*
	Each of these are added to an array for the column.
	option: AND/OR
	checkbox: NOT
	
	- An input for a column that is some type of string, text or varchar
	text:[*] (equality) [text input] -limit to [a-zA-z0-9] -no wildcards
		 [*] (search) [text input] -limit to [a-zA-z0-9] -wildcards
	
	- An input for a column that is some type of number
	number:[*] (equality) n [=,<,>,<=,>=] [number stepper] -number type
		   [*] (between) [number stepper1] [<,<=] n [>,>=] [number stepper2]
		   [*] (select) [dropdown input list] :: translates to {column} IN(...)
		   [ ] (less-than) [<,<=] [number stepper]
		   [ ] (greater-than) [>,>=] [number stepper]
	
	- An input for a column that is a date or timestamp value
	date:[*] (equality) d [=,<,>,<=,>=] [date input]
		 [*] (between) [date input1] [<,<=] d [>,>=] [date input2]
		 [*] (select) [date dropdown input list]
		 [ ] (before) [<,<=] [date input]
		 [ ] (after) [>,>=] [date input]
		 [-] (billing cycle) [option:1-15, 16-eom] [month select] [year select]
		 [ ] (year) [year list] -min year
		 [ ] (month) [month list]
		 [ ] (month day) [month list] [day list]
		 [ ] (day) [1-31 dropdown]
		 [ ] (weekday) [week day list]
		 [ ] (relative) [day/week/month/year] []
	
	- An input for a column that is some type of boolean value
	boolean: [*] [radio set] -true label -false label
	
	- An input for a column that has a relatively small set of values
	enum: [*] [dropdown list (options have a checkbox)]
	
	- An input for a column with a very large set of (known) values (too many to put into the page)
	  the primary input is a typeahead
	biglist: [ ] (equals) [typeahead] -scrollable -custom templates 1)local, 2)prefetch 3)remote
	         [ ] (list) [typeahead, add button, dropdown list]
	
	TODO later
	- An input for a column that is a foreign key
	foreignkeyfilter: TODO --all the above search controls, but for the referenced table
	
*/

var tc,df;
var areas = [//required
	{'id':1, 'name':'No Area Designated', 'description':null},
	{'id':2, 'name':'Redding', 'description':null},
	{'id':3, 'name':'Chico', 'description':null}
], programs = [
	{'id':'1', 'typeId':'--', 'description':'No Program Assigned', 'amount':null},
	{'id':'2', 'typeId':'AD', 'description':'Administration', 'amount':null},
	{'id':'3', 'typeId':'AS', 'description':'Autism Support Program', 'amount':72.00},
	{'id':'4', 'typeId':'DV', 'description':'Developmental', 'amount':72.00},
	{'id':'5', 'typeId':'EX', 'description':'Extended', 'amount':72.00},
	{'id':'6', 'typeId':'EV', 'description':'Evaluation', 'amount':72.00},
	{'id':'7', 'typeId':'TR', 'description':'Training', 'amount':null},
	{'id':'8', 'typeId':'EP', 'description':'Play Group Under 3', 'amount':72.00},
	{'id':'9', 'typeId':'AP', 'description':'Play Group Over 3', 'amount':72.00},
	{'id':'10', 'typeId':'PG', 'description':'Play Group', 'amount':null},
	{'id':'11', 'typeId':'C', 'description':'Cleaning', 'amount':null},
	{'id':'12', 'typeId':'PH', 'description':'Planning Hours', 'amount':null},
	{'id':'13', 'typeId':'R', 'description':'Reports', 'amount':null},
	{'id':'14', 'typeId':'A1', 'description':'ABAS', 'amount':100.00},
	{'id':'15', 'typeId':'B1', 'description':'Bayley', 'amount':500.00},
	{'id':'16', 'typeId':'BA', 'description':'Bayley/Abas', 'amount':600.00},
	{'id':'17', 'typeId':'H1', 'description':'Help', 'amount':400.00},
	{'id':'32', 'typeId':'O', 'description':'Other', 'amount':null}
];

var eMeta = [
	{
		'data':null, 
		'name':'editor', 
		'title':'', 
		'cfexclude':true,
		'className':'action-column',
		'render':function(data,type,full,meta){
			return [
				'<div class="btn-group center-block">',
					'<button type="button" class="btn btn-default btn-info btn-xs emp-edit-btn" data-row-id="',full.id,'">',
						'<span class="glyphicon glyphicon-cog"></span>',
					'</button>',
					'<button type="button" class="btn btn-default btn-danger btn-xs emp-del-btn">',
						'<span class="glyphicon glyphicon-remove"></span>',
					'</button>',
				'</div>'
			].join('');
		}
	},
	{'data':'fname', 'name':'fname', 'title':'First Name', 'type':'string', 'cftype':'text'},
	{'data':'lname', 'name':'lname', 'title':'Last Name', 'type':'string', 'cftype':'text'},
	{
		'data':'status', 
		'name':'status', 
		'title':'Status', 
		'type':'num', 
		'cftype':'boolean',
		'render':function (data, type, full, meta) {
			return data?'Active':'Inactive';
		}
	},
	{'data':'hired', 'name':'hired', 'title':'hired', 'type':'date', 'cftype':'date'},
	{'data':'hiredUX', 'name':'hiredUX', 'title':'', 'type':'number', 'visible':false, 'cfexclude':true},
	{'data':'supervisor', 'name':'supervisor', 'title':'supervisor', 'type':'string', 'cftype':'text'},
	{
		'data':'area.id', 
		'name':'area_id', 
		'title':'Area', 
		'type':'num', 
		'visible':false,
		'cftype':'enum',
		'cfenumsource':areas,
		'cfenumlabelkey':'name'
	},
	{'data':'area.name', 'name':'area', 'title':'area', 'type':'string', 'cfexclude':true},
	{
		'data':'program.id', 
		'name':'program_id', 
		'title':'Program', 
		'type':'num', 
		'visible':false,
		'cftype':'enum',
		'cfenumsource':programs,
		'cfenumlabelkey':'typeId'
	},
	{'data':'program.typeId', 'name':'program_typeId', 'title':'Program', 'type':'string', 'cfexclude':true},
	{
		'data':'notes', 
		'name':'notes', 
		'title':'Notes', 
		'type':'string', 
		'className':'notes-column', 
		'visible':false,
		'cftype':'text'
	}
];

$(document).ready(function(e) {
	
	//df = new VDataFilters({table:'employees', tableColumns:tc, showFirst:'date-column', filterCategories:['user','public']});
	df = new VDataFilters({table:'employees', tableColumns:eMeta});
	
	$('div.container-fluid').append(df.el);
	
	$('#hired',this.modalForm).datepicker({
		autoclose:true,
		'name':'edit-emp-hired-dp',
		'format':'mm/dd/yyyy'
	});
	
	$('#testButton').on('click', function(e) {
		//get filter data from columnfilters object (df)
		console.log(df.getCurrentFilter());
	});
});