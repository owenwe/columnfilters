// Filter Widget Type Implementation Class for Enum (Select)
var VFilterWidgetTypeEnumIn = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'in',
	
	currentColumn:null,
	
	isValid:function() {
		return $.map($('.dropdown-menu input:checked',this.$el), function(e,i){ return e.value*1; }).length>0;
	},
	validate:function() {
		if(this.isValid()) {
			return true;
		}
		
		console.log('Enum checklist cannot be empty');
		return false;
	},
	getValueDescription:function() {//is this public?
		
		if(this.isValid()) {
			return 'is one of these : (' + $.map($('.dropdown-menu input:checked',this.$el), function(e,i){ return e.value*1; }).join(',') + ')';
		} else {
			return false;
		}
	},
	getValue:function() {
		if(this.validate()) {
			var checkMap = [],
				desc_1 = 'is one of these : (',
				checkNames = [],
				desc_2 = ')';
			$('.dropdown-menu label',this.$el).each(function(i,e) {
				var chkInpt = $('input',$(e))[0],
					span = $('span',$(e));
				if(chkInpt.checked) {
					checkMap.push({'code':chkInpt.value*1, 'name':span.html()});
					checkNames.push(span.html());
				}
			});
			
			return {
				'type':this.type,
				'column':this.currentColumn,
				'value':checkMap,
				'description':[desc_1,checkNames.join(','),desc_2].join('')
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		//TODO check if we need to set the enum group
		console.log(filterValue);
		
		
		//set the checkboxes to the values in valueList
		var vl = filterValue.value,
			c = this.collection;
		$('.dropdown-menu input',this.$el).each(function(i,e) {
			for(var i in vl) {
				var foundMatch = ( (e.value*1)===vl[i].code );
				e.checked = foundMatch;
				if (foundMatch) {
					break;
				} 
			}
		});
	},
	reset:function() {
		//reset happens just before setValue
		//$('.dropdown-menu input',this.$el).each(function(i,e) {
			//e.checked = false;
		//});
		//this.$el.empty();
	},
	
	config:function(dataCol) {
		// dataCol must be a string; as of now I can't figure out how a multi-column filter
		// would handle multiple values, e.g. WHERE (1,2,3) IN('program_id, area_id)
		
		if(dataCol!==this.currentColumn) {
			this.currentColumn = dataCol;
			this.$el.html(this.template(this.collection.findWhere({'column':dataCol}).attributes));
		}
	},
	
	
	events:{
		'click .dropdown-menu input, .dropdown-menu label':function(e) {
			e.stopPropagation();
		},
		'change .dropdown-menu input':function(e) {
			e.stopPropagation();
			return false;
		},
	},
	//className:'dropdown',
	// data.enums = array of {code, column, <label key>}
	// data.column = string name of column, used for grouping
	// data.labelKey = 
	template:_.template([
		'<div class="keep-open">',
			'<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">Check 1 or more <span class="caret"></span></button>',
			'<ul class="dropdown-menu cf-enum-dropdown-list" role="menu">',
				'<% for(var i in data.enums) { %>',
					'<li>',
						'<div class="checkbox">',
							'<label>',
								'<input type="checkbox" value="<%= data.enums[i].id %>" data-column="<%= data.column %>" />',
								'<span class="text-capialize"><%= data.enums[i][data.labelKey] %></span>',
							'</label>',
						'</div>',
					'</li>',
				'<% } %>',
			'</ul>',
		'</button>',
		'</div>'
	].join(''),{variable:'data'}),
	initialize:function(options) {
		//split enums into groups by options.enums[i].name
		// check options.enums array of keys named 'id', a mapped copy of the array will 
		// need to be made where the 'id' keys are renamed to 'code'
		var enumData;
		
		this.collection = new Backbone.Collection(
			$.map(options.enums, function(e,i){
				return { 'column':e.name, 'enums':e.cfenumsource, 'labelKey':e.cfenumlabelkey };
			})
		);
		this.currentColumn = this.collection.at(0).attributes.column;
		this.$el.html(this.template(this.collection.at(0).attributes));
	},
	render:function() {
		return this;
	}
});
