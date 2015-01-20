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
				'table':this.model.get('table'),
				'column':this.model.get('currentColumn'),
				'displayKey':this.model.get('displayKey'),
				'valueKey':this.model.get('valueKey'),
				'value':this.model.get('currentData'),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	'setValue':function(filterValue) {
		/*
		filterValue:
			value:<some kind of object that would come from one of the datasets>
			column:string -- should match a 'dataColumn' attribute in one of the collection models
		*/
		// TODO multi-column type
		console.log(filterValue);
		var dataset = this.collection.findWhere({'dataColumn':filterValue.column});
		if(dataset && _.has(filterValue,'column') && _.has(filterValue,'value')) {
			this.model.set('table', filterValue.table);
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
	
	// called from the filter factory
	'updateMultiColumns':function(columnsArray) {
		this.model.set('currentColumn', columnsArray);
	},
	
	//called from the filter factory
	'config':function(dataCol) {
		if(_.isArray(dataCol)) {
			// 
			var firstDataset = this.collection.findWhere({'column':dataCol[0]}),
				sameDataset = this.collection.where({'table':firstDataset.get('table')});
			
			this.model.set('table', $.map(sameDataset, function(e,i) {
				return e.get('column');
			}));
			this.model.set('currentColumn', dataCol);
			// displayKey and valueKey should be the same for items with the same dataset (source table)
			this.model.set('displayKey', firstDataset.get('displayKey'));
			this.model.set('valueKey', firstDataset.get('valueKey'));
			this.model.set('currentData', null);
		} else {
			var newData = this.collection.findWhere({'column':dataCol});
			if(dataCol!==this.model.get('currentColumn')) {
				this.model.set('table', newData.get('table'));
				this.model.set('currentColumn', newData.get('column'));
				this.model.set('displayKey', newData.get('displayKey'));
				this.model.set('valueKey', newData.get('valueKey'));
				this.model.set('currentData', null);
				
				// destroy current typeahead and rebuild using new dataset
				this.taInput.typeahead('val',null);
				this.taInput.typeahead('destroy');
				newData.get('dataset').initialize();
				this.taInput.typeahead(
					{'highlight':false, 'hint':false, 'minLength':3},
					{
						'name':newData.get('dataColumn'),
						'displayKey':newData.get('displayKey'),
						'source':newData.get('dataset').ttAdapter()
					}
				);
			}
		}
	},
	
	
	'events':{
		'typeahead:selected input.typeahead':function(jqEvent, suggestion, datasetName) {
			//this.model.set('currentColumn', datasetName);
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
						'table':e.table,
						'column':e.name,			// 'name' property from data table column meta data (will not be a sub-field identifier)
						'dataColumn':e.dataColumn,	// 'data' property from data table column meta data (will not be a sub-field identifier)
						'dataset':e.datasource,
						'displayKey':e.displayKey,
						'valueKey':e.valueKey
					};
				})
			);
			
			// use the first data set
			var defaultDataset = this.collection.at(0);
			this.model.set('table', defaultDataset.get('table'));
			this.model.set('currentColumn', defaultDataset.get('column'));
			this.model.set('displayKey', defaultDataset.get('displayKey'));
			this.model.set('valueKey', defaultDataset.get('valueKey'));
			this.model.set('currentData', null);
			
			// remember to initialize the bloodhound search engine
			defaultDataset.get('dataset').initialize();
			
			this.$el.html(this.template());
			
			// we may need to have an input for each different dataset (employees, clients, etc. etc.)
			this.taInput = $('input.typeahead',this.$el);
			this.taInput.typeahead(
				{'highlight':false, 'hint':false, 'minLength':3},
				{
					'name':defaultDataset.get('dataColumn'),
					'displayKey':defaultDataset.get('displayKey'),
					'source':defaultDataset.get('dataset').ttAdapter()
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