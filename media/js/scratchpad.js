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
		 [*] (before) [<,<=] [date input]
		 	 translates to
			 	WHERE <column> <,<= <date>
		 [*] (after) [>,>=] [date input]
		 [*] (cycle) [option:1-15, 16-eom] [month select] [year select] or datepicker with only year/month choices 
		 	 translates to
			 	// TODO allow cycle ranges to be set in initialize config option
			 	WHERE <column> BETWEEN DATE( CONCAT( YEAR(<D>),'-',MONTH(<D>),'-16' ) ) 
								   AND DATE( CONCAT( YEAR(<D>),'-',MONTH(<D>),'-',DAY( LAST_DAY(<D>) ) ) )
		 [*] (year) [year list] -min year
		 [ ] (month) [month list]
		 [ ] (year-month) datepicker with min type set to month
		 [ ] (month day) [month list] [day list]
		 [ ] (day) [1-31 dropdown]
		 [ ] (weekday) [week day list]
		 [ ] (relative) [day/week/month/year] [signed integer]
		 	 translates to
			 	day:	WHERE DATE_ADD/DATE_SUB(<column>, INTERVAL <signed integer> DAY)
				week:	WHERE DATE_ADD/DATE_SUB(<column>, INTERVAL <signed integer> WEEK)
				month:	WHERE DATE_ADD/DATE_SUB(<column>, INTERVAL <signed integer> MONTH)
				year:	WHERE DATE_ADD/DATE_SUB(<column>, INTERVAL <signed integer> YEAR)
	
	- An input for a column that is some type of boolean value
	boolean: [*] [radio set] -true label -false label
	
	- An input for a column that has a relatively small set of values
	enum: [*] [dropdown list (options have a checkbox)]
	
	- An input for a column with a very large set of (known) values (too many to put into the page)
	  the primary input is a typeahead
	biglist: [*] (equals) [typeahead] -scrollable -custom templates 1)local, 2)prefetch 3)remote
	         [ ] (list) [typeahead, add button, dropdown list]
	
	!!! the data sources for enum and biglist must also be available server-side !!!
	
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
	{"authorizedHours":null,"code":"--","id":1,"name":"No Program Assigned","rate":null},
	{"authorizedHours":null,"code":"AD","id":2,"name":"Administration","rate":null},
	{"authorizedHours":null,"code":"AS","id":3,"name":"Autism Support Program","rate":72},
	{"authorizedHours":null,"code":"DV","id":4,"name":"Developmental","rate":72},
	{"authorizedHours":null,"code":"EX","id":5,"name":"Extended","rate":72},
	{"authorizedHours":null,"code":"EV","id":6,"name":"Evaluation","rate":72},
	{"authorizedHours":null,"code":"TR","id":7,"name":"Training","rate":null},
	{"authorizedHours":null,"code":"EP","id":8,"name":"Play Group Under 3","rate":72},
	{"authorizedHours":null,"code":"AP","id":9,"name":"Play Group Over 3","rate":72},
	{"authorizedHours":null,"code":"PG","id":10,"name":"Play Group","rate":null},
	{"authorizedHours":null,"code":"C","id":11,"name":"Cleaning","rate":null},
	{"authorizedHours":null,"code":"PH","id":12,"name":"Planning Hours","rate":null},
	{"authorizedHours":null,"code":"R","id":13,"name":"Reports","rate":null},
	{"authorizedHours":null,"code":"A1","id":14,"name":"ABAS","rate":100},
	{"authorizedHours":null,"code":"B1","id":15,"name":"Bayley","rate":500},
	{"authorizedHours":null,"code":"BA","id":16,"name":"Bayley/Abas","rate":600},
	{"authorizedHours":null,"code":"H1","id":17,"name":"Help","rate":400},
	{"authorizedHours":null,"code":"O","id":32,"name":"Other","rate":null}
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
	{'data':'fname', 'name':'fname', 'title':'First Name', 'type':'string', 'cftype':'text', 'visible':true},
	{'data':'lname', 'name':'lname', 'title':'Last Name', 'type':'string', 'cftype':'text', 'visible':true},
	{'data':'dataNumber', 'name':'dataNumber', 'title':'Number', 'type':'num', 'visible':true, 'cftype':'number', 'config':{'step':1,'min':0,'max':999}},
	{
		'data':'status', 
		'name':'status', 
		'title':'Status', 
		'type':'num', 
		'cftype':'boolean',
		'render':function (data, type, full, meta) {
			return data?'Active':'Inactive';
		},
		'visible':true
	},
	{'data':'hired', 'name':'hired', 'title':'Hired', 'type':'date', 'cftype':'date', 'visible':true},
	{'data':'fired', 'name':'fired', 'title':'Fired', 'type':'date', 'cftype':'date', 'visible':true},
	{'data':'supervisor', 'name':'supervisor', 'title':'Supervisor', 'type':'string', 'cftype':'text', 'visible':true},
	{
		'data':'area', 
		'name':'area.id', 
		'title':'Area', 
		'type':'num', 
		'visible':true,
		'cftype':'enum',
		'cfenumsource':areas,
		'cfenumvaluekey':'id',
		'cfenumlabelkey':'name'
	},
	{'data':'area.name', 'name':'area', 'title':'area', 'type':'string', 'cfexclude':true},
	{
		'data':'program', 
		'name':'program', 
		'title':'Program', 
		'type':'num', 
		'visible':false,
		'cftype':'enum',
		'cfenumsource':programs,
		'cfenumvaluekey':'',
		'cfenumlabelkey':'typeId'
	},
	{'data':'program.typeId', 'name':'program_typeId', 'title':'Program', 'type':'string', 'cfexclude':true, 'visible':true},
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


var Calendar2Row = Backbone.View.extend({
	'template':_.template([
		'<div>',
		'<% for(var i=0; i<16; i++) { %>',
			'<% if(i<15) { %>',
				'<div>',
					'<div><%= i+1 %></div>',
					'<%= "1" %>',
				'</div>',
			'<% } else { %>',
				'<div>',
					'<h4>Total</h4>',
					'<p>100.00</p>',
				'</div>',
			'<% } %>',
		'<% } %>',
		'</div>',
		'<div>',
		'<% var endmonthdate=moment(cal.minimum).add(1,"M").startOf("M").subtract(1,"d").date(); for(var j=16; j<=endmonthdate; j++) { %>',
			'<div <%= (endmonthdate==j && (endmonthdate<31)) ? \'class="cal-2-row-last-day-not-31"\' : "" %>>',
				'<div><%= j %></div>',
					'<%= "678.90" %>',
			'</div>',
		'<% } %>',
		'</div>'
	].join(''), {'variable':'cal'}),
	
	'className':'cal-2-row',
	
	'initialize':function(options) {
		this.model = new Backbone.Model({'time':null, 'miles':null, 'data':null, 'minimum':null, 'maximum':null});
		this.model.on('change', this.render, this);
	},
	
	'render':function(updatedModel) {
		console.log('rendering Calendar2Row');
		this.$el.empty().append( this.template(this.model.toJSON()) );
	}
});

var ebh = new Bloodhound({
	'name':'employees',
	'datumTokenizer':function(d) {
		return Bloodhound.tokenizers.whitespace([d.fname,d.lname].join(' '));
	},
	'queryTokenizer':Bloodhound.tokenizers.nonword,
	'local': [{
  "id" : 1,
  "fname" : "No Employee",
  "lname" : "No Employee",
  "status" : 1,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 1,
    "name" : "None",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 2,
  "fname" : "Playgroup",
  "lname" : "Redding",
  "status" : 1,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 3,
  "fname" : "Playgroup",
  "lname" : "Chico",
  "status" : 1,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 4,
  "fname" : "Nancy",
  "lname" : "Castle",
  "status" : 0,
  "hired" : 558687600000,
  "supervisor" : "DIAS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "resigned/retired 5/31/13"
}, {
  "id" : 5,
  "fname" : "Matthew",
  "lname" : "Chesnut",
  "status" : 1,
  "hired" : 1092639600000,
  "supervisor" : null,
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 6,
  "fname" : "Katherine",
  "lname" : "Dias",
  "status" : 1,
  "hired" : 636451200000,
  "supervisor" : "TUCKER",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 7,
  "fname" : "Lori",
  "lname" : "Dierssen",
  "status" : 1,
  "hired" : 676710000000,
  "supervisor" : "TUCKER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 8,
  "fname" : "Nicole",
  "lname" : "Drummond",
  "status" : 1,
  "hired" : 1094022000000,
  "supervisor" : "CHESNUT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 9,
  "fname" : "Gina",
  "lname" : "Mascaro",
  "status" : 1,
  "hired" : 1096095600000,
  "supervisor" : "WHITE",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 10,
  "fname" : "Erin",
  "lname" : "Reed",
  "status" : 0,
  "hired" : 1104480000000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 11,
  "fname" : "Tawnya",
  "lname" : "Roesner",
  "status" : 0,
  "hired" : 847699200000,
  "supervisor" : "DIAS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "resigned 8/30/13"
}, {
  "id" : 12,
  "fname" : "Samantha",
  "lname" : "Thompson",
  "status" : 0,
  "hired" : 1101715200000,
  "supervisor" : null,
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 13,
  "fname" : "Elizabeth",
  "lname" : "Tucker",
  "status" : 1,
  "hired" : 740646000000,
  "supervisor" : "CHESNUT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 14,
  "fname" : "Johanne",
  "lname" : "Carreau",
  "status" : 1,
  "hired" : 941180400000,
  "supervisor" : "CHESNUT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "5/1/13 Transferred to Chico as training director; 5/29/13 name change, formerly 'White';"
}, {
  "id" : 15,
  "fname" : "John",
  "lname" : "Chesnut",
  "status" : 1,
  "hired" : 229939200000,
  "supervisor" : null,
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 16,
  "fname" : "Sonia",
  "lname" : "Regnier",
  "status" : 0,
  "hired" : 1112684400000,
  "supervisor" : null,
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 17,
  "fname" : "Deonn",
  "lname" : "Woods",
  "status" : 1,
  "hired" : 1129186800000,
  "supervisor" : "WHITE",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 18,
  "fname" : "Collette",
  "lname" : "Alger",
  "status" : 0,
  "hired" : 1130832000000,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 19,
  "fname" : "Stephanie",
  "lname" : "Terrill",
  "status" : 1,
  "hired" : 1135324800000,
  "supervisor" : "DIAS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 20,
  "fname" : "Angela",
  "lname" : "Kremer",
  "status" : 1,
  "hired" : 1139472000000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 21,
  "fname" : "Trina",
  "lname" : "Franks",
  "status" : 1,
  "hired" : 1231315200000,
  "supervisor" : "Deoon Woods",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "Transferred frm EXT to ASP eff 3-18-13;"
}, {
  "id" : 22,
  "fname" : "Gail",
  "lname" : "Collins",
  "status" : 1,
  "hired" : 1142496000000,
  "supervisor" : "TUCKER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 23,
  "fname" : "Piper",
  "lname" : "Graham",
  "status" : 1,
  "hired" : 1148626800000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 24,
  "fname" : "Stephanie",
  "lname" : "Posada",
  "status" : 0,
  "hired" : 1148626800000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 25,
  "fname" : "Alison",
  "lname" : "Pratt",
  "status" : 1,
  "hired" : 1148626800000,
  "supervisor" : "DRUMMOND",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 26,
  "fname" : "Brandy",
  "lname" : "France",
  "status" : 1,
  "hired" : 1156489200000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 27,
  "fname" : "Jennifer",
  "lname" : "Vnuk",
  "status" : 1,
  "hired" : 1158303600000,
  "supervisor" : "DIERSSEN",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 28,
  "fname" : "Audrey",
  "lname" : "Icely",
  "status" : 0,
  "hired" : 1170316800000,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 29,
  "fname" : "Sarah",
  "lname" : "Stewart",
  "status" : 1,
  "hired" : 1176620400000,
  "supervisor" : "Deonn Woods",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "Name change 2/19/13 prior name 'Fackrell'"
}, {
  "id" : 30,
  "fname" : "Julie",
  "lname" : "Daniel",
  "status" : 1,
  "hired" : 1187161200000,
  "supervisor" : "DIERSSEN",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "Eff 11/1/13 trans to DV Specialist;"
}, {
  "id" : 31,
  "fname" : "Jamie",
  "lname" : "Travis",
  "status" : 1,
  "hired" : 1197878400000,
  "supervisor" : "DIERSSEN",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "Full Time 9-1-8"
}, {
  "id" : 32,
  "fname" : "Carley",
  "lname" : "Marshall",
  "status" : 1,
  "hired" : 1204790400000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 33,
  "fname" : "Bobbie",
  "lname" : "Fetkin",
  "status" : 1,
  "hired" : 1208415600000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 34,
  "fname" : "Efimia",
  "lname" : "James",
  "status" : 0,
  "hired" : 1208329200000,
  "supervisor" : "HANES",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 35,
  "fname" : "Virgil",
  "lname" : "Woods",
  "status" : 1,
  "hired" : 1213167600000,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 36,
  "fname" : "Angelina",
  "lname" : "Odell",
  "status" : 0,
  "hired" : 1213167600000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 37,
  "fname" : "Kristen",
  "lname" : "Santoyo",
  "status" : 0,
  "hired" : 1221462000000,
  "supervisor" : "DIERSSEN",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "Resigned 11/18/13"
}, {
  "id" : 38,
  "fname" : "Angela",
  "lname" : "Pooler",
  "status" : 1,
  "hired" : 1213254000000,
  "supervisor" : "DIERSSEN",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 39,
  "fname" : "Carmen",
  "lname" : "Ulrich",
  "status" : 1,
  "hired" : 1216105200000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 40,
  "fname" : "Lia",
  "lname" : "Pinkerton",
  "status" : 0,
  "hired" : 1218178800000,
  "supervisor" : null,
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 41,
  "fname" : "Angela",
  "lname" : "Johnson",
  "status" : 0,
  "hired" : 1222844400000,
  "supervisor" : "DRUMMOND",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 42,
  "fname" : "Jenna",
  "lname" : "Mccurdy",
  "status" : 1,
  "hired" : 1233129600000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 43,
  "fname" : "Heather",
  "lname" : "Winstead",
  "status" : 0,
  "hired" : 1235462400000,
  "supervisor" : "BARNHART",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 44,
  "fname" : "Emily",
  "lname" : "Moore",
  "status" : 0,
  "hired" : 1237100400000,
  "supervisor" : "DRUMMOND",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 45,
  "fname" : "Eryn",
  "lname" : "Hanes",
  "status" : 0,
  "hired" : 1242198000000,
  "supervisor" : "DRUMMOND",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 46,
  "fname" : "Alexandra",
  "lname" : "Bloom",
  "status" : 0,
  "hired" : 1242198000000,
  "supervisor" : "HANES",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 47,
  "fname" : "Jennifer",
  "lname" : "Keily",
  "status" : 1,
  "hired" : 1243494000000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 48,
  "fname" : "Gloria",
  "lname" : "Bacciarini",
  "status" : 0,
  "hired" : 1243494000000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "resigned 8/30/13"
}, {
  "id" : 49,
  "fname" : "Annemarie",
  "lname" : "Brown",
  "status" : 0,
  "hired" : 1248073200000,
  "supervisor" : "TUCKER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 50,
  "fname" : "Rebecca",
  "lname" : "Rockwell",
  "status" : 0,
  "hired" : 1251615600000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 51,
  "fname" : "Katherine",
  "lname" : "Williams",
  "status" : 0,
  "hired" : 1251788400000,
  "supervisor" : null,
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 52,
  "fname" : "Melissa",
  "lname" : "Vargas",
  "status" : 0,
  "hired" : 1252479600000,
  "supervisor" : null,
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 53,
  "fname" : "Rachel",
  "lname" : "Jacobs",
  "status" : 0,
  "hired" : 1252479600000,
  "supervisor" : null,
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 54,
  "fname" : "Wesley",
  "lname" : "Olson",
  "status" : 0,
  "hired" : 1254812400000,
  "supervisor" : null,
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 55,
  "fname" : "Mike",
  "lname" : "Kieran",
  "status" : 0,
  "hired" : 1254812400000,
  "supervisor" : "ANGELA KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 56,
  "fname" : "Susan Danielle",
  "lname" : "Deome",
  "status" : 0,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 57,
  "fname" : "Jenna",
  "lname" : "Butler",
  "status" : 0,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 58,
  "fname" : "Amanda",
  "lname" : "Hurn",
  "status" : 0,
  "hired" : null,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 59,
  "fname" : "Michael",
  "lname" : "Bettes",
  "status" : 1,
  "hired" : null,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 60,
  "fname" : "Skylar",
  "lname" : "Puterbaugh",
  "status" : 0,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 61,
  "fname" : "Samantha",
  "lname" : "Shelton",
  "status" : 0,
  "hired" : null,
  "supervisor" : "DIAS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 62,
  "fname" : "Brittney",
  "lname" : "Franks",
  "status" : 1,
  "hired" : null,
  "supervisor" : "Deonn Woods",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "Transferred to ASP 7/16/13"
}, {
  "id" : 63,
  "fname" : "Robyn",
  "lname" : "Johnson",
  "status" : 0,
  "hired" : null,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "resigned 8/15/13"
}, {
  "id" : 64,
  "fname" : "Karli",
  "lname" : "Jayne",
  "status" : 0,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",

    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 65,
  "fname" : "Tamara",
  "lname" : "Peters",
  "status" : 1,
  "hired" : 1274166000000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "PRIOR NAME 'BROXTERMAN'"
}, {
  "id" : 66,
  "fname" : "Caitlin",
  "lname" : "Sanders",
  "status" : 0,
  "hired" : 1275375600000,
  "supervisor" : null,
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "resigned position"
}, {
  "id" : 67,
  "fname" : "Lisa",
  "lname" : "Gibson",
  "status" : 0,
  "hired" : 1275894000000,
  "supervisor" : "JOHANNE WHITE",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 68,
  "fname" : "Cassie",
  "lname" : "Minoletti-webb",
  "status" : 0,
  "hired" : 1275894000000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 69,
  "fname" : "Brittany",
  "lname" : "Smith",
  "status" : 0,
  "hired" : 1276498800000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 70,
  "fname" : "Melissa",
  "lname" : "Basch",
  "status" : 0,
  "hired" : null,
  "supervisor" : "WHITE",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 71,
  "fname" : "Lauren",
  "lname" : "Wong",
  "status" : 0,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 72,
  "fname" : "Kathleen",
  "lname" : "Corbett",
  "status" : 0,
  "hired" : 1278918000000,
  "supervisor" : "DIERRSSEN",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "resigned 1/3/2014"
}, {
  "id" : 73,
  "fname" : "Katie",
  "lname" : "Holzwarth",
  "status" : 0,
  "hired" : 1279695600000,
  "supervisor" : "ANGELA KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "resigned 5/24/2013"
}, {
  "id" : 74,
  "fname" : "Lauren",
  "lname" : "Wise",
  "status" : 1,
  "hired" : 1280732400000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 75,
  "fname" : "Samantha",
  "lname" : "Lanctot",
  "status" : 1,
  "hired" : 1283842800000,
  "supervisor" : "Deonn Woods",
  "area" : {

    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "Trans to ASP eff 5/21/13;"
}, {
  "id" : 76,
  "fname" : "Lauren",
  "lname" : "Barone",
  "status" : 0,
  "hired" : 1283497200000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 77,
  "fname" : "Colleen",
  "lname" : "Antonsen",
  "status" : 0,
  "hired" : 1285570800000,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 78,
  "fname" : "Melanne",
  "lname" : "Hurst",
  "status" : 0,
  "hired" : null,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 79,
  "fname" : "Tara",
  "lname" : "Marchinek",
  "status" : 0,
  "hired" : 1284534000000,
  "supervisor" : "ANGELA KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 80,
  "fname" : "Lyndsay",
  "lname" : "Anderson",
  "status" : 0,
  "hired" : 1284966000000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 81,
  "fname" : "Keri",
  "lname" : "Smith",
  "status" : 0,
  "hired" : 1284966000000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 82,
  "fname" : "Pamela",
  "lname" : "Heisler",
  "status" : 0,
  "hired" : 1285657200000,
  "supervisor" : "DIAS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 83,
  "fname" : "Stacey",
  "lname" : "Pike",
  "status" : 0,
  "hired" : 1285743600000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 84,
  "fname" : "Anai",
  "lname" : "Abarca-sanchez",
  "status" : 0,
  "hired" : 1285225200000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 85,
  "fname" : "Lexi",
  "lname" : "Razzari",
  "status" : 0,
  "hired" : 1285311600000,
  "supervisor" : "ANGELA KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 86,
  "fname" : "Megan",
  "lname" : "Konopacki",
  "status" : 0,
  "hired" : 1288335600000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 87,
  "fname" : "Ashley",
  "lname" : "Alderman",
  "status" : 0,
  "hired" : 1287644400000,
  "supervisor" : "MOORE",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 88,
  "fname" : "Mari",
  "lname" : "Von Osten-piazzisi",
  "status" : 1,
  "hired" : 1289203200000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "3/1/13 returned to active status;"
}, {
  "id" : 89,
  "fname" : "Kathleen",
  "lname" : "Otterlei",
  "status" : 0,
  "hired" : null,
  "supervisor" : "DIERSSEN",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "resigned 9/6/13"
}, {
  "id" : 90,
  "fname" : "Lindsay",
  "lname" : "Miller",
  "status" : 0,
  "hired" : 1289894400000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 91,
  "fname" : "Shealyn",
  "lname" : "Mcmullen",
  "status" : 1,
  "hired" : 1289980800000,
  "supervisor" : "ANGLEA KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 92,
  "fname" : "Kelly",
  "lname" : "Backues",
  "status" : 0,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 93,
  "fname" : "Brenda",
  "lname" : "Chao",
  "status" : 1,
  "hired" : null,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 94,
  "fname" : "Jasmine",
  "lname" : "Mcintosh",
  "status" : 1,
  "hired" : null,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "Trans to PG eff 5/21/13;"
}, {
  "id" : 95,
  "fname" : "Aubrie",
  "lname" : "Moore",
  "status" : 1,
  "hired" : 1294387200000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 96,
  "fname" : "Leesha",
  "lname" : "Tenns",
  "status" : 1,
  "hired" : 1293523200000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {

    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 97,
  "fname" : "Mikilah",
  "lname" : "Mckenzie",
  "status" : 0,
  "hired" : 1294732800000,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 98,
  "fname" : "Jacob",
  "lname" : "Stevens",
  "status" : 1,
  "hired" : 1295251200000,
  "supervisor" : "ANGELA KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 99,
  "fname" : "Christopher",
  "lname" : "Davis",
  "status" : 0,
  "hired" : 1295942400000,
  "supervisor" : "HANES",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 100,
  "fname" : "Jo Leanne",
  "lname" : "Wolz",
  "status" : 0,
  "hired" : 1297756800000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 101,
  "fname" : "Kirstin",
  "lname" : "David",
  "status" : 0,
  "hired" : 1297756800000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 102,
  "fname" : "Ciara",
  "lname" : "Kapaska",
  "status" : 0,
  "hired" : null,
  "supervisor" : "DIAS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "resigned position"
}, {
  "id" : 103,
  "fname" : "Dione",
  "lname" : "Adams",
  "status" : 1,
  "hired" : null,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 104,
  "fname" : "Marissa",
  "lname" : "White",
  "status" : 0,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 105,
  "fname" : "Marisa",
  "lname" : "Bettencourt",
  "status" : 0,
  "hired" : null,
  "supervisor" : "BARNHART",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 106,
  "fname" : "Pamela",
  "lname" : "Barnhart",
  "status" : 1,
  "hired" : null,
  "supervisor" : "CHESNUT",
  "area" : {
    "id" : 1,
    "name" : "None",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 107,
  "fname" : "Dana",
  "lname" : "Sutter",
  "status" : 1,
  "hired" : null,
  "supervisor" : "ANGELA KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 108,
  "fname" : "Brianna",
  "lname" : "Gifford",
  "status" : 0,
  "hired" : null,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 109,
  "fname" : "Brandi",
  "lname" : "Conner-dwyer",
  "status" : 0,
  "hired" : null,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 110,
  "fname" : "Kari",
  "lname" : "Gonzales",
  "status" : 0,
  "hired" : null,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 111,
  "fname" : "Nili",
  "lname" : "Yudice",
  "status" : 1,
  "hired" : 1303110000000,
  "supervisor" : "Matt Chesnut",
  "area" : {
    "id" : 1,
    "name" : "None",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "04/18/2011 to 5/25/2012; rehired 1/1/2014"
}, {
  "id" : 112,
  "fname" : "Katherine",
  "lname" : "Good",
  "status" : 0,
  "hired" : null,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 113,
  "fname" : "Gina",
  "lname" : "Ramirez",
  "status" : 0,
  "hired" : 1303455600000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "resigned position"
}, {
  "id" : 114,
  "fname" : "Lindsey",
  "lname" : "Cushman",
  "status" : 1,
  "hired" : null,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 115,
  "fname" : "Alisha",
  "lname" : "Woods",
  "status" : 1,
  "hired" : null,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 116,
  "fname" : "Meredith",
  "lname" : "Lee",
  "status" : 0,
  "hired" : 1306911600000,
  "supervisor" : "ANGELA KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 117,
  "fname" : "Bridget",
  "lname" : "Rangel",
  "status" : 1,
  "hired" : 1307430000000,
  "supervisor" : "ANGELA KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 118,
  "fname" : "Melissa",
  "lname" : "Burney",
  "status" : 1,
  "hired" : 1306825200000,
  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 119,
  "fname" : "Karen",
  "lname" : "Martin",
  "status" : 1,
  "hired" : 1309503600000,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "CHICO EMP RELOCATED TO REDDING;"
}, {
  "id" : 120,
  "fname" : "Courtney",
  "lname" : "Wild",
  "status" : 0,
  "hired" : 1312182000000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 121,
  "fname" : "Elizabeth",
  "lname" : "Garibay",
  "status" : 0,
  "hired" : 1312182000000,
  "supervisor" : "PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 122,
  "fname" : "Analicia",
  "lname" : "Ochoa",
  "status" : 0,
  "hired" : null,
  "supervisor" : "WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "5/3/13 name change, formerly 'Garcia'; 7/25/13 resigned position;"
}, {
  "id" : 123,
  "fname" : "Chanelle",
  "lname" : "Hauptman",
  "status" : 1,
  "hired" : null,
  "supervisor" : "LAUREN WISE",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 124,
  "fname" : "Micaela",
  "lname" : "Burghardt",
  "status" : 0,
  "hired" : 1318316400000,
  "supervisor" : null,
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 125,
  "fname" : "Sophia",
  "lname" : "Royal",
  "status" : 0,
  "hired" : 1318230000000,
  "supervisor" : null,
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "resigned 7/15/13"
}, {
  "id" : 126,
  "fname" : "Christie",
  "lname" : "Siewell",
  "status" : 0,
  "hired" : 1319094000000,
  "supervisor" : "BARNHART",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 127,
  "fname" : "Rachelle",
  "lname" : "Woods-garton",
  "status" : 0,
  "hired" : 1319439600000,
  "supervisor" : "GINA MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "MARRIED NAME 'GARTON' JUNE 2012"
}, {
  "id" : 128,
  "fname" : "Kymberly",
  "lname" : "Hudson",
  "status" : 0,
  "hired" : null,
  "supervisor" : "CHAO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "HIRED AS CROUCH 10/27, MARRIED 11/11 CHANGED NAME TO HUDSON; 6/6/2013 resigned"
}, {
  "id" : 129,
  "fname" : "Siara",
  "lname" : "Shelton",
  "status" : 0,
  "hired" : 1320130800000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "Resigned 4/24/13"
}, {
  "id" : 130,
  "fname" : "Danica",
  "lname" : "Kochman",
  "status" : 1,
  "hired" : null,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 131,
  "fname" : "Cheyenne",
  "lname" : "Kibby",
  "status" : 1,
  "hired" : null,
  "supervisor" : "GINA MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 132,
  "fname" : "Breanna",
  "lname" : "Kisling",
  "status" : 0,
  "hired" : null,
  "supervisor" : "GINA MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 133,
  "fname" : "Kristen",
  "lname" : "Menchaca",
  "status" : 0,
  "hired" : null,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 134,
  "fname" : "Narwon",
  "lname" : "Rahimi",
  "status" : 0,
  "hired" : null,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 135,
  "fname" : "Mariko",
  "lname" : "Kanata",
  "status" : 1,
  "hired" : null,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 136,
  "fname" : "Molly",
  "lname" : "Jolliff",
  "status" : 0,
  "hired" : 1322812800000,
  "supervisor" : "BETH TUCKER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 4,
    "code" : "DV",
    "name" : "Developmental",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "resigned 8/15/13"
}, {
  "id" : 137,
  "fname" : "Liliana",
  "lname" : "Garcia",
  "status" : 0,
  "hired" : 1322726400000,
  "supervisor" : "DEONN WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 138,
  "fname" : "Leah",
  "lname" : "Moua",
  "status" : 0,
  "hired" : 1322812800000,
  "supervisor" : "GINA MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "Laid off 1/9/14"
}, {
  "id" : 139,
  "fname" : "Catherine",
  "lname" : "Reyes",
  "status" : 1,
  "hired" : 1322812800000,
  "supervisor" : "GINA MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 140,
  "fname" : "Alejandra",
  "lname" : "Nava",
  "status" : 0,
  "hired" : 1323417600000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 141,
  "fname" : "Clayton",
  "lname" : "Getzinger",
  "status" : 1,
  "hired" : 1323417600000,
  "supervisor" : "ANGELA KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 142,
  "fname" : "Christine F",
  "lname" : "James",
  "status" : 1,
  "hired" : 1324540800000,
  "supervisor" : "Nicole/Pam B.",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 143,
  "fname" : "Jillian",
  "lname" : "Poitras",
  "status" : 0,
  "hired" : 1325577600000,
  "supervisor" : "DEONN WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 144,
  "fname" : "Samantha",
  "lname" : "Lighthill",
  "status" : 0,
  "hired" : 1325750400000,
  "supervisor" : "DEONN WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "NAME CHANGE 7/2012 formerly 'Turner'"
}, {
  "id" : 145,
  "fname" : "Ashley",
  "lname" : "Webster",
  "status" : 0,
  "hired" : null,
  "supervisor" : "SARAH FACKRELL",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 146,
  "fname" : "Laura",
  "lname" : "Smith",
  "status" : 0,
  "hired" : null,
  "supervisor" : "AUBRIE MOORE",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "Prior Name: Meyer; resigned 10-15-2013"
}, {
  "id" : 147,
  "fname" : "Erin",
  "lname" : "Stelt",
  "status" : 1,
  "hired" : null,
  "supervisor" : "LAUREN WISE",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 148,
  "fname" : "Amanda",
  "lname" : "Leary",
  "status" : 0,
  "hired" : null,
  "supervisor" : "ANGELA KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "Resigned 5/31/2013"
}, {
  "id" : 149,
  "fname" : "Jeannine",
  "lname" : "Dellabona",
  "status" : 0,
  "hired" : null,
  "supervisor" : "KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 150,
  "fname" : "Kelly",
  "lname" : "Dixon",
  "status" : 0,
  "hired" : null,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 151,
  "fname" : "Tiffany",
  "lname" : "Danger",
  "status" : 0,
  "hired" : 1329120000000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 152,
  "fname" : "Danielle",
  "lname" : "Thomas",
  "status" : 1,
  "hired" : 1332140400000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 153,
  "fname" : "Lorena",
  "lname" : "Rodriguez",
  "status" : 0,
  "hired" : 1332140400000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 154,
  "fname" : "Bradley",
  "lname" : "Woods",
  "status" : 1,
  "hired" : null,
  "supervisor" : "PAM BARNHART",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "JANITORIAL"
}, {
  "id" : 155,
  "fname" : "Sarah",
  "lname" : "Ivey",
  "status" : 1,
  "hired" : 1333004400000,
  "supervisor" : "DEONN WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 156,
  "fname" : "Vanessa",
  "lname" : "Contreras",
  "status" : 0,
  "hired" : 1333522800000,
  "supervisor" : "KREMMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 157,
  "fname" : "Maria",
  "lname" : "Rueda",
  "status" : 1,
  "hired" : 1334559600000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 158,
  "fname" : "Angela",
  "lname" : "Buckner",
  "status" : 1,
  "hired" : 1334559600000,
  "supervisor" : "ANGIE KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 159,
  "fname" : "Natalie",
  "lname" : "Brown",
  "status" : 0,
  "hired" : 1336028400000,

  "supervisor" : "MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 160,
  "fname" : "Shanae",
  "lname" : "Munro",
  "status" : 1,
  "hired" : 1335942000000,
  "supervisor" : "ANGIE KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 161,
  "fname" : "Karen",
  "lname" : "Emmons",
  "status" : 1,
  "hired" : 1335942000000,
  "supervisor" : "ANGIE KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 162,
  "fname" : "Jessica",
  "lname" : "Boulb",
  "status" : 0,
  "hired" : 1336978800000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "resigned position"
}, {
  "id" : 163,
  "fname" : "Erika Arielle",
  "lname" : "Langworthy",
  "status" : 1,
  "hired" : 1336978800000,
  "supervisor" : "ANGIE KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 164,
  "fname" : "Kalani",
  "lname" : "Floyd",
  "status" : 0,
  "hired" : 1336978800000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 165,
  "fname" : "David",
  "lname" : "Neal",
  "status" : 1,
  "hired" : 1336978800000,
  "supervisor" : "ANGIE KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 166,
  "fname" : "Alyssa",
  "lname" : "Austin",
  "status" : 0,
  "hired" : 1338274800000,
  "supervisor" : "GINA MASCARO",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "resigned 5/10/2013"
}, {
  "id" : 167,
  "fname" : "Samantha",
  "lname" : "Skinner",
  "status" : 1,
  "hired" : 1337583600000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 168,
  "fname" : "Jared",
  "lname" : "Doak",
  "status" : 0,
  "hired" : 1339398000000,
  "supervisor" : "ANGELA KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 169,
  "fname" : "Dawn",
  "lname" : "Valdes",
  "status" : 0,
  "hired" : 1340607600000,
  "supervisor" : "Gina Mascaro",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "trans from ASP to EXT eff 1/1/13; terminated 4/24/13"
}, {
  "id" : 170,
  "fname" : "Auburn",
  "lname" : "Kennedy",
  "status" : 0,
  "hired" : 1341298800000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "resigned position"
}, {
  "id" : 171,
  "fname" : "Christopher",
  "lname" : "Jones",
  "status" : 1,
  "hired" : 1343286000000,
  "supervisor" : "DEONN WOODS",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 172,
  "fname" : "Amber",
  "lname" : "Reckner",
  "status" : 0,
  "hired" : 1344927600000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "resigned position"
}, {
  "id" : 173,
  "fname" : "Dwayne",
  "lname" : "Lossing",
  "status" : 1,
  "hired" : 1346050800000,
  "supervisor" : "ANGIE KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 174,
  "fname" : "Amber",
  "lname" : "Franck",
  "status" : 1,
  "hired" : 1346914800000,
  "supervisor" : "ANGIE KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 175,
  "fname" : "Danielle",
  "lname" : "Harsch",
  "status" : 1,
  "hired" : 1346050800000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 176,
  "fname" : "Lauren",
  "lname" : "Thiede",
  "status" : 1,
  "hired" : 1346050800000,
  "supervisor" : "NICOLE DRUMMOND",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 177,
  "fname" : "Carrie",
  "lname" : "Hanf",
  "status" : 0,
  "hired" : 1346914800000,
  "supervisor" : "LORI DIERSSEN",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 178,
  "fname" : "Eliza",
  "lname" : "Sevier",
  "status" : 1,
  "hired" : 1349679600000,
  "supervisor" : "ALISON PRATT",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 179,
  "fname" : "Bethany",
  "lname" : "Wooley",
  "status" : 1,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 1,
    "name" : "None",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 180,
  "fname" : "Sharon",
  "lname" : "Chesnut",
  "status" : 1,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 1,
    "name" : "None",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 181,
  "fname" : "Wes",
  "lname" : "Owen",
  "status" : 1,
  "hired" : 1263542400000,
  "supervisor" : "BARNHART",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 32,
    "code" : "O",
    "name" : "Other",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "Database System Programmer"
}, {
  "id" : 182,
  "fname" : "Madeline",
  "lname" : "Wion",
  "status" : 1,
  "hired" : 1359014400000,
  "supervisor" : "Alison Pratt",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 183,
  "fname" : "Rebecca",
  "lname" : "Lewis",
  "status" : 1,
  "hired" : 1362038400000,
  "supervisor" : null,
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 184,
  "fname" : "Breanne",
  "lname" : "Hanna",
  "status" : 0,
  "hired" : 1363244400000,
  "supervisor" : "Angela Kremer",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "hired at intern status; internship completed 5/16/13;"
}, {
  "id" : 185,
  "fname" : "Kelly",
  "lname" : "Ertola",
  "status" : 0,
  "hired" : 1360742400000,
  "supervisor" : "Angela Kremer",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "Intern status;"
}, {
  "id" : 186,
  "fname" : "Jenny",
  "lname" : "Walter",
  "status" : 1,
  "hired" : 1362470400000,
  "supervisor" : "Tina James",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "Chico Admin Assist"
}, {
  "id" : 187,
  "fname" : "Journey",
  "lname" : "Patterson",
  "status" : 1,
  "hired" : 1367391600000,
  "supervisor" : "Carmen Ulrich",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 188,
  "fname" : "Jessica",
  "lname" : "Hero",
  "status" : 0,
  "hired" : 1367823600000,
  "supervisor" : "Jennifer Keily",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "resigned 8/28/13"
}, {
  "id" : 189,
  "fname" : "Olivia",
  "lname" : "Ogden",
  "status" : 1,
  "hired" : 1368774000000,
  "supervisor" : "Alison Pratt",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 190,
  "fname" : "Corrie",
  "lname" : "O'Barr",
  "status" : 1,
  "hired" : 1367823600000,
  "supervisor" : "Alison Pratt",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 192,
  "fname" : "Jessica",
  "lname" : "Eastman",
  "status" : 1,
  "hired" : 1370242800000,
  "supervisor" : "Angelia Kremer",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 193,
  "fname" : "Nichole",
  "lname" : "Flesher",
  "status" : 1,
  "hired" : 1370242800000,
  "supervisor" : "Alison Pratt",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 194,
  "fname" : "Jackelyn",
  "lname" : "Schrage",
  "status" : 1,
  "hired" : 1371452400000,
  "supervisor" : "Angie kremer",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 195,
  "fname" : "Melissa",
  "lname" : "Baugh",
  "status" : 1,
  "hired" : 1373439600000,
  "supervisor" : "Deonn Woods",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 196,
  "fname" : "Allyson",
  "lname" : "Greek",
  "status" : 1,
  "hired" : 1373439600000,
  "supervisor" : "Deonn Woods",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 197,
  "fname" : "Aidan",
  "lname" : "Graham",
  "status" : 1,
  "hired" : 1373266800000,
  "supervisor" : "Angie Kremer",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 198,
  "fname" : "Derek",
  "lname" : "Dozier",
  "status" : 0,
  "hired" : 1373526000000,
  "supervisor" : "Angie Kremer",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "released 7/29/13"
}, {
  "id" : 199,
  "fname" : "Sarah",
  "lname" : "Balch",
  "status" : 1,
  "hired" : 1373871600000,
  "supervisor" : "Alison Pratt",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 200,
  "fname" : "Kacie",
  "lname" : "Holt",
  "status" : 1,
  "hired" : 1373871600000,
  "supervisor" : "Alison Pratt",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 201,
  "fname" : "Sarah",
  "lname" : "Thomas",
  "status" : 0,
  "hired" : 1373526000000,
  "supervisor" : "Alison Pratt",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 5,
    "code" : "EX",
    "name" : "Extended",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "resigned 10/18/13"
}, {
  "id" : 202,
  "fname" : "LEAH",
  "lname" : "OVERSON",
  "status" : 0,
  "hired" : 1373958000000,
  "supervisor" : "ANGIE KREMER",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : "RELEASED 7/18/13"
}, {
  "id" : 203,
  "fname" : "Nicholas",
  "lname" : "Daniel",
  "status" : 0,
  "hired" : null,
  "supervisor" : "Tina James",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 2,
    "code" : "AD",
    "name" : "Administration",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "Toy cleaning; resigned 12/16/2013"
}, {
  "id" : 204,
  "fname" : "Jade",
  "lname" : "McDaniel-Roe",
  "status" : 1,
  "hired" : 1380006000000,
  "supervisor" : "Angela Kremer",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 205,
  "fname" : "Kelli",
  "lname" : "Utterback",
  "status" : 1,
  "hired" : 1380870000000,
  "supervisor" : "Angie Kremer",
  "area" : {
    "id" : 3,
    "name" : "Chico",
    "description" : null
  },
  "program" : {
    "id" : 3,
    "code" : "AS",
    "name" : "Autism Support Program",
    "rate" : 72.00,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 206,
  "fname" : "Billing",
  "lname" : "Employee",
  "status" : 1,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 1,
    "name" : "None",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 207,
  "fname" : "Program",
  "lname" : "Employee",
  "status" : 1,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 1,
    "name" : "None",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 208,
  "fname" : "Billing Support",
  "lname" : "Employee",
  "status" : 1,
  "hired" : null,
  "supervisor" : null,
  "area" : {
    "id" : 1,
    "name" : "None",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : null
}, {
  "id" : 210,
  "fname" : "Foo",
  "lname" : "Oon and Poon",
  "status" : 0,
  "hired" : 1418025600000,
  "supervisor" : "no supervisor",
  "area" : {
    "id" : 1,
    "name" : "None",
    "description" : null
  },
  "program" : {
    "id" : 1,
    "code" : "--",
    "name" : "No Program Assigned",
    "rate" : null,
    "authorizedHours" : null
  },
  "notes" : "I modified this value\nhired was 10/30/2014\nprogram was Other\nArea was Chico\nStatus was Dropped\nLast Name was EmployeeLast\nFirst Name was TestEmployee"
}, {
  "id" : 211,
  "fname" : "Dirk",
  "lname" : "Diggler",
  "status" : 1,
  "hired" : 1416211200000,
  "supervisor" : "Wes",
  "area" : {
    "id" : 2,
    "name" : "Redding",
    "description" : null
  },
  "program" : {
    "id" : 17,
    "code" : "H1",
    "name" : "Help",
    "rate" : 400.00,
    "authorizedHours" : null
  },
  "notes" : "Test Add"
}]
});

var c2r = null, cpdf = null;

$(document).ready(function(e) {
	
	df = new VDataFilters({
		'mode':VDataFilters.prototype.MODES.DEFAULT,//NO_TYPES  DEFAULT  CATEGORY_SETS  CATEGORIES_NO_TYPES
		'table':'employees',
		'tableColumns':eMeta,
		
		'filterCategories':['Test'],
		/**/
		'filters':[
			{
				'table':'timesheets',
				'column':'hired',
				'label':'Hired',
				'type':'date',
				'filterValue':{
					'description':'is between 5/1/2013 and 5/31/2013',
					'fromDate':moment('2013-5-1','YYYY-M-D').toDate(),
					'toDate':moment('2013-5-31','YYYY-M-D').toDate(),
					'type':'between'
				}
			},
			{
				"table":"employees",
				"type":"text",
				"column":"fname",
				"label":"First Name",
				"filterValue":{
					"type":"equals",
					"value":"foo bar",
					"description":"is equal to foo bar"
				}
			}
		],
		
		
		'customUI':['<button type="button" class="btn btn-sm btn-default">custom</button>'].join('')
	});
	$('div.cfviewmain').append(df.el);
	
	$('#testButton').on('click', function(e) {
		//get filter data from columnfilters object (df)
		console.log(df.getCurrentFilter());
	});
	
	ebh.initialize()
	.fail(function(){
		console.error('employees initialize fail');
	});
	
	
	var EventListenerObject = _.extend({}, Backbone.Events);
	
	// we don't want columns where:
	// data == null
	// cfexclude == true
	// the original indexes need to be preserved somehow
	var metaColForVis = {};
	for(var c in eMeta) {
		if( (eMeta[c].data !== null) && (!_.has(eMeta[c], 'cfexclude') || (_.has(eMeta[c], 'cfexclude') && !eMeta[c].cfexclude)) ) {
			metaColForVis[eMeta[c].data] = {'index':c*1, 'data':eMeta[c].data, 'visible':eMeta[c].visible, 'title':eMeta[c].title};
		}
	}
	
	var dtcvcConfig = {
		'widthOverride':500,
		'columns':metaColForVis,
		'groups':[
			{
				'name':'First Last', 
				'columns':['lname', 'fname']
			},
			{
				'name':'Info', 
				'columns':['status', 'area', 'program']
			},
			{
				'name':'Occupational', 
				'columns':['status', 'area', 'program', 'hired', 'fired', 'supervisor']
			}
		]//,
		//'default':_.map(
		//	_.filter(eMeta, function(c){
		//		return c.data==null ? false : (( !_.has(c, 'cfexclude') || (_.has(c, 'cfexclude') && !c.cfexclude) ) && c.visible );
		//	}), 
		//	function(c){ return c.data; }
		//)
	};
	
	// for groups:    dtcvcConfig
	// for no-groups: _.extend({}, {'columns':dtcvcConfig.columns})
	var testView = new DatatableColumnVisibilityControl(dtcvcConfig);
	
	EventListenerObject.listenTo(testView, 'column-visibility-change', function(columnIndex, isVisible) {
		console.log('column-visibility-change handled: '+ columnIndex + ', ' + isVisible);
	});
	EventListenerObject.listenTo(testView, 'group-visibility-change', function(visibleColumnIndexes) {
		console.log('group-visibility-change handled: ' + visibleColumnIndexes.join(','));
	});
	
	$('.myTest').append(testView.render());
	
});

var DatatableColumnVisibilityControl = Backbone.View.extend({
	'template_nogroups':_.template([
		'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">',
			'<span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> <span class="caret"></span>',
		'</button>',
		'<ul class="dropdown-menu list-unstyled text-nowrap col-vis-menu" role="menu">',
			'<li<% if(_.has(config,"widthOverride")) { %> style="width:<%= config.widthOverride %>" <% } %>>',
				'<h3><u>Column Visibility</u></h3>',
				'<ul class="list-inline list-unstyled">',
				'<% for(var i in config.sorted) { %>',
					'<li>',
						'<div class="checkbox">',
							'<label class="text-nowrap btn btn-sm btn-default">',
								'<input type="checkbox" data-column="<%= config.sorted[i].data %>" value="<%= config.sorted[i].index %>"<% if(config.sorted[i].visible) { %> checked="checked"<% } %> />',
								'<span class="text-capitalize"><%= config.sorted[i].title %></span>',
							'</label>',
						'</div>',
					'</li>',
				'<% } %>',
				'</ul>',
				'<p><button type="button" class="btn btn-default" data-group-index="-1">reset</button></p>',
			'</li>',
		'</ul>'
	].join(''), {'variable':'config'}),
	'template_groups':_.template([
		'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">',
			'<span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> <span class="caret"></span>',
		'</button>',
		'<ul class="dropdown-menu list-inline list-unstyled text-nowrap col-vis-menu" role="menu">',
			'<li<% if(_.has(config,"widthOverride")) { %> style="width:<%= config.widthOverride %>" <% } %>>',
				'<h3><u>Column Visibility</u></h3>',
				'<ul class="list-inline list-unstyled">',
				'<% for(var i in config.sorted) { %>',
					'<li>',
						'<div class="checkbox">',
							'<label class="text-nowrap btn btn-sm btn-default">',
								'<input type="checkbox" data-column="<%= config.sorted[i].data %>" value="<%= config.sorted[i].index %>"<% if(config.sorted[i].visible) { %> checked="checked"<% } %> />',
								'<span class="text-capitalize"><%= config.sorted[i].title %></span>',
							'</label>',
						'</div>',
					'</li>',
				'<% } %>',
				'</ul>',
				'<p><button type="button" class="btn btn-default" data-group-index="-1">reset</button></p>',
			'</li>',
			'<li>',
				'<h3><u>Visibility Groups</u></h3>',
				'<% for(var i in config.groups) { %>',
					'<p><button type="button" class="btn btn-default" data-group-index="<%= i %>">',
						'<span class="text-nowrap"><%= config.groups[i].name %></span>',
					'</button></p>',
				'<% } %>',
			'</li>',
		'</ul>'
	].join(''), {'variable':'config'}),
	
	'events':{
		// CLICK AND CHANGE EVENTS FOR COLUMN VISIBILITY CONTROL
		'click ul.dropdown-menu input, ul.dropdown-menu label':function(e) {
			// just stop the event from bubbling so the dropdown-menu will stay on screen
			e.stopPropagation();
		},
		'change ul.dropdown-menu input':function(e) {
			//this.datatable.columns(e.currentTarget.value*1).visible(e.currentTarget.checked);
			this.trigger('column-visibility-change', e.currentTarget.value*1, e.currentTarget.checked);
			e.stopPropagation();
			return false;
		},
		'click ul.dropdown-menu button':function(e) {
			var groupIndex = $(e.currentTarget).data('group-index')*1,
				gcolumns = groupIndex<0 ? this.model.get('default') : this.model.get('groups')[$(e.currentTarget).data('group-index')].columns,
				visibleColumns = [];
			
			$('div.checkbox input', this.$el).each(function(i) {
				this.checked = ( _.indexOf(gcolumns, $(this).data('column')) > -1);
			});
			
			this.trigger('group-visibility-change', _.pluck(_.pick(this.model.get('columns'), gcolumns), 'index'));
			
			e.stopPropagation();
		}
	},
	
	'className':'btn-group',
	
	'initialize':function(options) {
		/**
		 * options.columns is expected to be:
		 * { <key == the same as data (name of the column key)>
		 * index:<original index of column from datatable columns>
		 * data:<the name of the column key>
		 * title:<the descriptive label for the column>
		 * visible:<a boolean for visibility>
		 * }
		 * example:
		 * {
		 *     'id':{'index':0, 'data':'id', 'title':'', 'visible':false}, 
		 *     'name':{'index':1, 'data':'name', 'title':'Name', 'visible':true},
		 *     'status':{'index':2, 'data':'status', 'title':'Status', 'visible':true},
		 *     ...
		 * }
		 */
		var config = {'columns':{}, 'default':[], 'groups':[]};
		// any conguration option can be overridden
		for(var d in options) {
			if(_.has(config, d)) {
				config[d] = options[d];
			}
		}
		
		// a class can be added to this.$el
		if(_.has(options, 'class')) {
			this.$el.addClass(options.class);
		}
		
		// the width of the column visibility button container can be specified
		if(_.has(options, 'widthOverride') && _.isNumber(options.widthOverride)) {
			_.extend(config, {'widthOverride':options.widthOverride+'px'});
		}
		
		// add a sorted version of columns
		_.extend(config, {'sorted':_.sortBy(config.columns, 'index')})
		
		// check if a default was provided
		if(config.default.length<1) {
			config.default = _.pluck( _.filter(config.sorted, function(c){ return (_.has(c,'visible') && c.visible); }) , 'data');
		}
		//console.log(config);
		this.model = new Backbone.Model(config);
	},
	'render':function() {
		return this.$el.append( this.model.get('groups').length ? this.template_groups(this.model.toJSON()) : this.template_nogroups(this.model.toJSON()) );
	}
});