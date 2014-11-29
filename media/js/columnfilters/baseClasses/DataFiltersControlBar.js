/*
The view controller for saving/loading/removing filter sets
This view will have a collection that makes use of a properly structured JSON Object, 
LocalStorage, Backbone.Collection with AJAX backend to a DB

Filter Category Structure
{
	name:	<string>	short-form label (under 45 characters)
	sets:	<array>		a collection of filter sets
}

Filter Set Structure
[
	{
		id:				<integer>	unique identifier (usually a database auto increment sequence)
		name:			<string>	short-form label (under 45 characters)
		category:		<string>	name of the category that this set belongs
		table:			<string>	the database table (or parent-level object) name
		user_id:		<integer>	identifier of the user that this set belongs
		description:	<string>	long-form description of category
		filters:		<array>		a collection of filter objects
	},...
*/
var VDataFiltersControlBar = Backbone.View.extend({
	
	// Enum of the different interactive modes this control can be put into
	'MODES':{ 'DEFAULT':0, 'CATEGORY_SETS':1 },
	
	// the parent controller view that has a 'filters' collection
	'filtersController':null,
	'modal':null,// form modal for inputting category/filter set names and descriptions
	
	// these are passed from the parent controller and are attached to each filter set
	// for use in storing them  in a database per user
	'table':null,
	'user_id':null,
	
	'categories':null,			// a collection of category names
	'currentCategory':null,		// should be the cid of the category in the categories collection
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
	
	'refreshClearFiltersButton':function() {
		this.clearFiltersButton.toggleClass('disabled', this.filtersController.filters.length<1);
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
	
	// makes sure there are no duplicates and then adds a menu dropup to the footer control
	// and a dropup link to the save filters menu
	'addCategory':function(categoryName, filters) {
		// if a category menu with the same name doesn't already exist
		if(this.collection.where({'category':categoryName}).length<1) {
			
			// add category name to the categories collection
			this.categories.add({'name':categoryName});
			
			// add a category menu dropup to the footer control nav bar
			this.navbar.append(
				this.templates.filterCategoryMenu({'name':categoryName})
			);
			
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
			
			// TODO handle filters arg (used when filter sets are pulled from existing data):
			if(filters) {
				
			}
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
	
	// resets the filtersController.filters with the filters in the identified filterSet
	'loadFilters':function(filterSetId) {
		
		// Future Wes: even the cloned model's attributes are references in the filtersController.filters collection
		// so we need to figure out a way to clone those attributes so any changes dont' effect the filter set's filters
		
		/* this.collection (Collection)
				.
				.
				[filterSet n] (Model)
					.attributes (Object)
						.filters (Array)
							.
							.
							[filter n] (Object)
		*/
		var clonedFilterSet = this.collection.get(filterSetId).clone(),
			clonedFilterSetFilters = $.extend(true,{},clonedFilterSet.attributes),// this should have made a deep copy, but values are still referenced
			deepCopyFilterArray = [];
		for(var i in clonedFilterSetFilters.filters) {//loop through each filter (which is a filter Model)
			var f = new MDataFilter({
				'table':clonedFilterSetFilters.filters[i].attributes.table,
				'category':clonedFilterSet.category,
				'type':clonedFilterSetFilters.filters[i].attributes.type,
				'column':clonedFilterSetFilters.filters[i].attributes.column,
				'label':clonedFilterSetFilters.filters[i].attributes.label,
				'filterValue':$.extend(true, {}, clonedFilterSetFilters.filters[i].attributes.filterValue)
			});
			
			// listen for change event on the model
			f.on('change:filterValue', function(filter) {
				//need to update filter tab content list item
				//this.filtersController.dataFiltersContainer.updateFilter(filter);
				this.dataFiltersContainer.updateFilter(filter);
			}, this);
			
			deepCopyFilterArray.push( f );
		}
		
		// the resetFilters event should pass a deep-copy clone collection of filters
		//this.trigger('resetFilters', deepCopyFilterArray);
		this.trigger('resetFilters', this.collection.get(filterSetId).clone() );
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
			// put all existing filters (filtersController.filters) into the filters attribute of this collection model
			this.collection.get(this.currentCategory).attributes.filters = this.filtersController.filters.clone().models;
			
			//restore navbar controls
			//check menus for list items, only enable if there are some
			$('ul.navbar-nav',this.navbar).each(function(i,navUl) {
				if($('li.dropup ul.dropdown-menu li',$(navUl)).length) {
					$('li.dropup',$(navUl)).removeClass('disabled');
				}
			});
			this.saveButton.hide();
			this.cancelButton.hide();
			this.editMode = false;
		},
		
		// CANCEL EDITING FILTER SET CLICK
		// triggered when the "Cancel" button in the nav bar has been clicked
		'click button.cf-cancel-filter-set-changes-button':function(e) {
			// restore filters in the filter set
			this.loadFilters(this.currentCategory);
			
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
		},
		
		// LOAD FILTER SET CLICK
		'click ul.cf-filter-category-menu-list li h4 a':function(e) {
			var fsId = $(e.currentTarget).data('id');
			this.loadFilters($(e.currentTarget).data('id'));
			this.refreshClearFiltersButton();
		},
		
		// EDIT FILTER SET CLICK
		// triggered when the edit button is clicked in a filter set menu item
		'click ul.navbar-nav li.dropup ul.cf-filter-category-menu-list button[data-type="edit"]':function(e) {
			this.editMode = true;
			
			// store the selected filter set in currentCategory variable
			this.currentCategory = $(e.currentTarget).data('id');
			
			// load filters from the selected filter set
			this.loadFilters(this.currentCategory);
			
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
					var newFs = new MFilterSet({
						'category':category,
						'table':this.table,
						'user_id':this.user_id,
						'name':fsName,
						'description':fsDesc.length?fsDesc:null,
						'filters':this.filtersController.filters.clone().models
					});
					
					this.collection.add(newFs);
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
		// filtersController
		// mode
		// filterCategories
		// table
		// user
		this.filtersController = options.filtersController;
		this.table = options.table;
		this.user_id = options.user_id;
		
		// just a collection of names
		this.categories = new Backbone.Collection();
		
		// the collection of filter sets, where we can pluck the categories from the category property of each set
		this.collection = new CDataFilterSets();
		
		this.$el.attr('role','navigation');
		if(options.mode===this.MODES.CATEGORY_SETS) {
			this.$el.append(_.template(CFTEMPLATES.dataFiltersControlFooter,{variable:'controller'})({'filterCategories':options.filterCategories}));
			this.navbar = $('div.collapse.navbar-collapse',this.$el);
			this.saveDropdown = $('ul.navbar-right li.cf-save-filter-list ul.dropdown-menu',this.navbar);
			this.cancelButton = $('button.cf-cancel-filter-set-changes-button',this.navbar).hide();
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
			
			if(options.filterCategories.length) {
				for(var i in options.filterCategories) {
					//a category is just a small string
					this.addCategory(options.filterCategories[i]);
				}
			}
			
			// event listeners
			
			// add filter set
			this.collection.on('add', function(filterSet) {
				var fcMenuDropdown = $('ul.navbar-nav[data-category-name="'+filterSet.attributes.category+'"]',this.navbar),
					newFilterSet = this.templates['filterSetMenuItem'](filterSet);
				//add filter set menu item
				$('ul.cf-filter-category-menu-list',fcMenuDropdown).append(newFilterSet);
				$('li.dropup',fcMenuDropdown).removeClass('disabled');
				$('li.dropup span.badge',fcMenuDropdown).html(this.collection.where({'category':filterSet.attributes.category}).length);
			}, this);
			
			// remove filter set
			this.collection.on('remove', function(filterSet) {
				console.log('collection remove');
				var fcMenuDropdown = $('ul.navbar-nav[data-category-name="'+filterSet.attributes.category+'"]',this.navbar);
				$('ul.cf-filter-category-menu-list li[data-id="'+filterSet.cid+'"]',fcMenuDropdown).remove();
				var filterSetsArray = this.collection.where({'category':filterSet.attributes.category});
				$('li.dropup',fcMenuDropdown).toggleClass('disabled', filterSetsArray.length===0);
				$('li.dropup span.badge',fcMenuDropdown).html(filterSetsArray.length?filterSetsArray.length:'');
				// TODO remove filters in this set
				
			}, this);
			
			this.filtersController.filters.on('add', function(filter) {
				//this.refreshClearFiltersButton();
			}, this);
			this.filtersController.filters.on('remove', function(filter) {
				//this.refreshClearFiltersButton();
			}, this);
		}
	},
	'render':function() { return this; }
});