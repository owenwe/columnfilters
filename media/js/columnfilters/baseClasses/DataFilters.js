// DataFilters (the main shit)
var VDataFilters = Backbone.View.extend({
	defaultConfig:{
		'table':'undefined',
		'showFirst':null,
		'filters':false,
		'filterCategories':[]
	},
	table:'undefined',
	filters:null,//a collection of MDataFilter
	filterCategories:[],//array of names
	currentFilterCategory:null,//key for filtering models in the filters
	currentColumnFilter:{'table':null,'type':null,'column':null,'label':null},
	filterFactory:null,
	dataFiltersContainer:null,//panel body view
	dataFiltersControl:null,//panel footer, kind of
	
	filterCategoryGlyphMapping:function(catName) {
		var retVal = 'glyphicon-cloud-upload';
		switch(catName) {
			case 'User':
			case 'user':
				retVal = 'glyphicon-user';
				break;
		}
	},
	
	// makes sure there are no duplicates and then adds a menu dropup to the footer control
	// and a dropup link to 
	addCategory:function(name, filters) {
		if($.inArray(name,this.filterCategories)<0) {
			this.filterCategories.push(name);
			
			// add a menu dropup to the footer control nav bar
			$('nav.cf-datafilters-controller-footer div.navbar-collapse',this.$el).append(
				_.template(CFTEMPLATES.filterCategoryMenu,{variable:'filterCategory'})({'name':name})
			);
			
			// add list item to the save menu dropup
			var saveUl = $('nav.cf-datafilters-controller-footer ul.navbar-right li.cf-save-filter-list ul.dropdown-menu',this.$el);
			saveUl.append(
				_.template(
					CFTEMPLATES.filterCategorySaveItem,
					{variable:'filterCategory'}
				)({'name':name, 'glyph':this.filterCategoryGlyphMapping(name)})
			);
			
			// if there are more categories to add after this one, add a divider (for style)
			if(this.filterCategories.length < this.defaultConfig.filterCategories.length) {
				saveUl.append( $(document.createElement('li')).addClass('divider') );
			}
			
			// set the current filter category to the first category added
			if(this.filterCategories.length===1) {
				this.currentFilterCategory = this.filterCategories[0];
			}
		}
		// TODO handle filters arg (used when filters are pulled from existing data): 
		
	},
	
	tagName:'div',
	className:'panel panel-default',
	
	
	events:{
		// FILTER SUB-TYPE CHANGE
		// is to load the data info from the clicked event into the filter factory
		'click ul.cf-columns-select-dd li a':function(e) {
			this.currentColumnFilter = {
				'table':this.table,
				'type':$(e.currentTarget).attr('data-type'),
				'column':$(e.currentTarget).attr('data-name'),
				'label':$(e.currentTarget).html()
			};
			this.filterFactory.load(this.currentColumnFilter.type, this.currentColumnFilter.column, this.currentColumnFilter.label);
		},
		
		// ADD FILTER CLICK
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
		},
		
		// triggered when the save filter item is clicked
		'click nav.cf-datafilters-controller-footer ul.nav li.btn[title="save"] ul.dropdown-menu li':function(e) {
			var cat = $(e.currentTarget).data('save-type'),
				catDd = $('nav.cf-datafilters-controller-footer div.navbar-collapse ul[data-category-name="'+cat+'"]',this.$el),
				catDdLi = $('li.dropup', catDd),
				catDdMenu = $('ul.dropdown-menu',catDdLi);
			// TODO filter category dropup will be enabled and have a list item associated with the current filters
			// TODO check if there is filter data to save
			if(catDdLi.hasClass('disabled')) {
				//this is the first filter being saved to this category
				
				catDdLi.removeClass('disabled');
			}
			
			
		}
	},
	
	
	initialize:function(options) {
		if(_.has(options,'table') && _.isString(options.table)) {
			this.table = options.table;
		}
		if(_.has(options,'showFirst') && _.isString(options.showFirst)) {
			this.defaultConfig.showFirst = options.showFirst;
		}
		if(_.has(options,'filters')) {
			// TODO populate
			this.defaultConfig.filters = options.filters;
		} else {
			this.filters = new CDataFilters();
		}
		// can fetch filters from AJAX, or just populate
		if(_.has(options,'filterCategories') && _.isArray(options.filterCategories)) {
			this.defaultConfig.filterCategories = options.filterCategories;
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
		
		this.filterFactory = new VDataFilterFactory({showOnInit:this.defaultConfig.showOnInit, collection:new Backbone.Collection(
			[
				new VDataColumnFilterWidget({type:'text',collection:new Backbone.Collection([
					new VFilterWidgetTypeTextEq(),
					new VFilterWidgetTypeTextSrch()
				])}),
				new VDataColumnFilterWidget({type:'number',collection:new Backbone.Collection([
					new VFilterWidgetTypeNumberEq(),
					new VFilterWidgetTypeNumberBtwn(),
					new VFilterWidgetTypeNumberSel()
					
				])}),
				new VDataColumnFilterWidget({type:'date',collection:new Backbone.Collection([
					new VFilterWidgetTypeDateEq(),
					new VFilterWidgetTypeDateBtwn(),
					new VFilterWidgetTypeDateSel(),
					new VFilterWidgetTypeDateCycle()
					
				])})
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
		
		// event handler when a filter is added
		this.filters.on('add', function(filter) {
			this.dataFiltersContainer.add(filter);
		}, this);
		
		
		// There will always be a user (or default) filter
		// should pull all table filters/column filters for this user + common and public
		this.dataFiltersContainer = new VDataFiltersContainer();
		this.dataFiltersControl = _.template(CFTEMPLATES.dataFiltersControlFooter,{variable:'controller'})({'filterCategories':this.defaultConfig.filterCategories});
		
		this.$el.append(panelHeading,this.dataFiltersContainer.el,this.dataFiltersControl);
		
		
		this.listenTo(this.dataFiltersContainer,'removeClick', function(filterCid) {
			console.log('handling filter container remove click: '+filterCid);
			this.filters.remove(this.filters.get(filterCid));
		});
		this.listenTo(this.dataFiltersContainer,'changeClick', function(filterCid) {
			console.log('handling filter container change click: '+filterCid);
			console.log(this.filters.get(filterCid).attributes);
		});
		
		
		if(this.defaultConfig.filterCategories.length) {
			for(var i in this.defaultConfig.filterCategories) {
				this.addCategory(this.defaultConfig.filterCategories[i]);
			}
		}
		
		if(_.isString(this.defaultConfig.showFirst)) {
			var dfDdLi = $('ul.cf-columns-select-dd li a[data-name="'+this.defaultConfig.showFirst+'"]',this.$el);
			if(dfDdLi.length) {
				this.currentColumnFilter = {
					'table':this.table,
					'type':dfDdLi.first().data('type'),
					'column':dfDdLi.first().data('name'),
					'label':dfDdLi.first().html()
				};
				this.filterFactory.load(this.currentColumnFilter.type, this.currentColumnFilter.column, this.currentColumnFilter.label);
			}
		}
		
	},
	render:function() {
		
		return this;
	}
});
