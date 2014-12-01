/*
An input for a column with a very large set of (known) values (too many to put into the page)
the primary input is a typeahead
[typeahead] -scrollable -custom templates 1)local, 2)prefetch 3)remote
*/
var VFilterWidgetTypeBiglistEq = VFilterWidgetType.extend({
	'version':'1.0.0',
	'type':'equals',
	
	/*
	model attributes:
	currentColumn
	currentData
	displayKey
	valueKey
	*/
	'model':null,
	
	// the text input used for typeahead
	'taInput':null,
	
	
	'isValid':function() {
		return this.model.get('currentData')!=null;
	},
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		
		this.trigger('notify', 'danger', 'Big List Filter ('+this.type+') Error', 'Biglist input cannot be empty.');
		return false;
	},
	
	'getDisplayValue':function() {
		if(this.isValid()) {
			if(typeof(this.model.get('displayKey'))==='function') {
				return this.model.get('displayKey')(this.model.get('currentData'));
			} else {
				return this.model.get('currentData')[this.model.get('displayKey')];
			}
		} else {
			return '';
		}
	},
	
	'getValueDescription':function() {//is this public?
		return this.isValid() ? ('is '+this.getDisplayValue()) : false;
	},
	'getValue':function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'column':this.model.get('currentColumn'),
				'value':this.model.get('currentData'),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	'setValue':function(filterValue) {
		//console.log(filterValue);
		/*
		filterValue:
			value:<some kind of object that would come from one of the datasets>
			column:string -- should match a 'dataColumn' attribute in one of the collection models
		*/
		var dataset = this.collection.findWhere({'dataColumn':filterValue.column});
		if(dataset && _.has(filterValue,'column') && _.has(filterValue,'value')) {
			this.model.set('currentColumn', filterValue.column);
			this.model.set('currentData', filterValue.value);
			
			this.model.set('displayKey', dataset.attributes.displayKey);
			this.model.set('valueKey', dataset.attributes.valueKey);
			$('input:text',this.$el).typeahead('val', this.getDisplayValue());
		}
	},
	'reset':function() {
		//reset happens just before setValue
		this.model.clear();
		this.taInput.val(null);
	},
	
	//not sure what this is for, maybe look in the filter factory
	'config':function(dataCol) {
		// dataCol must be a string; as of now I can't figure out how a multi-column filter
		// would handle multiple values, e.g. WHERE (1,2,3) IN('program_id, area_id)
		
		if(dataCol!==this.currentColumn) {
			this.currentColumn = dataCol;
			this.$el.html(this.template(this.collection.findWhere({'column':dataCol}).attributes));
		}
	},
	
	
	'events':{
		'typeahead:selected input.typeahead':function(jqEvent, suggestion, datasetName) {
			this.model.set('currentColumn', datasetName);
			this.model.set('currentData', suggestion);
			var dataset = this.collection.findWhere({'dataColumn':datasetName});
			if(dataset) {
				this.model.set('displayKey', dataset.attributes.displayKey);
				this.model.set('valueKey', dataset.attributes.valueKey);
			}
		}
	},
	
	'template':_.template([
		'<div class="form-group row">',
			'<div class="col-lg-col-xs-12">',
			'<input type="text" data-provide="typeahead" autocomplete="off" class="form-control typeahead" value="" />',
			'</div>',
		'</div>'
	].join('')),
	
	'initialize':function(options) {
		
		this.model = new Backbone.Model();
		
		if(_.has(options,'datasets') && _.isArray(options.datasets) && options.datasets.length) {
			//split datasets into groups by options.datasets[i].name (column name)
			this.collection = new Backbone.Collection(
				$.map(options.datasets, function(e,i){
					return {
						'column':e.name, // 'name' property from data table column meta data (may be a sub-field identifier)
						'dataColumn':e.dataColumn,// 'data' property from data table column meta data (will not be a sub-field identifier)
						'dataset':e.datasource,
						'displayKey':e.displayKey,
						'valueKey':e.valueKey
					};
				})
			);
			// use the first data set
			var defaultDataset = this.collection.at(0).attributes;
			this.model.set('currentColumn', defaultDataset.column);
			this.model.set('displayKey', defaultDataset.displayKey);
			this.model.set('valueKey', defaultDataset.valueKey);
			this.model.set('currentData', null);
			
			this.$el.html(this.template());
			
			// we may need to have an input for each different dataset (employees, clients, etc. etc.)
			this.taInput = $('input.typeahead',this.$el);
			this.taInput.typeahead(
				{'highlight':false, 'hint':false, 'minLength':3},
				{
					'name':defaultDataset.dataColumn,
					'displayKey':defaultDataset.displayKey,
					'source':defaultDataset.dataset.ttAdapter()
				}
			);
		} else {
			this.$el.html(this.template());
			this.taInput = $('input.typeahead',this.$el);
		}
	},
	'render':function() {
		return this;
	}
});