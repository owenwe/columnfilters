// variable { panelheading.filterFactory (View.el), panelheading.filterColumns (Array) }
CFTEMPLATES.dataFiltersPanelContent = '<div class="panel-heading well-sm">'+
	'<div class="row">'+
		'<div class="col-xs-5">'+
			
			'<div class="btn-group cf-data-filter-type-selection" data-toggle="buttons">'+
				'<label class="btn btn-info active"><input type="radio" name="options" id="cf-data-type-option-default" value="0" checked="checked" /> Data Filters</label>'+
				'<label class="btn btn-info"><input type="radio" name="options" id="cf-data-type-option-common-value" value="1" /> Common Value</label>'+
			'</div>'+
			
			// DEFAULT FILTER SELECTION TYPE
			'<div class="btn-group cf-add-change-filter-group-button pull-right">'+
				'<button type="button" class="btn btn-default btn-xs cf-add-filter-button">Add Filter</button>'+
				'<button type="button" data-toggle="dropdown" class="btn btn-default btn-xs dropdown-toggle">'+
					'<span class="caret"></span>'+
					'<span class="sr-only">Toggle Dropdown</span>'+
				'</button>'+
				'<ul role="menu" class="dropdown-menu cf-columns-select-dd"><%= $.map(panelheading.filterColumns, function(c,i) { return _.template(CFTEMPLATES.filterOptionListItem,{variable:\'columnData\'})(c); }).join("") %></ul>'+
			'</div>'+
			'<div class="btn-group pull-right">'+
				'<button type="button" class="btn btn-success btn-sm cf-edit-filter-button">Save</button>'+
				'<button type="button" class="btn btn-default btn-sm cf-cancel-edit-filter-button">Cancel</button>'+
			'</div>'+
			
			'<div class="cf-common-value-controller-replace"></div>'+
			
		'</div>'+
		'<div class="col-xs-7 cf-filter-factory-container-row"></div>'+
	'</div>'+
'</div>';