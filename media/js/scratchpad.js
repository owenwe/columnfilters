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
		 [*] (month) [month list]
		 [*] (year-month) datepicker with min type set to month
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
],
	employees = new Bloodhound({
		'name':'employees',
		'datumTokenizer':function(d) {
			return [d.fname, d.lname];
		},
		'queryTokenizer':Bloodhound.tokenizers.whitespace,
		'prefetch':{
			/*'filter':function(list) {
			return $.map(list, function(user) {
				return {
					'fname':user.fname, 
					'lname':user.lname,
					'name':(user.fname+' '+user.lname), 
					'id':user.id
				}
			});
		},*/
			'url':'testData/employees.json'
		}
	});

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
	{
		'data':'manager',
		'name':'manager',
		'title':'Manager',
		'type':'object',
		'cftype':'biglist',
		'datasource':employees,
		'displayKey':function(emp) {
			return emp.id===1?'':[emp.fname,emp.lname].join(' ');
		},
		'valueKey':'id',
		'visible':true
	},
	{'data':'dataInteger', 'name':'dataInteger', 'title':'Number (int)', 'type':'num', 'visible':true, 'cftype':'number', 'config':{'step':1,'min':0,'max':999}},
	{'data':'dataFloat', 'name':'dataFloat', 'title':'Number (float)', 'type':'num', 'visible':true, 'cftype':'number', 'config':{'step':1,'min':0,'max':999}},
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
		'name':'program.id', 
		'title':'Program', 
		'type':'num', 
		'visible':false,
		'cftype':'enum',
		'cfenumsource':programs,
		'cfenumvaluekey':'id',
		'cfenumlabelkey':'code'
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
		if(config['default'].length<1) {
			config['default'] = _.pluck( _.filter(config.sorted, function(c){ return (_.has(c,'visible') && c.visible); }) , 'data');
		}
		//console.log(config);
		this.model = new Backbone.Model(config);
	},
	'render':function() {
		return this.$el.append( this.model.get('groups').length ? this.template_groups(this.model.toJSON()) : this.template_nogroups(this.model.toJSON()) );
	}
});