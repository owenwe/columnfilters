// DataFilters (the main shit)
var VDataFilters = Backbone.View.extend({
	
	/*
	Default: Column/Type-Based
	these should translate to AND clauses being appended to WHERE
	i.e. WHERE id>1 AND {column} {filter opperand} {filter value(s)}
	[column filter dropdown] [filter factory]
	
	Common Value: Value/Type-Based
	this should translate to a reverse IN clause being appended to WHERE for the columns given
	(technically it translates to an OR clause)
	i.e. WHERE id>1 AND (
		{filter value} IN({column1},{column2},...)
	)
	[column filter multi select dropdown] [filter factory]
	*/
	FILTER_SELECTION_TYPES:{ 'DEFAULT':0, 'COMMON_VALUE':1 },
	
	// Enum of the different interactive modes this control can be put into
	MODES:{ 'DEFAULT':0, 'CATEGORY_SETS':1 },
	
	defaultConfig:{
		'mode':0,
		'table':'undefined',
		'showFirst':null,
		'filterSelectionType':0,
		'filters':false,
		'filterCategories':[]
	},
	mode:0,					// setting the mode to 1 enables the save/remove filter set and filter set groups
	table:'undefined',		// the name of the database table or virtual source
	filterSelectionType:0,  // the type of filter selection to display
	filters:null,			// a collection of MDataFilter
	filterCategories:[],	// array of names
	
	//key/value container for groups filter categories
	// TODO JS Object, LocalStorage, Backbone.Collection with AJAX backend to a DB
	// { <key = name>:{description:<string>, filters:[]} }
	filterCategorySets:{},
	
	//the modal for add/edit filter sets
	modal:null,
	
	// TODO turn categories into collections
	
	//key for filtering models in the filters
	//categories end up being drop down lists in the dataFiltersControl nav bar
	currentFilterCategory:null,
	
	//index to the filter set in this.filterCategorySets[currentFilterCategory].filters
	currentWorkingFilterSet:null,
	
	//cid of the model in the filters collection during an edit
	editFilterCid:null,
	
	//used to keep track of filters displayed in the dataFiltersContainer
	currentColumnFilter:{'table':null,'type':null,'column':null,'label':null},
	
	//used to keep track of the filter control nav bar dropdowns
	preEditFilterControlStates:[],
	
	commonValueControl:null,	//multi-column value filter control
	filterFactory:null,			//all filter widgets
	dataFiltersContainer:null,	//panel body view
	dataFiltersControl:null,	//panel footer, kind of
	
	filterCategoryGlyphMapping:function(catName) {
		var retVal = 'glyphicon-cloud-upload';
		switch(catName) {
			case 'User':
			case 'user':
				retVal = 'glyphicon-user';
				break;
		}
		return retVal;
	},
	
	
	// called from the event when the filter selection type radio set is changed
	filterSelectionTypeChange:function(newSelectionType) {
		switch(newSelectionType) {
			case this.FILTER_SELECTION_TYPES.DEFAULT:
				this.filterSelectionType = this.FILTER_SELECTION_TYPES.DEFAULT;
				$('.cf-add-change-filter-group-button button.dropdown-toggle',this.$el).removeAttr('disabled').removeClass('disabled');
				
				// TODO check filter factory
				// reset filter factory
				this.filterFactory.reset().hide();
				
				this.commonValueControl.hide();
				break;
			case this.FILTER_SELECTION_TYPES.COMMON_VALUE:
				this.filterSelectionType = this.FILTER_SELECTION_TYPES.COMMON_VALUE;
				// disable change column dropdown
				$('.cf-add-change-filter-group-button button.dropdown-toggle',this.$el).attr('disabled','disabled').addClass('disabled');
				
				// check if columns are selected in the drop down
				// change to/show filter factory type if there is a selection
				// hide filter factory type if no selection
				if(this.commonValueControl.selectedCount) {
					var selColData = this.commonValueControl.getSelectedColumnData();
					this.changeFilterFactoryType(selColData.type,selColData.name,selColData.label);
					//this.commonValueColumnSelectionChange(this.commonValueControl.selectedColumns[0].attributes);
				} else {
					var af = this.filterFactory.activeFilter();
					if(af) {
						af.hide();
					}
				}
				
				// show common value control
				this.commonValueControl.show();
				break;
		}
	},
	
	// when a common value column item in the drop down list is changed
	// columnData: {label: string, name: could be a string or an array, type: string }
	// 
	commonValueColumnSelectionChange:function(columnData) {
		if(this.commonValueControl.selectedCount) {// columns are selected
			//tell the filter factory to show this data type (if it isn't already)
			if(this.filterFactory.activeFilter().type !== columnData.type) {
				this.changeFilterFactoryType(columnData.type,columnData.name,columnData.label);
			} else {
				// type is the same, so just update the column
				this.currentColumnFilter.label = columnData.label;
				this.currentColumnFilter.column =_.map(this.commonValueControl.selectedColumns, function(c) { return c.attributes.name; })
				//this.filterFactory.updateFilterLabel(this.currentColumnFilter.label);
			}
		} else {//no more columns are selected
			//tell filter factorty to hide the active filter (if one is visible)
			var af = this.filterFactory.activeFilter();
			if(af) {
				af.hide();
			}
		}
	},
	
	// changes the filter factory widget to the given type
	// column could be a string or an array
	changeFilterFactoryType:function(type,column,label,subType) {
		this.currentColumnFilter = {
			'table':this.table,
			'type':type,
			'column':column,
			'label':label
		};
		this.filterFactory.load(this.currentColumnFilter.type, _.isArray(column)?'multi-column':this.currentColumnFilter.label, subType);
	},
	
	// show the save/cancel edit button group and disable everything but it and the filter factory
	editFilterMode:function() {
		// show cancel and save filter button
		$('button.cf-edit-filter-button', this.$el).show();
		$('button.cf-cancel-edit-filter-button', this.$el).show();
		
		//	hide add filter/change column button
		$('.cf-add-change-filter-group-button button',this.$el).hide();
		
		//disable data filter type button group
		$('.cf-data-filter-type-selection label').addClass('disabled');
		$('.cf-data-filter-type-selection input').attr('disabled','disabled');
		
		//	disable filter container
		this.dataFiltersContainer.disable()
		
		//	disable filters control (need to keep track of what was already disabled)
		this.preEditFilterControlStates = [];
		var pefcs = this.preEditFilterControlStates;
		$('ul.nav li',this.dataFiltersControl).each(function(i,e) {
			pefcs.push({'listItem':$(e), 'hasDisabledClass':$(e).hasClass('disabled')});
			if(!$(e).hasClass('disabled')) {
				$(e).addClass('disabled');
			}
		});
	},
	
	// undo everything done in editFilterMode
	cancelEditFilterMode:function() {
		$('button.cf-edit-filter-button', this.$el).hide();
		$('button.cf-cancel-edit-filter-button', this.$el).hide();
		$('.cf-add-change-filter-group-button button',this.$el).show();
		$('.cf-data-filter-type-selection label').removeClass('disabled');
		$('.cf-data-filter-type-selection input').removeAttr('disabled');
		this.dataFiltersContainer.enable();
		for(var i in this.preEditFilterControlStates) {
			var preFilterState = this.preEditFilterControlStates[i];
			if(!preFilterState.hasDisabledClass) {
				preFilterState.listItem.removeClass('disabled');
			}
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
	
	// returns filters as an object, or false if there aren't filters to return
	getCurrentFilter:function() {
		if(this.mode==this.MODES.DEFAULT) {
			if(this.filters.length) {
				return this.filters.toJSON();
			} else {
				return false;
			}
		} else {
			// TODO look at currentWorkingFilterSet and currentFilterCategory and currentColumnFilter
			console.log(this.currentColumnFilter);
		}
	},
	
	tagName:'div',
	className:'panel panel-default',
	
	events:{
		
		// DATA FILTER TYPE CHANGE
		// is to change the data filter type selection to the selected type
		'change .btn-group.cf-data-filter-type-selection input':function(e) {
			var eVal = e.currentTarget.value*1;
			this.filterSelectionTypeChange(eVal);
		},
		
		
		// COLUMN FILTER CHANGE
		// is to load the data info from the clicked event into the filter factory
		'click ul.cf-columns-select-dd li a':function(e) {
			this.changeFilterFactoryType($(e.currentTarget).data('type'),$(e.currentTarget).data('name'),$(e.currentTarget).html());
		},
		
		// ADD FILTER CLICK
		// should first call validate on the active filter type
		'click button.cf-add-filter-button':function(e) {
			
			//this.filterFactory.disable();
			var af = this.filterFactory.activeFilter(),
				fVal = af?this.filterFactory.getFilterValue():false;
			
			// TODO check if we are in COMMON_VALUE mode
			//		if it is, then check if more than 1 column has been selected
			if(this.filterSelectionType && this.currentColumnFilter.column.length<2) {
				alert('Multiple columns are required for a common value, otherwise just use a regular data filter.');
				return false;
			}
			
			if(fVal) {
				// enable save filter dropdown
				if($('li.cf-save-filter-list', this.dataFiltersControl).hasClass('disabled')) {
					$('li.cf-save-filter-list', this.dataFiltersControl).removeClass('disabled');
				}
				
				// create new data filter
				var ndf = new MDataFilter({
					'table':this.table,
					'category':this.currentFilterCategory,
					'type':this.currentColumnFilter.type,
					'column':this.currentColumnFilter.column,
					'label':this.currentColumnFilter.label,
					'filterValue':fVal
				});
				
				// listen for change event on the model
				ndf.on('change:filterValue', function(filter) {
					//need to update filter tab content list item
					this.dataFiltersContainer.updateFilter(filter);
				}, this);
				
				//add to the current category of filters
				this.filters.add(ndf);
			}
		},
		
		// SAVE FILTER CLICK
		// triggered when the save filter item is clicked
		'click nav.cf-datafilters-controller-footer ul.nav li.btn[title="save"] ul.dropdown-menu li':function(e) {
			var cat = $(e.currentTarget).data('save-type'),
				catDd = $('nav.cf-datafilters-controller-footer div.navbar-collapse ul[data-category-name="'+cat+'"]',this.$el),
				catDdLi = $('li.dropup', catDd),
				catDdMenu = $('ul.dropdown-menu',catDdLi);
			// TODO filter category dropup will be enabled and have a list item associated with the current filters
			// TODO check if there is filter data to save
			
			//reset the modal and then show it
			$('div.modal form', this.$el)[0].reset();
			this.modal.modal('show');
			
			if(catDdLi.hasClass('disabled')) {
				//this is the first filter set being saved to this category
				catDdLi.removeClass('disabled');
				
			} else {
				//add another filter set to the existing category
				
			}
		},
		
		// SAVE EDIT FILTER CLICK
		'click button.cf-edit-filter-button':function(e) {
			//get filter value from filterFactory and apply it to the filter in the collection
			//this should update the dataFiltersContainer view
			//if this.currentWorkingFilterSet is null then we don't have to trigger an update event on the collection model
			if(this.filterFactory.getFilterValue()) {
				this.cancelEditFilterMode();
				this.filters.get(this.editFilterCid).set({'filterValue':this.filterFactory.getFilterValue()});
			}
		},
		
		// CANCEL EDIT FILTER CLICK
		'click button.cf-cancel-edit-filter-button':function(e) {
			this.cancelEditFilterMode();
		},
		
		// MODAL ACTION BUTTON CLICK
		'click div.modal div.modal-footer button:last-child':function(e) {
			//for now this is only triggered for saving filter sets
			// TODO validate form inputs
			var fsName = $.trim($('input#cfFilterSetSaveName',this.modal).val());
			if(fsName.length) {
				var fsDesc = $.trim($('textarea#cfFilterSetSaveDescription',this.modal).val());
				if(_.has(this.filterCategorySets, this.currentFilterCategory)) {
					//add to the existing filter set
					
				} else {
					//create new filter set
					/*this.filterCategorySets[this.currentFilterCategory] = {
						'table':this.table,
						'name':fsName,
						'description':fsDesc.length?fsDesc:null,
						'filters':this.filters.where({'category':})
					};*/
				}
				
				//currentWorkingFilterSet
				
			}
			
			//use info from form inputs to create a list item in the category dropdown
			
			
			//
			
		}
	},
	
	
	initialize:function(options) {
		if(_.has(options,'mode') && _.isNumber(options.mode)) {
			// TODO make sure passed in value exists in MODES
			this.defaultConfig.mode = this.mode = options.mode;
		}
		if(_.has(options,'table') && _.isString(options.table)) {
			this.table = options.table;
		}
		if(_.has(options,'showFirst') && _.isString(options.showFirst)) {
			this.defaultConfig.showFirst = options.showFirst;
		}
		if(_.has(options,'filterSelectionType') && _.isNumber(options.filterSelectionType)) {
			this.defaultConfig.filterSelectionType = this.filterSelectionType = options.filterSelectionType;
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
		
		// validTableColumns will populate the dropdown list of columns and the common value control
		var validTableColumns = [];
		if(options.hasOwnProperty('tableColumns') && _.isArray(options.tableColumns) && options.tableColumns.length) {
			//assert tableColumns is an array of objects: []{name:<the column name>, type:<data-type>, label:<string>}
			for(var i in options.tableColumns) {
				var tc = options.tableColumns[i];
				if(_.isObject(tc) && (_.has(tc,'name') && _.has(tc,'type') && _.has(tc,'label'))) {
					// add extra properties for the common value control
					validTableColumns.push(_.extend(tc,{'selected':false}));
				}
			}
		}
		
		// Create and Populate the filter factory
		this.filterFactory = new VDataFilterFactory({showOnInit:this.defaultConfig.showOnInit, collection:new Backbone.Collection(
			[
				new VDataColumnFilterWidget({type:'text', collection:new Backbone.Collection([
					new VFilterWidgetTypeTextEq(),
					new VFilterWidgetTypeTextSrch()
				])}),
				new VDataColumnFilterWidget({type:'number', collection:new Backbone.Collection([
					new VFilterWidgetTypeNumberEq(),
					new VFilterWidgetTypeNumberBtwn(),
					new VFilterWidgetTypeNumberSel()
					
				])}),
				new VDataColumnFilterWidget({type:'date', collection:new Backbone.Collection([
					new VFilterWidgetTypeDateEq(),
					new VFilterWidgetTypeDateBtwn(),
					new VFilterWidgetTypeDateSel(),
					new VFilterWidgetTypeDateCycle()
					
				])})
			]
		)});
		
		// There will always be a user (or default) filter
		// should pull all table filters/column filters for this user + common and public
		this.dataFiltersContainer = new VDataFiltersContainer();
		
		this.$el.append(
			_.template(CFTEMPLATES.dataFiltersPanelContent,{variable:'panelheading'})({'filterColumns':validTableColumns}),
			this.dataFiltersContainer.el,
			_.template(CFTEMPLATES.dataFiltersControlFooter,{variable:'controller'})({'filterCategories':this.defaultConfig.filterCategories})
		);
		
		//add UI components and set initial display states for UI
		this.commonValueControl = new VCommonValueFilterControl({'columns':validTableColumns});
		$('div.cf-common-value-controller-replace',this.$el).replaceWith(this.commonValueControl.$el);
		$('.cf-filter-factory-container-row',this.$el).append(this.filterFactory.el);
		$('button.cf-edit-filter-button', this.$el).hide();
		$('button.cf-cancel-edit-filter-button', this.$el).hide();
		
		// set properties for view
		this.dataFiltersControl = $('nav.cf-datafilters-controller-footer',this.$el);
		
		// re-usable modal
		$('div.modal div.modal-body', this.$el).html(_.template(CFTEMPLATES.saveFilterSetModalForm)({}));
		this.modal = $('div.modal',this.$el).modal({
			'backdrop':'static',
			'keyboard':false,
			'show':false
		});
		
		// EVENT HANDLERS
		// event handler when a filter is added
		this.filters.on('add', function(filter) {
			this.dataFiltersContainer.add(filter);
		}, this);
		
		this.filters.on('remove', function(filter) {
			if(this.filters.length<1) {
				// disable the save filter dropdown
				$('li.cf-save-filter-list', this.dataFiltersControl).addClass('disabled');
			}
		}, this);
		
		// when the remove button from a filter in the filter container view is clicked
		this.listenTo(this.dataFiltersContainer,'removeClick', function(filterCid) {
			this.filters.remove(this.filters.get(filterCid));
		});
		
		// upstream handler when a filter item edit click event
		this.listenTo(this.dataFiltersContainer,'changeClick', function(filterCid) {
			this.editFilterCid = filterCid;
			this.editFilterMode();
			
			var f = this.filters.get(this.editFilterCid).attributes;
			this.changeFilterFactoryType(f.type,f.column,f.label,f.filterValue.type);
			this.filterFactory.setFilterValue(f);
		});
		
		// upstream handler when a common value column is clicked
		this.listenTo(this.commonValueControl, 'columnClick', this.commonValueColumnSelectionChange);
		
		
		// check if the save filter and filter category controls should be visible
		if(this.defaultConfig.mode && this.defaultConfig.filterCategories.length) {
			for(var i in this.defaultConfig.filterCategories) {
				this.addCategory(this.defaultConfig.filterCategories[i]);
			}
		}
		
		// handle when filterSelectionType is passed with a value other than FILTER_SELECTION_TYPES.DEFAULT
		if(this.filterSelectionType != this.FILTER_SELECTION_TYPES.DEFAULT) {
			//call function as if the click event was triggered
			this.filterSelectionTypeChange(this.filterSelectionType);
		} else {
			// hide commonValueControl
			this.commonValueControl.hide();
		}
		
		// TODO also check if filter selection type is DEFAULT
		if(_.isString(this.defaultConfig.showFirst)) {
			var dfDdLi = $('ul.cf-columns-select-dd li a[data-name="'+this.defaultConfig.showFirst+'"]',this.$el);
			if(dfDdLi.length) {
				this.changeFilterFactoryType(dfDdLi.first().data('type'),dfDdLi.first().data('name'),dfDdLi.first().html());
			}
		}
		
	},
	render:function() {
		
		return this;
	}
});
