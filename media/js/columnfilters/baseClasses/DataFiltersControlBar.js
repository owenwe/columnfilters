/*
The view controller for saving/loading/removing filter sets
This view will have a collection that makes use of a properly structured JSON Object, 
LocalStorage, Backbone.Collection with AJAX backend to a DB

Filter Category Structure
{
	name:	<string>	short-form label (under 45 characters)
	sets:	<array>		a collection of filter sets // TODO 
}

Filter Set Structure
[
	{
		id:				<integer>	unique identifier (usually a database auto increment sequence)
		name:			<string>	short-form label (under 45 characters)
		category:		<string>	name of the category that this set belongs
		table:			<string>	the database table (or parent-level object) name
		description:	<string>	long-form description of category
		filters:		<array>		a collection of filter objects
	},...

this.collection({model:Filter Set})

There is also a local version of the internal collection
*/
var VDataFiltersControlBar = Backbone.View.extend({
	
	// Enum of the different interactive modes this control can be put into
	'MODES':{ 'DEFAULT':0, 'CATEGORY_SETS':1, 'NO_TYPES':2, 'CATEGORIES_NO_TYPES':3 },
	
	// 
	'isLocalStorage':false,
	
	// the parent controller view that has a 'filters' collection
	'filtersController':null,
	'modal':null,// form modal for inputting category/filter set names and descriptions
	
	// these are passed from the parent controller and are attached to each filter set
	// for use in storing them  in a database per user
	'table':null,
	
	'categories':null,			// a collection of category names
	'currentFilterSetCid':null,	// should be the cid of the category in the categories collection
	'editMode':false,			// set to true when editing a filter set
	
	// for rendering components of this view
	'templates':{
		
		'filterCategorySaveItem':_.template([
			'<li data-save-type="<%= filterCategory.name %>">',
				'<a href="#">',
					'<span class="badge pull-right">',
						'<span class="glyphicon <%= filterCategory.glyph %>"></span>',
					'</span> to <%= filterCategory.name %>',
				'</a>',
			'</li>'
			].join(''),
		{'variable':'filterCategory'}),
		
		'filterCategoryMenu':_.template([
			'<ul class="nav navbar-nav" data-category-name="<%= filterCategory.name %>">',
				'<li class="dropup btn btn-xs disabled">',
					'<a href="#" class="dropdown-toggle btn btn-xs" data-toggle="dropdown"><%= filterCategory.name %> ',
						'<span class="badge"></span>',
						'<span class="caret"></span>',
					'</a>',
					'<ul class="dropdown-menu list-group cf-filter-category-menu-list" role="menu"></ul>',
				'</li>',
			'</ul>'
			].join(''),
		{'variable':'filterCategory'}),
		
		'filterSetMenuItem':_.template([
			'<li class="list-group-item" data-id="<%= filterSet.cid %>">',
				'<button type="button" class="close" title="edit this filter set" data-type="edit" data-id="<%= filterSet.cid %>">',
					'<span class="glyphicon glyphicon-cog btn-sm"></span>',
				'</button>',
				'<button type="button" class="close" title="delete this filter set" data-type="remove" data-id="<%= filterSet.cid %>">',
					'<span class="glyphicon glyphicon-remove btn-sm"></span>',
				'</button>',
				'<h4 class="list-group-item-heading" title="load filters from this set">',
					'<a href="#" data-id="<%= filterSet.cid %>"><%= filterSet.get("name") %></a>',
				'</h4>',
				'<p class="list-group-item-text"><%= filterSet.get("description") %></p>',
			'</li>'
		].join(''),
		{'variable':'filterSet'}),
		
		'saveFilterSetModalForm':_.template([
			'<form class="form-horizontal" role="form" data-category="">',
				'<div class="form-group">',
					'<label for="cfFilterSetSaveName" class="col-sm-2 control-label">Name</label>',
					'<div class="col-sm-10">',
						'<input type="text" class="form-control" id="cfFilterSetSaveName" placeholder="Name for this set of filters" autocomplete="off">',
					'</div>',
				'</div>',
				'<div class="form-group cf-form-filter-set-desc">',
					'<label for="cfFilterSetSaveDescription" class="col-sm-2 control-label">Description</label>',
					'<div class="col-sm-10">',
						'<textarea class="form-control" rows="3" id="cfFilterSetSaveDescription" autocomplete="off"></textarea>',
					'</div>',
				'</div>',
			'</form>'
		].join(''))
	},
	
	'navbar':null,				// the main navbar control for this view
	'saveDropdown':null,		// the dropdown menu for saving filter sets or creating a new category
	'cancelButton':null,		// cancel button displayed when editing a filter set
	'saveButton':null,			// action button displayed when editing a filter set
	'clearFiltersButton':null,	// button for triggering a 'clearFilters' event up-stream to clear the filters container view
	
	'enable':function() {
		this.saveButton.removeClass('disabled')[0].disabled = false;
		this.refreshClearFiltersButton();
		if(!this.editMode) {
			$('ul.navbar-nav',this.navbar).each(function(i,navUl) {
				if($('li.dropup ul.dropdown-menu li',$(navUl)).length) {
					$('li.dropup',$(navUl)).removeClass('disabled');
				}
			});
		}
	},
	'disable':function() {
		this.saveButton.addClass('disabled')[0].disabled = true;
		this.clearFiltersButton.addClass('disabled')[0].disabled = true;
		$('ul.navbar-nav li.dropup',this.navbar).addClass('disabled');
	},
	
	/**
	 * This will enable/disable the "clear filters" button (the "x" button next to the "save to"
	 * menu drop up) based on the number of existing filters. If less than 1 then disable
	*/
	'refreshClearFiltersButton':function() {
		this.clearFiltersButton.toggleClass('disabled', this.filtersController.filters.length<1);//was <1
		this.clearFiltersButton[0].disabled = this.filtersController.filters.length?false:true;
	},
	
	// 
	'filterCategoryGlyphMapping':function(catName) {
		var retVal = 'glyphicon-cloud-upload';
		switch(catName) {
			case 'User':
			case 'user':
				retVal = 'glyphicon-user';
				break;
		}
		return retVal;
	},
	
	/**
	 * This will add a menu list item to the save category dropdown menu. It will 
	 * also add a list item to the category dropdown menu for the FilterSet, and 
	 * create the category dropdown menu if needed.
	 * This function does NOT add a FilterSet to the collection.
	 */
	'addFilterSet':function(filterSet) {
		//console.log('adding filter set');
		//console.log(filterSet);
		
		// check if the filter set category exists; add it if it doesn't
		if(this.categories.where({'name':filterSet.get('category')}).length<1) {
			//console.log('adding filter category: '+filterSet.get('category'));
			this.addCategory(filterSet.get('category'));
		}
		
		// adds a dropdown menu item to the category dropdown menu on the nav bar
		// removes the disabled state of the category dropdown menu
		// updates the category dropdown menu label to include the number of filter sets
		var fcMenuDropdown = $('ul.navbar-nav[data-category-name="'+filterSet.get('category')+'"]',this.navbar),
			newFilterSet = this.templates['filterSetMenuItem'](filterSet);
		
		//add filter set menu item
		$('ul.cf-filter-category-menu-list', fcMenuDropdown).append(newFilterSet);
		$('li.dropup',fcMenuDropdown).removeClass('disabled');
		$('li.dropup span.badge',fcMenuDropdown).html(this.collection.where({'category':filterSet.get('category')}).length);
	},
	
	// makes sure there are no duplicates and then adds a menu dropup to the footer control
	// and a dropup link to the save filters menu
	'addCategory':function(categoryName) {
		//console.log('addCategory('+categoryName+')');
		//console.log(this.collection);
		//console.log(this.categories);
		// if a category menu with the same name doesn't already exist
		if(this.categories.where({'category':categoryName}).length<1) {
			// add category name to the categories collection
			this.categories.add({'name':categoryName});
			
			// add a category menu dropup to the footer control nav bar
			this.navbar.append( this.templates.filterCategoryMenu({'name':categoryName}) );
			
			// add a divider inbetween each category list item in the save menu (after the first)
			if(this.collection.length) {
				this.saveDropdown.append( $(document.createElement('li')).addClass('divider') );
			}
			
			// add list item to the save menu dropup
			this.saveDropdown.append(
				this.templates.filterCategorySaveItem({
					'name':categoryName,
					'glyph':this.filterCategoryGlyphMapping(categoryName)
				})
			);
		}
	},
	
	// configure modal and show
	'modalConfigAndShow':function(isNewCategory) {
		var mTitle = isNewCategory?'Create New Category':'Save to Filter Set',
			mSaveType = isNewCategory?'category':'set',
			mBtnLabel = isNewCategory?'Create':'Save',
			saveBtn = $('div.modal-footer button:last-child',this.modal);
		
		$('form', this.modal)[0].reset();
		saveBtn.data('save-type',mSaveType);
		saveBtn.html(mBtnLabel);
		$('h4.modal-title',this.modal).html(mTitle);
		$('div.cf-form-filter-set-desc',this.modal).toggle(!isNewCategory);
		this.modal.modal('show');
	},
	
	/**
	 * Resets the filtersController.filters collection with the filters retrieved 
	 * from this.collection by using the filterSetId argument and then triggers 
	 * the resetFilters event for the DataFilters parent controller to handle.
	 */
	'loadFilters':function(filterSetId) {
		//console.log(filterSetId);
		var clonedFilterSet = this.collection.get(filterSetId).clone(),
			clonedFilterSetObject = $.extend(true,{},clonedFilterSet.attributes),// this should've made a deep copy and converted the model to an object
			deepCopyFilterArray = [];
		// the filters might be an array of javascript objects or models
		for(var i in clonedFilterSetObject.filters) {//loop through each filter
			var fsFilter = clonedFilterSetObject.filters[i],
				isModel = _.has(fsFilter,'attributes'),
				f = new MDataFilter();
			f.set({
				'table'			: isModel ? fsFilter.get('table') : fsFilter.table,
				'type'			: isModel ? fsFilter.get('type') : fsFilter.type,
				'column'		: isModel ? fsFilter.get('column') : fsFilter.column,
				'label'			: isModel ? fsFilter.get('label') : fsFilter.label,
				'filterValue'	: $.extend(true, {}, isModel ? fsFilter.get('filterValue') : fsFilter.filterValue)
			});
			
			// listen for change event on the model and update the text labels in the filter container
			f.on('change:filterValue', function(filter) {
				//need to update filter tab content list item
				this.trigger('updateFilter',filter);
				//this.filtersController.dataFiltersContainer.updateFilter(filter);
			}, this);
			
			deepCopyFilterArray.push( f );
		}
		//console.log(deepCopyFilterArray);
		// the resetFilters event should pass a deep-copy clone collection of filters
		this.trigger( 'resetFilters', deepCopyFilterArray );
	},
	
	
	'events':{
		// NEW FILTER CATEGORY CLICK
		// triggered when the "create new" filter list item in the save filter set menu is clicked
		// or the "save to ..." menu item in the save filter set is clicked
		'click li.cf-save-filter-list ul.dropdown-menu li':function(e) {
			// are there any filters to save ?
			var dataSaveType = $(e.currentTarget).data('save-type'),
				isCreatingNewCategory = (dataSaveType==='__new_category__');
			
			if(isCreatingNewCategory) {
				this.modalConfigAndShow(isCreatingNewCategory);
			} else {
				// creating a new filter set put category name in the form data-category attribute
				$('form',this.modal).data('category',dataSaveType);
				if(this.filtersController.filters.length) {
					this.modalConfigAndShow(isCreatingNewCategory);
				} else {
					this.trigger('notify', 'danger', 'No filters to save', 'There must be some filters to save.');
				}
			}
		},
		
		// CLEAR FILTERS CLICK
		// triggered when the clear filters button is clicked
		'click button.cf-clear-all-filters-button':function(e) {
			this.trigger('resetFilters');
		},
		
		// DONE EDITING FILTER SET CLICK
		// triggered when the "Done" button in the nav bar has been clicked
		'click button.cf-save-filter-set-changes-button':function(e) {
			// check if there are any filters to save
			if(this.filtersController.filters.length) {
				// put all existing filters (filtersController.filters) into the filters attribute of this collection model
				this.collection.get(this.currentFilterSetCid).attributes.filters = this.filtersController.filters.clone().toJSON();
				
				// enable category menus and save menu
				$('ul.navbar-nav li.dropup',this.navbar).addClass('disabled');
				
				// hide editing buttons and set the mode back to normal
				this.saveButton.hide();
				this.cancelButton.hide();
				this.editMode = false;
				this.refreshClearFiltersButton();
				
				// update the collection filter set model
				this.collection.sync('update', this.collection.get(this.currentFilterSetCid), {
					'context':this,
					'success':function(data, textStatus, jqXHR){
						this.enable();
				}});
				
			} else {
				this.trigger(
					'notify', 
					'danger', 
					'No filters to save to filter group', 
					['There are no filters to save, if your intent is to remove this filter group, ',
					'click the remove button (next to the edit button) on the filter group in the category menulist.'].join('')
				);
			}
		},
		
		// CANCEL EDIT FILTER SET CLICK
		// triggered when the "Cancel" button in the nav bar has been clicked
		'click button.cf-cancel-filter-set-changes-button':function(e) {
			// restore filters in the filter set
			this.loadFilters(this.currentFilterSetCid);
			
			// restore navbar controls
			//check menus for list items, only enable if there are some
			$('ul.navbar-nav',this.navbar).each(function(i,navUl) {
				if($('li.dropup ul.dropdown-menu li',$(navUl)).length) {
					$('li.dropup',$(navUl)).removeClass('disabled');
				}
			});
			this.saveButton.hide();
			this.cancelButton.hide();
			this.editMode = false;
			this.refreshClearFiltersButton();
		},
		
		// LOAD FILTER SET CLICK
		// when the link in the category menu item is clicked
		'click ul.cf-filter-category-menu-list li h4 a':function(e) {
			var fsId = $(e.currentTarget).data('id');
			this.loadFilters($(e.currentTarget).data('id'));
			this.refreshClearFiltersButton();
		},
		
		// EDIT FILTER SET CLICK
		// triggered when the edit button is clicked in a filter set menu item
		'click ul.navbar-nav li.dropup ul.cf-filter-category-menu-list button[data-type="edit"]':function(e) {
			this.editMode = true;
			
			// store the selected filter set in currentFilterSetCid variable
			this.currentFilterSetCid = $(e.currentTarget).data('id');
			
			// load filters from the selected filter set
			this.loadFilters(this.currentFilterSetCid);
			
			// show the "done editing" button
			this.saveButton.show();
			this.cancelButton.show();
			// disable category menus and save menu
			$('ul.navbar-nav li.dropup',this.navbar).addClass('disabled');
		},
		
		// REMOVE FILTER SET CLICK
		// triggered when the remove button is clicked in a filter set menu item
		'click ul.navbar-nav li.dropup ul.cf-filter-category-menu-list button[data-type="remove"]':function(e) {
			if(confirm('Are you sure you want to remove this Filter Set?')) {
				this.collection.remove( this.collection.get($(e.currentTarget).data('id')) );
			}
		},
		
		// MODAL ACTION BUTTON CLICK
		// triggered when the 'save' button in the modal is clicked (new category or set)
		'click div.modal div.modal-footer button:last-child':function(e) {
			var saveType = $(e.currentTarget).data('save-type'),
				fsName = $.trim($('input#cfFilterSetSaveName',this.modal).val()),
				valid = (fsName.length>0);
			
			if(valid) {
				if(saveType==='set') {
					var category = $('form',this.modal).data('category'),
						fsDesc = $.trim($('textarea#cfFilterSetSaveDescription',this.modal).val());
					//create new filter set with all the filters
					// send filters as javascript objects (not models)
					//console.log('creating new category');
					
					// I think this works for remote and local
					/**/
					this.collection.create({
						'category':category,
						'table':this.table,
						'name':fsName,
						'description':fsDesc.length?fsDesc:null,
						'filters':this.filtersController.filters.clone().toJSON()
					});
					
					// This works for remote and local storage
					/*
					this.collection.add(
						new MDataFilter({
							'category':category,
							'table':this.table,
							'name':fsName,
							'description':fsDesc.length?fsDesc:null,
							'filters':this.filtersController.filters.clone().models
						})
					);
					*/
				} else {
					//adding a new category
					this.addCategory(fsName);
				}
				
				//close the modal
				this.modal.modal('hide');
			} else {
				alert('The name input can not be empty.');
			}
		}
	},
	
	'tagName':'nav',
	'className':'navbar navbar-default cf-datafilters-controller-footer',
	
	'initialize':function(options) {
		// ASSERTION: these will always be passed
		// url
		// filtersController
		// mode
		// filterCategories
		// table
		
		// add role=navigation attribute to root dom element
		this.$el.attr('role','navigation');
		// if the CATEGORY_SETS mode was passed into the constructor then 
		if(options.mode===options.filtersController.__proto__.MODES.CATEGORY_SETS || options.mode===options.filtersController.__proto__.MODES.CATEGORIES_NO_TYPES) {
			
			// the parent DataFilters View controller
			this.filtersController = options.filtersController;
			
			// set the table property (there should only be 1 table per column filters controller)
			this.table = options.table;
			
			// just a collection of names
			this.categories = new Backbone.Collection();
			
			this.editMode = false;
			
			// the collection of filter sets, where we can pluck the categories from the category property of each set
			if(options.url) {
				this.collection = new CDataFilterSets();
				this.collection.url = options.url;
			} else {
				this.collection = new CDataFilterSetsLocal();
				this.isLocalStorage = true;
			}
			
			// create the DOM elements
			this.$el.append(
				_.template(
					CFTEMPLATES.dataFiltersControlFooter,
					{variable:'controller'}
				)({'filterCategories':options.filterCategories}));
			
			// set the navbar property
			this.navbar = $('div.collapse.navbar-collapse',this.$el);
			
			// set the saveDropdown and cancelButton properties
			this.saveDropdown = $('ul.navbar-right li.cf-save-filter-list ul.dropdown-menu',this.navbar);
			this.cancelButton = $('button.cf-cancel-filter-set-changes-button',this.navbar).hide();
			
			// set the saveButton and clearFiltersButton properties and disable
			// the clearFiltersButton since there won't be any filters to begin with
			this.saveButton = $('button.cf-save-filter-set-changes-button',this.navbar).hide();
			this.clearFiltersButton = $('button.cf-clear-all-filters-button',this.navbar);
			this.clearFiltersButton[0].disabled = true;
			
			// re-usable modal
			this.modal = $('div.modal',this.$el);
			$('div.modal-body', this.modal).html(this.templates.saveFilterSetModalForm({}));
			this.modal.modal({
				'backdrop':'static',
				'keyboard':false,
				'show':false
			});
			
			// if there were filter categories passed in then add the menu items for each one
			if(options.filterCategories.length) {
				for(var i in options.filterCategories) {
					//a category is just a small string
					this.addCategory(options.filterCategories[i]);
				}
			}
			
			// EVENT LISTENERS
			
			// add filter set
			this.collection.on('add', function(filterSet) {
				//console.log('data filter collection add');
				//console.log(filterSet);
				// add filterset to ui nav bar and add sync listeners
				this.addFilterSet(filterSet);
			}, this);
			
			// remove filter set
			this.collection.on('remove', function(filterSet) {
				// check for filter set category
				if(filterSet.attributes.category) {
					// remove list item from category dropdown menu
					// disable filer category dropdown menu if no more filter sets exists in that category
					var fcMenuDropdown = $('ul.navbar-nav[data-category-name="'+filterSet.get('category')+'"]', this.navbar);
					$('ul.cf-filter-category-menu-list li[data-id="'+filterSet.cid+'"]',fcMenuDropdown).remove();
					var filterSetsArray = this.collection.where({'category':filterSet.get('category')});
					$('li.dropup',fcMenuDropdown).toggleClass('disabled', filterSetsArray.length===0);
					$('li.dropup span.badge',fcMenuDropdown).html(filterSetsArray.length?filterSetsArray.length:'');
					
					this.collection.sync('delete', filterSet, {
						'context':this,
						'success':function(data, textStatus, jqXHR){
							this.enable();
					}});
				}
			}, this);
			
			// sync request event handler for the collection
			// starting a request to the server
			this.collection.on('request', function(col, xhr, opts) {
				//console.log('colleciton.request');
				if(!this.isLocalStorage) {
					console.log('collection.request');
					this.disable();
				}
			}, this);
			
			// sync response event handler for the collection
			this.collection.on('sync', function(col, resp, opts) {
				// resp should be an Array of filterSet models
				// TODO ?? update the category dropdown menus
				//console.log('collection.sync');
				this.enable();
			}, this);
			
			// sync error event handler for the collection
			this.collection.on('error', function(col, resp, opts) {
				if(this.isLocalStorage) {
					console.warn('sync.error, but handled because isLocalStorage is true');
					this.enable();
				} else {
					console.error('sync:error');
					console.log(resp);
					console.log(opts);
				}
			}, this);
			
			// pass the table with the fetch -- collection.read
			if(!this.isLocalStorage) {
				this.collection.fetch({'data':{'table':options.table}});
			}
		}
	},
	'render':function() { return this; }
});

var CDataFilterSetsLocal = Backbone.Collection.extend({
	'model':MFilterSet,
	'localStorage':null,
	
	'initialize':function(options) {
		console.log('initializing Local CDataFilterSets collection');
		this.url = 'columnfilters';
		this.sync = function(method, payload, opts) {
			console.log('Data Filters Control.sync');
			switch(method) {
				case 'create':
					console.log('Data Filters Control.sync.create');
					console.log(payload);
					//console.log(opts);
					this.localStorage.add(payload);
					opts.success();
					break;
				case 'read':
					console.log('Data Filters Control.sync.read');
					console.log(payload);//the collection
					console.log(opts);
					if(this.localStorage==null) {
						// create a new local filterset database
						this.localStorage = new Backbone.Collection([], {'model':MFilterSet});
					} else {
						var fsets = this.localStorage.where({'table':opts.table});
						if(fsets.length) {
							payload.add(fsets);
						}
					}
					opts.success();
					break;
				case 'update':
					console.log('Data Filters Control.sync.update');
					console.log(payload);
					console.log(opts);
					// value alread changed in collection
					// TODO opts.context.enable();
					this.trigger('sync', this, null,null);
					//opts.success(payload, null, null);
					break;
				case 'delete':
					console.log('Data Filters Control.sync.delete');
					console.log(payload);
					console.log(opts);
					
					break;
				default:
					console.log('Data Filters Control.sync.'+method);
					//console.log(payload);
					//console.log(opts);
					
					break;
			}
		};
	}
});