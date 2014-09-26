// DataFilters (the main shit)
var VDataFilters = Backbone.View.extend({
	defaultConfig:{
		'table':'undefined',
		'showOnInit':true,
		'filters':false,
		'filterCategories':[]
	},
	table:'undefined',
	filters:null,//a collection of MDataFilter
	filterCategories:[],
	currentFilterCategory:null,//key for filtering models in the filters
	currentColumnFilter:{'table':null,'type':null,'column':null,'label':null},
	filterFactory:null,
	dataFiltersContainer:null,//panel body view
	dataFiltersControl:null,//panel footer, kind of
	
	// makes sure there are no duplicates and then adds a menu dropup to the footer control
	addCategory:function(name, filters) {
		//console.log('adding filter category: '+name);
		//console.log(this.filterCategories);
		if($.inArray(name,this.filterCategories)<0) {
			this.filterCategories.push(name);
			$('nav.cf-datafilters-controller-footer div.navbar-collapse',this.$el).append(
				_.template(CFTEMPLATES.filterCategoryMenu,{variable:'filterCategory'})({'name':name})
			);
		}
		// TODO handle filters arg
		
	},
	
	tagName:'div',
	className:'panel panel-default',
	events:{
		// triggered when the data column from the dropdown list is clicked
		// is to load the data info from the clicked event into the filter factory
		'click ul.cf-columns-select-dd li a':function(e) {
			this.currentColumnFilter = {
				'type':$(e.currentTarget).attr('data-type'),
				'column':$(e.currentTarget).attr('data-name'),
				'label':$(e.currentTarget).html()
			};
			this.filterFactory.load(this.currentColumnFilter.type, this.currentColumnFilter.column, this.currentColumnFilter.label);
		},
		// triggered when the add filter button is clicked
		// should first call validate on the active filter type
		'click button.cf-add-filter-button':function(e) {
			// TODO call validate() on the filter widget
			//this.filterFactory.disable();
			var af = this.filterFactory.activeFilter(),
				fVal = af?this.filterFactory.getFilterValue():false;
			if(fVal) {
				//this.dataFiltersContainer.add(this.currentColumnFilter, fVal);
				//add to the current category of filters
				this.filters.add(new MDataFilter({
					'table':this.table,
					'category':this.currentFilterCategory,
					'type':this.currentColumnFilter.type,
					'column':this.currentColumnFilter.column,
					'label':this.currentColumnFilter.label,
					'filterValue':fVal
				}));
			}
		}
	},
	initialize:function(options) {
		if(_.has(options,'table') && _.isString(options.table)) {
			this.table = options.table;
		}
		
		// filterOptions will populate the dropdown list of columns
		var filterOptions = [];
		if(options.hasOwnProperty('tableColumns') && _.isArray(options.tableColumns)) {
			//assert tableColumns is an array of objects: []{name:<the column name>, type:<data-type>, label:<string>}
			for(var i in options.tableColumns) {
				var tc = options.tableColumns[i];
				if(_.isObject(tc) && (_.has(tc,'name') && _.has(tc,'type') && _.has(tc,'label'))) {
					filterOptions.push(
						$(document.createElement('li')).append(
							$(document.createElement('a')).attr({'href':'#','data-type':tc.type,'data-name':tc.name}).html(tc.label)
						)
					);
				}
			}
		}
		
		if(_.has(options,'showOnInit') && _.isBoolean(options.showOnInit)) {
			this.defaultConfig.showOnInit = options.showOnInit;
		}
		
		this.filterFactory = new VDataFilterFactory({showOnInit:this.defaultConfig.showOnInit, collection:new Backbone.Collection(
			[
				new VDataColumnFilterWidget({type:'date',collection:new Backbone.Collection([
					new VFilterWidgetTypeDateEq(),
					new VFilterWidgetTypeDateBtwn(),
					new VFilterWidgetTypeDateSel(),
					new VFilterWidgetTypeDateCycle()
					
				])}),
				new VDataColumnFilterWidget({type:'text',collection:new Backbone.Collection([
					new VFilterWidgetTypeTextEq(),
					new VFilterWidgetTypeTextSrch()
				])}),
				new VDataColumnFilterWidget({type:'number',collection:new Backbone.Collection([
					new VFilterWidgetTypeNumberEq(),
					new VFilterWidgetTypeNumberBtwn(),
					new VFilterWidgetTypeNumberSel()
					
				])}),
				
			]
		)});
		
		var panelHeading = $(document.createElement('div')).addClass('panel-heading well-sm').append(
			$(document.createElement('div')).addClass('row').append(
				$(document.createElement('div')).addClass('col-md-2 text-center').append(
					$(document.createElement('strong')).addClass('h3').html('Data Filters')
				),
				$(document.createElement('div')).addClass('col-md-2').append(
					$(document.createElement('div')).addClass('btn-group').append(
						$(document.createElement('button')).attr({'type':'button'})
														   .addClass('btn btn-default btn-xs cf-add-filter-button')
														   .html('Add Filter'),
						$(document.createElement('button')).attr({'type':'button','data-toggle':'dropdown'})
														   .addClass('btn btn-default btn-xs dropdown-toggle')
														   .append(
							$(document.createElement('span')).addClass('caret'),
							$(document.createElement('span')).addClass('sr-only').html('Toggle Dropdown')
						),
						$(document.createElement('ul')).attr({'role':'menu'}).addClass('dropdown-menu cf-columns-select-dd').append(filterOptions)
					)
				),
				$(document.createElement('div')).addClass('col-md-8').append(
					this.filterFactory.el
				)
			)
		);
		
		if(this.defaultConfig.showOnInit) {
			var colSelList = $('ul.cf-columns-select-dd li a', panelHeading);
			if(colSelList.length) {
				var firstColFilter = colSelList.first();
				this.currentColumnFilter = {
					'group':firstColFilter.attr('data-type'),
					'column':firstColFilter.attr('data-name'),
					'label':firstColFilter.html()
				};
			}
		}
		
		// check for filters on construction
		if(_.has(options,'filters')) {
			this.defaultConfig.filters = options.filters;
		} else {
			this.filters = new CDataFilters();
		}
		this.filters.on('add', function(filter) {
			console.log('filters category add event triggered');
			console.log(filter);
			// TODO find out if a pill-tab exists for this group
			//filter = model with {group,column,label}
			/*$('.nav',this.$el).append(
				_.template(
					'<li><a href="" role="pill" data-toggle="pill"><%= filterAttributes.label %> <span class="badge pull-right"></span></a></li>'
				)({'filterAttributes':filter.attributes})
			);*/
			//first look for an existing li in <ul class="dropdown-menu" role="menu">
			
			
		}, this);
		
		// There will always be a user (or default) filter
		// should pull all table filters/column filters for this user + common and public
		this.dataFiltersContainer = new VDataFiltersContainer();
		this.dataFiltersControl = _.template(CFTEMPLATES.dataFiltersControlFooter)({variable:'controller'});
		
		this.$el.append(panelHeading,this.dataFiltersContainer.el,this.dataFiltersControl);
		
		// fetch filters from AJAX, but for now just populate
		// default filter category includes a User
		if(_.has(options,'filterCategories') && _.isArray(options.filterCategories)) {
			this.filterCategories = options.filterCategories;
			this.currentFilterCategory = this.filterCategories.length?this.filterCategories[0]:'';
			for(var i in this.filterCategories) {
				this.addCategory(this.filterCategories[i]);
			}
		} else {
			this.filterCategories = this.defaultConfig.filterCategories;
			this.currentFilterCategory = 'User';
			this.addCategory(this.currentFilterCategory);
		}
		
		
		//$('div.navbar-collapse',this.dataFiltersControl).append(
		//	_.template(
		//		'<li><a href="" role="pill" data-toggle="pill"><%= filterAttributes.label %> <span class="badge pull-right"></span></a></li>',
		//		{variable:'filterGroup'}
		//	)({})
		//);
		//filterCategoryDropup
		
	},
	render:function() {
		
		return this;
	}
});
