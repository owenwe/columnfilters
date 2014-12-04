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
	'FILTER_SELECTION_TYPES':{ 'DEFAULT':0, 'COMMON_VALUE':1 },
	
	// Enum of the different interactive modes this control can be put into
	// the dataFiltersControl (DataFiltersControlBar/VDataFiltersControlBar) has a copy of this
	'MODES':{ 'DEFAULT':0, 'CATEGORY_SETS':1 },
	
	'defaultConfig':{
		'mode':0,
		'table':'undefined',
		'showFirst':null,
		'filterSelectionType':0,
		'filters':false,
		'filterCategories':[],
		'convertBooleanToNumeric':true
	},
	'mode':0,					// setting the mode to 1 enables the saving filter sets and filter set groups
	'table':'undefined',		// the name of the database table or virtual source
	'filterSelectionType':0,	// the type of filter selection to display
	'filters':null,				// a collection of MDataFilter
	'filterCategories':[],		// array of names
	'convertBooleanToNumeric':true,
	
	//the modal for add/edit filter sets
	// TODO this should be moved to VDataFiltersControlBar
	'modal':null,
	
	//cid of the model in the filters collection during an edit
	'editFilterCid':null,
	
	//used to keep track of filters displayed in the dataFiltersContainer
	'currentColumnFilter':{'table':null,'type':null,'column':null,'label':null},
	
	//used to restore after a save/cancel (filter edit)
	'previousColumnFilter':{'type':null, 'column':null, 'label':null},
	
	//used to keep track of the filter control nav bar dropdowns
	'preEditFilterControlStates':[],
	
	'commonValueControl':null,		//multi-column value filter control
	'filterFactory':null,			//all filter widgets
	'dataFiltersContainer':null,	//panel body view
	'dataFiltersControl':null,		//panel footer
	
	// Notification system:
	// Will be a warning or danger alert overlay in the filters container. The alert will fade out after about
	// 1 second unless the user hovers over (TODO implement touch system method)
	// the user will have to mouse out of the alert div in order to start the hide timer again.
	'notification':{
		'timeoutID':null,
		'displayDelay':1777,//1777
		'templates':{
			'warning':_.template([
				'<div class="alert alert-warning alert-dismissable cf-notification fade in" role="alert">',
					'<button type="button" class="close" data-dismiss="alert">',
						'<span aria-hidden="true">&times;</span>',
						'<span class="sr-only">Close</span>',
					'</button>',
					'<h4><%= notification.title %></h4>',
					'<p><%= notification.message %></p>',
				'</div>'
			].join(''), {'variable':'notification'}),
			'danger':_.template([
				'<div class="alert alert-danger alert-dismissable cf-notification fade in" role="alert">',
					'<button type="button" class="close" data-dismiss="alert">',
						'<span aria-hidden="true">&times;</span>',
						'<span class="sr-only">Close</span>',
					'</button>',
					'<h4><%= notification.title %></h4>',
					'<p><%= notification.message %></p>',
				'</div>'
			].join(''), {'variable':'notification'})
		}
	},
	'notify':function(level, title, message) {
		// put an alert div in the filters container and set the width so we can 
		// center it with it being fixed position
		var newAlertDiv = $(this.notification.templates[level==='danger'?'danger':'warning']({'title':title, 'message':message}))
			.css({'width':$('.cf-data-filters-container').width()+'px'}),
			dfContext = this;
		//this.listenTo(newAlertDiv, 'mouseover', dfContext.quitHideNotifyTimer);
		//newAlertDiv.on('mouseover', function() { dfContext.quitHideNotifyTimer });
		newAlertDiv.hover(
			function() { dfContext.quitHideNotifyTimer(); },
			function() {
				dfContext.notification.timeoutID = setTimeout( function(){ dfContext.hideNotification(); }, dfContext.notification.displayDelay);
			}
		);
		//this.listenTo(newAlertDiv, 'mouseout', function() { setTimeout( function(){ dfContext.hideNotification(); }, dfContext.notification.displayDelay) });
		this.dataFiltersContainer.$el.prepend(newAlertDiv);
		
		// set the alert div to fade out after displayDelay milliseconds (use the DataFilters context)
		this.notification.timeoutID = setTimeout( function(){ dfContext.hideNotification(); }, dfContext.notification.displayDelay);
		
	},
	'hideNotification':function() {
		// this is executed in Window context
		$('div.cf-notification',this.dataFiltersContainer.$el).alert('close');
	},
	'quitHideNotifyTimer':function(e) {
		clearTimeout(this.notification.timeoutID);
	},
	
	// called from the event when the filter selection type radio set is changed
	'filterSelectionTypeChange':function(newSelectionType) {
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
	'commonValueColumnSelectionChange':function(columnData) {
		//console.log(this.commonValueControl.selectedCount);
		if(this.commonValueControl.selectedCount) {// columns are selected
			//tell the filter factory to show this data type (if it isn't already)
			var af = this.filterFactory.activeFilter();
			if(af && af.type === columnData.type) {
				// type is the same, so just update the column
				this.currentColumnFilter.label = columnData.label;
				this.currentColumnFilter.column =_.map(this.commonValueControl.selectedColumns, function(c) { return c.attributes.name; });
				this.filterFactory.updateMultiColumnFilter(this.currentColumnFilter.column);
			} else {
				// type is not the same, change the type
				this.changeFilterFactoryType(columnData.type,columnData.name,columnData.label);
			}
		} else {//no more columns are selected
			//tell filter factorty to hide the active filter (if one is visible)
			var af = this.filterFactory.activeFilter();
			if(af) {
				af.hide();
				this.currentColumnFilter.type = null;
				this.currentColumnFilter.column = [];
				this.currentColumnFilter.label = null;
			}
		}
	},
	
	// changes the filter factory widget to the given type
	// column could be a string or an array
	'changeFilterFactoryType':function(type,column,label,subType) {
		this.currentColumnFilter = {
			'table':this.table,
			'type':type,
			'column':column,
			'label':label
		};
		this.filterFactory.load(this.currentColumnFilter.column, this.currentColumnFilter.type, _.isArray(column)?'multi-column':this.currentColumnFilter.label, subType);
	},
	
	// show the save/cancel edit button group and disable everything but it and the filter factory
	'editFilterMode':function() {
		// show cancel and save filter button
		$('button.cf-edit-filter-button', this.$el).show();
		$('button.cf-cancel-edit-filter-button', this.$el).show();
		
		//	hide add filter/change column button
		$('.cf-add-change-filter-group-button button',this.$el).hide();
		
		//disable data filter type button group
		$('.cf-data-filter-type-selection label').addClass('disabled');
		$('.cf-data-filter-type-selection input').attr('disabled','disabled');
		
		//disable the common value control
		this.commonValueControl.disable();
		
		//save the filter factory state
		this.filterFactory.saveState();
		this.previousColumnFilter.type = this.currentColumnFilter.type;
		this.previousColumnFilter.column = this.currentColumnFilter.column;
		this.previousColumnFilter.label = this.currentColumnFilter.label;
		
		//	disable filter container
		this.dataFiltersContainer.disable();
		
		//disable the filter control nav bar
		if(this.mode === this.MODES.CATEGORY_SETS) {
			this.dataFiltersControl.disable();
		}
		
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
	'cancelEditFilterMode':function() {
		$('button.cf-edit-filter-button', this.$el).hide();
		$('button.cf-cancel-edit-filter-button', this.$el).hide();
		$('.cf-add-change-filter-group-button button',this.$el).show();
		$('.cf-data-filter-type-selection label').removeClass('disabled');
		$('.cf-data-filter-type-selection input').removeAttr('disabled');
		//enable common value control
		this.commonValueControl.enable();
		
		this.filterFactory.restoreState();
		if(this.previousColumnFilter) {
			this.currentColumnFilter.type = this.previousColumnFilter.type;
			this.currentColumnFilter.column = this.previousColumnFilter.column;
			this.currentColumnFilter.label = this.previousColumnFilter.label;
		}
		
		this.dataFiltersContainer.enable();
		for(var i in this.preEditFilterControlStates) {
			var preFilterState = this.preEditFilterControlStates[i];
			if(!preFilterState.hasDisabledClass) {
				preFilterState.listItem.removeClass('disabled');
			}
		}
		
		//disable the filter control nav bar
		if(this.mode === this.MODES.CATEGORY_SETS) {
			this.dataFiltersControl.enable();
		}
	},
	
	// PUBLIC Functions
	// returns filters as an object, or false if there aren't filters to return
	'getCurrentFilter':function() {
		return this.filters.length ? this.filters.toJSON() : false ;
		
		// Do we need to check for what mode it is set to?
		//if(this.mode == this.MODES.DEFAULT) {} else {}
	},
	
	'tagName':'div',
	'className':'panel panel-default',
	
	'events':{
		
		// DATA FILTER TYPE CHANGE
		// triggered when the filter type (default/common value) is changed
		'change .btn-group.cf-data-filter-type-selection input':function(e) {
			var eVal = e.currentTarget.value*1;
			this.filterSelectionTypeChange(eVal);
		},
		
		
		// COLUMN FILTER CHANGE
		// triggered when a column list item is clicked in the columns dropdown menu
		// is to load the data info from the clicked event into the filter factory
		'click ul.cf-columns-select-dd li a':function(e) {
			this.changeFilterFactoryType($(e.currentTarget).data('type'),$(e.currentTarget).data('name'),$(e.currentTarget).html());
		},
		
		// ADD FILTER CLICK
		// triggered when the 'add filter' button is clicked
		// should first call validate on the active filter type
		'click button.cf-add-filter-button':function(e) {
			var af = this.filterFactory.activeFilter(),
				fVal = af?this.filterFactory.getFilterValue():false;
			
			// check if we are in COMMON_VALUE mode
			// if it is, then check if more than 1 column has been selected
			if(this.filterSelectionType && this.currentColumnFilter.column.length<2) {
				alert('Multiple columns are required for a common value, otherwise just use a regular data filter.');
				return false;
			}
			
			if(fVal) {
				
				// enable save filter dropdown
				if(this.mode === this.MODES.CATEGORY_SETS) {
					if($('li.cf-save-filter-list', this.dataFiltersControl).hasClass('disabled')) {
						$('li.cf-save-filter-list', this.dataFiltersControl).removeClass('disabled');
					}
				}
				
				// create new data filter
				// MDataFilter is the same thing as a standard Modal (it doesn't define anything specific)
				var ndf = new MDataFilter({
					'table':this.table,
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
		
		// SAVE EDIT FILTER CLICK
		// triggered when a filter is in edit mode and the 'save' button is clicked
		'click button.cf-edit-filter-button':function(e) {
			//get filter value from filterFactory and apply it to the filter in the collection
			//this should update the dataFiltersContainer view
			var fVal = this.filterFactory.getFilterValue();
			if(fVal) {
				this.cancelEditFilterMode();
				var f = this.filters.get(this.editFilterCid);
				f.set({'filterValue':fVal});
			}
		},
		
		// CANCEL EDIT FILTER CLICK
		// triggered when the cancel button has been clicked (when editing a filter)
		'click button.cf-cancel-edit-filter-button':function(e) {
			this.cancelEditFilterMode();
		}
	},
	
	
	'initialize':function(options) {
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
		// for the boolean filter widget
		if(_.has(options, 'convertBooleanToNumeric') && !options.convertBooleanToNumeric) {
			this.convertBooleanToNumeric = false;
		}
		
		
		// validTableColumns will populate the dropdown list of columns and the common value control
		var validTableColumns = [];
		if(options.hasOwnProperty('tableColumns') && _.isArray(options.tableColumns) && options.tableColumns.length) {
			/*assert tableColumns is an array of objects:
			--- DataTables properties ---
			'data':string, 
			'name':string, 
			'title':string, 
			'type':string, 
			'visible':boolean,
			'render':function,
			
			--- ColumnFilters properties ---
			'cfexclude':boolean,
			'cftype':string,
			'cfenumsource':array,
			'cfenumvaluekey':string // TODO implement
			'cfenumlabelkey':string
			*/
			for(var i in options.tableColumns) {
				var tc = options.tableColumns[i];
				if(_.isObject(tc) && (_.has(tc,'name') && _.has(tc,'type') && _.has(tc,'title'))) {
					// look for excluded data
					var excluded = false;
					if(_.has(tc,'cfexclude') && _.isBoolean(tc.cfexclude)) {
						excluded = tc.cfexclude;
					}
					if(!excluded) {
						// add extra properties for the common value control
						var mappedCol = {
							'label':tc.title,
							'type':tc.cftype,
							'name':tc.name
						};
						if(tc.cftype==='enum') {
							_.extend(mappedCol, {'cfenumsource':tc.cfenumsource});
						}
						if(tc.cftype==='biglist') {
							// then datasource, displayKey, valueKey MUST exists
							_.extend(mappedCol, {
								'table':tc.table,
								'dataColumn':tc.data,
								'datasource':tc.datasource,
								'displayKey':tc.displayKey,
								'valueKey':tc.valueKey
							});
						}
						if(_.has(tc,'cfexclude')) {
							_.extend(mappedCol, {'cfexclude':tc.cfexclude});
						}
						if(_.has(tc,'cfenumlabelkey')) {
							_.extend(mappedCol, {'cfenumlabelkey':tc.cfenumlabelkey});
						}
						_.extend(mappedCol,{'selected':false});
						validTableColumns.push(mappedCol);
					}
				}
			}
		}
		
		// TODO implement a way to override and add filter widget types and sub-types
		// Create and Populate the filter factory
		this.filterFactory = new VDataFilterFactory({'showOnInit':this.defaultConfig.showOnInit, 'collection':new Backbone.Collection(
			[
				new VDataColumnFilterWidget({'type':'text', 'collection':new Backbone.Collection([
					new VFilterWidgetTypeTextEq(),
					new VFilterWidgetTypeTextSrch()
				])}),
				new VDataColumnFilterWidget({'type':'number', 'collection':new Backbone.Collection([
					new VFilterWidgetTypeNumberEq(),
					new VFilterWidgetTypeNumberBtwn(),
					new VFilterWidgetTypeNumberSel()
					
				])}),
				new VDataColumnFilterWidget({'type':'date', 'collection':new Backbone.Collection([
					new VFilterWidgetTypeDateEq(),
					new VFilterWidgetTypeDateBtwn(),
					new VFilterWidgetTypeDateSel(),
					new VFilterWidgetTypeDateCycle()
					
				])}),
				new VDataColumnFilterWidget({'type':'boolean', 'collection':new Backbone.Collection([
					new VFilterWidgetTypeBoolEq({'convertNumeric':this.convertBooleanToNumeric})
				])}),
				new VDataColumnFilterWidget({'type':'enum', 'collection':new Backbone.Collection([
					new VFilterWidgetTypeEnumIn({'enums':_.where(validTableColumns, {'type':'enum'})})
				])}),
				new VDataColumnFilterWidget({'type':'biglist', 'collection':new Backbone.Collection([
					new VFilterWidgetTypeBiglistEq({'datasets':_.where(validTableColumns, {'type':'biglist'})})
				])})
			]
		)});
		
		// There will always be a user (or default) filter
		// should pull all table filters/column filters for this user + common and public
		this.dataFiltersContainer = new VDataFiltersContainer({'filtersController':this});
		
		// filters control; toolbar for saving groups of filters
		this.dataFiltersControl = new VDataFiltersControlBar({
			'filtersController':this,
			'mode':this.defaultConfig.mode,
			'filterCategories':this.defaultConfig.filterCategories,
			'table':this.table,
			'user_id':181
		});
		
		// constructing the View elements (Heading:Filter Tools, Body:Filters, Footer:Save Controls)
		this.$el.append(
			_.template(CFTEMPLATES.dataFiltersPanelContent,{variable:'panelheading'})({'filterColumns':validTableColumns}),
			this.dataFiltersContainer.el,
			this.dataFiltersControl.el
		);
		
		// hack to get Backbone objects to update their 'this' references
		this.filterFactory.postConfig();
		
		//add UI components and set initial display states for UI
		this.commonValueControl = new VCommonValueFilterControl({'columns':validTableColumns});
		$('div.cf-common-value-controller-replace',this.$el).replaceWith(this.commonValueControl.$el);
		$('.cf-filter-factory-container-row',this.$el).append(this.filterFactory.el);
		$('button.cf-edit-filter-button', this.$el).hide();
		$('button.cf-cancel-edit-filter-button', this.$el).hide();
		
		
		// EVENT HANDLERS
		// event handler when a filter is added
		this.filters.on('add', function(filter) {
			this.dataFiltersContainer.add(filter);
			if(this.mode===this.MODES.CATEGORY_SETS) {
				this.dataFiltersControl.refreshClearFiltersButton();
			}
		}, this);
		
		this.filters.on('remove', function(filter) {
			if(this.filters.length<1) {
				// disable the add filter dropdown
				$('li.cf-save-filter-list', this.dataFiltersControl).addClass('disabled');
			}
			if(this.mode===this.MODES.CATEGORY_SETS) {
				this.dataFiltersControl.refreshClearFiltersButton();
			}
		}, this);
		
		// when the remove button from a filter in the filter container view is clicked
		this.listenTo(this.dataFiltersContainer,'removeClick', function(filterCid) {
			this.filters.remove(this.filters.get(filterCid));
		});
		
		// upstream handler when a filter item edit click event
		// puts the sets the filter factory to the correct filter type and initializes with filter value
		this.listenTo(this.dataFiltersContainer,'changeClick', function(filterCid) {
			this.editFilterCid = filterCid;
			this.editFilterMode();
			
			var f = this.filters.get(this.editFilterCid).attributes;
			this.changeFilterFactoryType(f.type,f.column,f.label,f.filterValue.type);
			this.filterFactory.setFilterValue(f);
		});
		
		// upstream handler when a common value column is clicked
		this.listenTo(this.commonValueControl, 'columnClick', this.commonValueColumnSelectionChange);
		
		// upstream handler when a clear filters event is triggered
		// newSet is either empty or a filterSet clone
		this.listenTo(this.dataFiltersControl, 'resetFilters', function(newSet) {
			if(newSet) {
				var newFiltersArray = [];
				for(var i in newSet.attributes.filters) {
					var newFilters = newSet.attributes.filters[i];
					var f = new MDataFilter({
						'table':newFilters.attributes.table,
						'type':newFilters.attributes.type,
						'column':newFilters.attributes.column,
						'label':newFilters.attributes.label,
						'filterValue':$.extend(true, {}, newFilters.attributes.filterValue)
					});
					
					// listen for change event on the model
					f.on('change:filterValue', function(filter) {
						//need to update filter tab content list item
						this.dataFiltersContainer.updateFilter(filter);
					}, this);
					
					newFiltersArray.push(f);
				}
				this.filters.reset(newFiltersArray);
			} else {
				this.filters.reset();
			}
			
			//this.filters.reset(newSet);
		});
		
		// notification events (level,title,message)
		this.listenTo(this.filterFactory, 'notify', this.notify);
		this.listenTo(this.dataFiltersControl, 'notify', this.notify);
		
		
		// handle when filterSelectionType is passed with a value other than FILTER_SELECTION_TYPES.DEFAULT
		if(this.filterSelectionType != this.FILTER_SELECTION_TYPES.DEFAULT) {
			//call function as if the click event was triggered
			this.filterSelectionTypeChange(this.filterSelectionType);
		} else {
			// default to single filter type, hide commonValueControl
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
	
	'render':function() { return this; }
});
