// variable { panelheading.filterFactory (View.el), panelheading.filterColumns (Array) }
CFTEMPLATES.dataFiltersPanelContent = '<div class="panel-heading well-sm">'+
	'<div class="row">'+
		'<div class="col-lg-5 col-md-5 col-sm-7 col-xs-8 text-nowrap">'+
			
			// FILTER SELECTION TYPE
			'<div class="btn-group cf-data-filter-type-selection" data-toggle="buttons">'+
				'<label class="btn btn-info active"><input type="radio" name="options" id="cf-data-type-option-default" value="0" checked="checked" /> Data Filters</label>'+
				'<label class="btn btn-info"><input type="radio" name="options" id="cf-data-type-option-common-value" value="1" /> Common Value</label>'+
			'</div>'+
			
			// COMMON VALUE FILTER SELECTION TYPE
			'<div class="cf-common-value-controller-replace"></div>'+
			
			// ADD FILTER/COLUMN SELECT DROP DOWN
			'<div class="btn-group">'+
				'<button type="button" class="btn btn-success btn-sm cf-edit-filter-button">Save</button>'+
				'<button type="button" class="btn btn-default btn-sm cf-cancel-edit-filter-button">Cancel</button>'+
			'</div>'+
			
			// DEFAULT FILTER SELECTION TYPE
			'<div class="btn-group cf-add-change-filter-group-button cf-dropdown-menu-scroll-medium">'+
				'<button type="button" class="btn btn-default btn-xs cf-add-filter-button">Add Filter</button>'+
				'<button type="button" data-toggle="dropdown" class="btn btn-default btn-xs dropdown-toggle">'+
					'<span class="caret"></span>'+
					'<span class="sr-only">Toggle Dropdown</span>'+
				'</button>'+
				'<ul role="menu" class="dropdown-menu cf-columns-select-dd">'+//dropdown-menu-sm
				'<% for(var i in panelheading.filterColumns) { %>'+
					'<% if(!panelheading.filterColumns[i].cfexclude) { %>'+
						'<%= _.template(CFTEMPLATES.filterOptionListItem,{variable:\'columnData\'})(panelheading.filterColumns[i]) %>'+
					'<% } %>'+
				'<% } %>'+
				'</ul>'+
			'</div>'+
			
		'</div>'+
		'<div class="col-lg-7 col-md-7 col-sm-5 col-xs-12 cf-filter-factory-container-row"></div>'+
	'</div>'+
'</div>';