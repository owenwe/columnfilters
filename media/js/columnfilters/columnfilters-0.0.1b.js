/*
ColumnFilters 0.0.1b for Datatables 1.10.x
*/
var CFTEMPLATES = {
	DATEPICKER_DATE_FORMATS:{
		'en_us':'mm/dd/yyyy',
		'en_gb':'dd-mm-yyyy',
		'zh_cn':'yyyy.mm.dd',
		'month_year':'MM, yyyy'
	},
	DATEPICKER_VIEW_MODES:{
		'DAYS':0,
		'MONTHS':1,
		'YEARS':2
	},
	DATEPICKER_WEEK_START_DAYS:{
		'SUNDAY':0,
		'MONDAY':1,
		'TUESDAY':2,
		'WEDNESDAY':3,
		'THURSDAY':4,
		'FRIDAY':5,
		'SATURDAY':6
	},
	dataFiltersControlBody:'<div class="row"><div class="col-xs-4"><ul class="nav nav-pills nav-stacked" role="tablist"></ul></div><div class="col-xs-8"><div class="tab-content"></div></div></div>',
	dataFiltersControlFooter:'<nav class="navbar navbar-default cf-datafilters-controller-footer" role="navigation"><div class="container-fluid"><div class="collapse navbar-collapse"><% if(controller.filterCategories.length){ print(\'<ul class=\"nav navbar-nav navbar-right\"><li class=\"btn btn-xs cf-delete-filter-list disabled\" title=\"delete\"><a href=\"#\" class=\" btn btn-xs\"><span class=\"glyphicon glyphicon-remove\"></span> </a></li><li class=\"dropup btn btn-xs cf-save-filter-list disabled\" title=\"save\"><a href=\"#\" class=\"dropdown-toggle btn btn-xs\" data-toggle=\"dropdown\"><span class=\"glyphicon glyphicon-floppy-disk\"></span><span class=\"caret\"></span></a><ul class=\"dropdown-menu\" role=\"menu\"></ul></li></ul>\'); } %></div></div></nav><div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Cancel</span></button><h4 class="modal-title" id="cf-modal-title">Modal title</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary">Save</button></div></div></div></div>',
	datebetweenFilterWidgetType:'<div class="row"><div class="col-md-12" title="from"><%= fromDatepicker %></div></div>',
	datepicker1:"<div class=\"datepicker\"><div class=\"input-group\"><input class=\"form-control\" type=\"text\" readonly/><div class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"glyphicon glyphicon-calendar\"></span><span class=\"sr-only\">Toggle Calendar</span></button><div class=\"dropdown-menu dropdown-menu-right datepicker-calendar-wrapper\" role=\"menu\"><div class=\"datepicker-calendar\"><div class=\"datepicker-calendar-header\"><button type=\"button\" class=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span><span class=\"sr-only\">Previous Month</span></button><button type=\"button\" class=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span><span class=\"sr-only\">Next Month</span></button><button type=\"button\" class=\"title\"><span class=\"month\"><span data-month=\"0\">January</span><span data-month=\"1\">February</span><span data-month=\"2\">March</span><span data-month=\"3\">April</span><span data-month=\"4\">May</span><span data-month=\"5\">June</span><span data-month=\"6\">July</span><span data-month=\"7\">August</span><span data-month=\"8\">September</span><span data-month=\"9\">October</span><span data-month=\"10\">November</span><span data-month=\"11\">December</span></span> <span class=\"year\"></span></button></div><table class=\"datepicker-calendar-days\"><thead><tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr></thead><tbody></tbody></table><div class=\"datepicker-calendar-footer\"><button type=\"button\" class=\"datepicker-today\">Today</button></div></div><div class=\"datepicker-wheels\" aria-hidden=\"true\"><div class=\"datepicker-wheels-month\"><h2 class=\"header\">Month</h2><ul><li data-month=\"0\"><button type=\"button\">Jan</button></li><li data-month=\"1\"><button type=\"button\">Feb</button></li><li data-month=\"2\"><button type=\"button\">Mar</button></li><li data-month=\"3\"><button type=\"button\">Apr</button></li><li data-month=\"4\"><button type=\"button\">May</button></li><li data-month=\"5\"><button type=\"button\">Jun</button></li><li data-month=\"6\"><button type=\"button\">Jul</button></li><li data-month=\"7\"><button type=\"button\">Aug</button></li><li data-month=\"8\"><button type=\"button\">Sep</button></li><li data-month=\"9\"><button type=\"button\">Oct</button></li><li data-month=\"10\"><button type=\"button\">Nov</button></li><li data-month=\"11\"><button type=\"button\">Dec</button></li></ul></div><div class=\"datepicker-wheels-year\"><h2 class=\"header\">Year</h2><ul></ul></div><div class=\"datepicker-wheels-footer clearfix\"><button type=\"button\" class=\"btn datepicker-wheels-back\"><span class=\"glyphicon glyphicon-arrow-left\"></span><span class=\"sr-only\">Return to Calendar</span></button><button type=\"button\" class=\"btn datepicker-wheels-select\">Select <span class=\"sr-only\">Month and Year</span></button></div></div></div></div></div></div>",
	datepicker2:"<div class=\"datepicker <%= name %>\"><div class=\"input-group\"><input class=\"form-control\" type=\"text\" readonly/><div class=\"input-group-btn\"><div class=\"dropdown-menu dropdown-menu-right datepicker-calendar-wrapper\" role=\"menu\"><div class=\"datepicker-calendar\"><div class=\"datepicker-calendar-header\"><button type=\"button\" class=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span><span class=\"sr-only\">Previous Month</span></button><button type=\"button\" class=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span><span class=\"sr-only\">Next Month</span></button><button type=\"button\" class=\"title\"><span class=\"month\"><span data-month=\"0\">January</span><span data-month=\"1\">February</span><span data-month=\"2\">March</span><span data-month=\"3\">April</span><span data-month=\"4\">May</span><span data-month=\"5\">June</span><span data-month=\"6\">July</span><span data-month=\"7\">August</span><span data-month=\"8\">September</span><span data-month=\"9\">October</span><span data-month=\"10\">November</span><span data-month=\"11\">December</span></span> <span class=\"year\"></span></button></div><table class=\"datepicker-calendar-days\"><thead><tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr></thead><tbody></tbody></table><div class=\"datepicker-calendar-footer\"><button type=\"button\" class=\"datepicker-today\">Today</button></div></div><div class=\"datepicker-wheels\" aria-hidden=\"true\"><div class=\"datepicker-wheels-month\"><h2 class=\"header\">Month</h2><ul><li data-month=\"0\"><button type=\"button\">Jan</button></li><li data-month=\"1\"><button type=\"button\">Feb</button></li><li data-month=\"2\"><button type=\"button\">Mar</button></li><li data-month=\"3\"><button type=\"button\">Apr</button></li><li data-month=\"4\"><button type=\"button\">May</button></li><li data-month=\"5\"><button type=\"button\">Jun</button></li><li data-month=\"6\"><button type=\"button\">Jul</button></li><li data-month=\"7\"><button type=\"button\">Aug</button></li><li data-month=\"8\"><button type=\"button\">Sep</button></li><li data-month=\"9\"><button type=\"button\">Oct</button></li><li data-month=\"10\"><button type=\"button\">Nov</button></li><li data-month=\"11\"><button type=\"button\">Dec</button></li></ul></div><div class=\"datepicker-wheels-year\"><h2 class=\"header\">Year</h2><ul></ul></div><div class=\"datepicker-wheels-footer clearfix\"><button type=\"button\" class=\"btn datepicker-wheels-back\"><span class=\"glyphicon glyphicon-arrow-left\"></span><span class=\"sr-only\">Return to Calendar</span></button><button type=\"button\" class=\"btn datepicker-wheels-select\">Select <span class=\"sr-only\">Month and Year</span></button></div></div></div></div></div></div>",
	datepicker3:'<div class="input-group date<% _.isString(datepicker.name)?print(" "+datepicker.name):"" %>"><input type="text" class="form-control date" size="16" value="" readonly /><span class="input-group-addon btn btn-default"><span class="glyphicon glyphicon-calendar"></span></span></div>',
	datepicker4:'<div class="input-group<% _.isString(datepicker.name)?print(" "+datepicker.name):"" %>"><input type="text" class="form-control" size="16" value="" readonly /><span class="input-group-addon add-on">to</span><input type="text" class="form-control" size="16" value="" readonly /></div>',
	filterCategoryMenu:'<ul class="nav navbar-nav" data-category-name="<%= filterCategory.name %>"><li class="dropup btn btn-xs disabled"><a href="#" class="dropdown-toggle btn btn-xs" data-toggle="dropdown"><%= filterCategory.name %><span class="badge"></span><span class="caret"></span></a><ul class="dropdown-menu" role="menu"></ul></li></ul>',
	filterCategorySaveItem:'<li data-save-type="<%= filterCategory.name %>"><a href="#"><span class="badge pull-right"><span class="glyphicon <%= filterCategory.glyph %>"></span></span> to <% print(filterCategory.name[0].toUpperCase()+filterCategory.name.substring(1)) %></a></li>',
	numberSpinner1:'<div class="spinbox digits-5<% print(_.has(spinbox,"name")?(" "+spinbox.name):"") %>"><input type="text" class="form-control input-mini spinbox-input" /><div class="spinbox-buttons btn-group btn-group-vertical"><button class="btn btn-default spinbox-up btn-xs"><span class="glyphicon glyphicon-chevron-up"></span><span class="sr-only">Increase</span></button><button class="btn btn-default spinbox-down btn-xs"><span class="glyphicon glyphicon-chevron-down"></span><span class="sr-only">Decrease</span></button></div></div>',
	saveFilterSetModalForm:'<form class="form-horizontal" role="form"><div class="form-group"><label for="cfFilterSetSaveName" class="col-sm-2 control-label">Name</label><div class="col-sm-10"><input type="text" class="form-control" id="cfFilterSetSaveName" placeholder="Name for this set of filters" autocomplete="off"></div></div><div class="form-group"><label for="cfFilterSetSaveDescription" class="col-sm-2 control-label">Description</label><div class="col-sm-10"><textarea class="form-control" rows="3" id="cfFilterSetSaveDescription" autocomplete="off"></textarea></div></div></form>'

};
var MColumnFilter = Backbone.Model.extend({
	defaults:{
		'description':'',
		'value':{'type':'text',value:null}
	}
});
var CColumnFilters = Backbone.Collection.extend({
	model:MColumnFilter
});
var MDataColumnFilter = Backbone.Model.extend({
	name:null,
	column:null,
	type:'text',
	filters:null
});
var CDataColumnFilters = Backbone.Collection.extend({
	model:MDataColumnFilter
});
var MDataFilter = Backbone.Model.extend({
	initialize:function(options) {}
});
var CDataFilters = Backbone.Collection.extend({
	model:MDataFilter
});
var VFilterWidgetType = Backbone.View.extend({
	type:'equals',//abstract
	visible:false,
	active:false,
	
	
	// abstract functions (must override)
	
	// if you just want to know if the widget inputs are valid for returning value(s)
	isValid:function() {},
	
	// calling this function will cause the widget to check that it can return values from its inputs
	validate:function() {},
	
	// returns a human-readable description of the filter input values
	getValueDescription:function() {},
	
	// returns an object representing the filter values and properties if valid, otherwise false
	getValue:function() {},
	
	// will set the inputs to the values given
	setValue:function(filterValue) {},
	
	//
	//load:function(data) {},
	
	// restores the filter widget back to its initial state
	reset:function() {},
	
	// default class functions, can override, but it's not neccessary to do so
	show:function() {
		this.visible = true;
		this.active = true;
		this.$el.show();
	},
	hide:function() {
		this.visible = false;
		this.active = false;
		this.$el.hide();
	},
	enable:function() {
		this.$el[0].disabled = false;
	},
	disable:function() {
		this.$el[0].disabled = true;
	},
	
	// default view properties/functions
	tagName:'fieldset',
	className:'cf-widget-type',
	render:function() { return this; }
});
var VDataColumnFilterWidget = Backbone.View.extend({
	type:'text',
	visible:false,
	active:false,
	
	activeType:function() {
		return this.collection.findWhere({active:true});
	},
	getSubType:function(subType) {
		return this.collection.findWhere({type:subType});
	},
	getFilterValue:function() {
		var at = this.activeType();
		if(at) {
			return at.getValue();
		} else {
			return false;
		}
	},
	setFilterValue:function(filterValue) {
		var fwt = this.collection.findWhere({'type':filterValue.type});
		if(fwt) {
			fwt.attributes.setValue(filterValue);
		}
	},
	setLabel:function(label) {
		$('div.cf-widget-type-label',this.$el).html(label);
	},
	
	changeSubType:function(subType) {
		var at = this.activeType(),
			selAt = this.collection.findWhere({'type':subType});
		if(at && (subType!=at.attributes.type)){
			//change filter widget type selector label
			$('span.cf-widget-type-selector-btn-title', this.$el).html(subType);
			//hide current widget type
			at.attributes.hide();
			//show selected widget type
			selAt.attributes.show();
		}
	},
	
	show:function() {
		this.visible = true;
		this.active = true;
		this.$el.show();
		//render the active type
		var at = this.activeType();
		if(at) {
			//console.log(this.type+':'+at.attributes.type);
			at.attributes.show();
		}
	},
	hide:function() {
		this.visible = false;
		this.active = false;
		this.$el.hide();
	},
	enable:function() {
		var ddbtn = $('button.dropdown-toggle',this.$el);
		if(ddbtn) {
			ddbtn[0].disabled = false;
		}
		var at = this.activeType();
		if(at) {
			at.attributes.enable();
		}
	},
	disable:function() {
		//disable the drop down
		var ddbtn = $('button.dropdown-toggle',this.$el);
		if(ddbtn) {
			ddbtn[0].disabled = true;
		}
		
		//need to get active widget and call disable on it
		var at = this.activeType();
		if(at) {
			at.attributes.disable();
		}
	},
	reset:function() {
		this.collection.each(function(filterWidget) {
			filterWidget.attributes.reset();
		});
	},
	
	tagName:'div',
	className:'cf-filter-widget',
	events:{
		// triggered when the type dropdown item is clicked
		'click ul.dropdown-menu li a':function(e) {
			this.changeSubType($(e.currentTarget).html());
		}
	},
	initialize:function(options) {
		if(options.hasOwnProperty('type')) {
			this.type = options.type;
		}
		//should be passed in: type, collection
		this.$el.addClass('cf-filter-widget-'+this.type);
		
		//build selector drop down
		var typeSelectorDropdown = $(document.createElement('ul')).attr({'role':'menu'}).addClass('dropdown-menu'),
			typeSelector = $(document.createElement('div')).addClass('cf-widget-type-selector btn-group pull-left').append(
				$(document.createElement('div')).addClass('cf-widget-type-label pull-left'),
				$(document.createElement('button')).attr({'type':'button','data-toggle':'dropdown'})
												   .addClass('btn btn-default btn-xs dropdown-toggle')
												   .append('<span class="cf-widget-type-selector-btn-title"></span> <span class="caret"></span>'),
				typeSelectorDropdown
		),
			typesContainer = $(document.createElement('div')).addClass('cf-widget-types-container pull-left');
		if(options.hasOwnProperty('collection')) {
			$('span.cf-widget-type-selector-btn-title',typeSelector).html(options.collection.at(0).attributes.type);
			var dsp = this.dispatcher;
			options.collection.each(function(widgetType) {
				widgetType.attributes.hide();
				typeSelectorDropdown.append(
					$(document.createElement('li')).append($(document.createElement('a')).attr({'href':'#'}).html(widgetType.attributes.type))
				);
				typesContainer.append(widgetType.attributes.el);
			});
			//show the first widget type
			options.collection.at(0).attributes.active = true;
			options.collection.at(0).attributes.show();
		}
		this.$el.append([typeSelector,typesContainer]);
	},
	render:function() { return this; }
});
var VDataFilterFactory = Backbone.View.extend({
	types:[],
	activeColumn:null,
	
	activeFilter:function(){
		//return any visible filter widgets (should only be 1)
		var af = this.collection.findWhere({active:true});
		return af?af.attributes:false;
	},
	
	getFilterValue:function() {
		return this.activeFilter().activeType().attributes.getValue();
	},
	
	setFilterValue:function(filter) {
		//first we have to find
		var fw = this.collection.findWhere({'type':filter.type});
		if(fw) {
			fw.attributes.reset();
			fw.attributes.setFilterValue(filter.filterValue);
		}
	},
	
	enable:function() {
		//enable the active filter
		var af = this.activeFilter();
		if(af){
			af.enable();
		}
	},
	disable:function() {
		//disable the active filter
		var af = this.activeFilter();
		if(af) {
			af.disable();
		}
	},
	
	// displays the requested filter widget type
	load:function(dataType,dataCol,dataLabel,subType) {
		//find it in the collection
		var reqfw = this.collection.findWhere({'type':dataType}),
			curfw = this.activeFilter();
		if(reqfw) {
			//if not asking for the currently visible filter widget, and there is one visible, hide it
			if(curfw && (curfw.cid!=reqfw.cid)) {
				curfw.hide();
			}
			//set the active column value
			this.activeColumn = dataCol;
			
			//set the data label for the widget
			reqfw.attributes.setLabel(dataLabel);
			
			//show the requested filter widget
			reqfw.attributes.show();
			
			if(_.isString(subType)) {
				reqfw.attributes.changeSubType(subType);
			}
		}
	},
	
	
	tagName:'div',
	className:'cf-filter-factory',
	initialize:function(options) {
		
		if(options.hasOwnProperty('collection')) {
			var ffEl = this.$el,
				ffTypes = this.types;
			options.collection.each(function(filterWidget) {
				filterWidget.attributes.hide();
				ffEl.append(filterWidget.attributes.el);
				ffTypes.push(filterWidget.attributes.type);
			});
			
			if(options.hasOwnProperty('showOnInit') && options.showOnInit) {
				options.collection.at(0).attributes.show();
			}
		}
	},
	render:function() {
		return this;
	}
});
var VDataFiltersContainer = Backbone.View.extend({
	
	preDisableTabStates:[],
	
	/*
	this is only the view for the current filter group, it should NOT control
	the interaction of filter groups, only add/edit/remove/interaction of the view elements
	*/
	filterItemMouseover:function(e){
		$('button.close',$(e.currentTarget)).show();
		$('span.cf-filter-edit-button',$(e.currentTarget)).show();
	},
	filterItemMouseleave:function(e){
		$('button.close',$(e.currentTarget)).hide();
		$('span.cf-filter-edit-button',$(e.currentTarget)).hide();
	},
	
	enable:function() {
		$('ul.nav li',this.$el).removeClass('disabled');
		for(var i in this.preDisableTabStates) {
			var pdts = this.preDisableTabStates[i];
			pdts.tabLink.attr({'href':pdts.href,'data-toggle':pdts.dataToggle});
		}
		var dfc = this;
		$('div.tab-content div.tab-pane.active a.list-group-item',this.$el).each(function(i,e) {
			$(e).attr('href','#').removeClass('disabled');
			$(e).on({'mouseover':dfc.filterItemMouseover, 'mouseleave':dfc.filterItemMouseleave});
		});
	},
	disable:function() {
		this.preDisableTabStates = [];
		var pdts = this.preDisableTabStates;
		$('ul.nav li',this.$el).addClass('disabled');
		$('ul.nav li a.list-group-item',this.$el).each(function(i,e) {
			var a = $(e);
			pdts.push({'tabLink':a, 'href':a.attr('href'), 'dataToggle':a.attr('data-toggle')});
			a.removeAttr('href');
			a.removeAttr('data-toggle');
		});
		
		$('div.tab-content div.tab-pane.active a.list-group-item',this.$el).each(function(i,e) {
			$(e).removeAttr('href').off('mouseover mouseleave').addClass('disabled');
			$('button.close, span.cf-filter-edit-button',$(e)).hide();
		});
	},
	
	add:function(filterData) {
		// add filter to current filter group
		// ASSERTION: filterData will be valid
		// filterData: {table, category, column, type, label, filterValue:{type, ...}}
		//console.log(filterData.attributes);
		var mAtt = _.clone(filterData.attributes);
		mAtt.cid = filterData.cid;
		
		// the filter list item
		var flit = $(this.filterListItemTemplate(mAtt));
		//show/hide action button functionality
		flit.on({'mouseover':this.filterItemMouseover, 'mouseleave':this.filterItemMouseleave});
		$('h4.list-group-item-heading button.close',flit).hide();
		$('h4.list-group-item-heading span.cf-filter-edit-button',flit).hide();
		
		//click event handlers for the action buttons
		$('h4.list-group-item-heading button.close', flit).click({dfc:this, 'filter':mAtt},function(e) {
			// do what we need to do in this view then trigger removeClick so the DataFilters
			// View can handle what it needs to do
			var dfc = e.data.dfc,
				fData = e.data.filter;
			
			// delete this tab content list item
			$(e.currentTarget).parent().parent().remove();
			
			// if there are no more list items in the tab content, delete the tab content and the tab
			var remainingFiltersCount = $('div.tab-pane#'+fData.column+' div.list-group a.list-group-item', dfc.$el).length;
			if(remainingFiltersCount) {
				//filters remain, just update the filter count for this column set
				$('a.list-group-item[href="#'+fData.column+'"] span.badge', dfc.$el).html(remainingFiltersCount);
			} else {
				//no more filters remain for this column set, remove tab panel and tab
				$('div.tab-pane#'+fData.column, dfc.$el).remove();
				$('a.list-group-item[href="#'+fData.column+'"]', dfc.$el).parent().remove();
			}
			
			//dispatch event up the chain, pass cid so the model can be remove from the collection
			dfc.trigger('removeClick',fData.cid);
		});
		$('h4.list-group-item-heading span.cf-filter-edit-button', flit).click({dfc:this, 'cid':mAtt.cid},function(e) {
			//just send the filter cid up the chain
			e.data.dfc.trigger('changeClick',e.data.cid);
		});
		
		//first look for an existing li (tab) in <ul class="dropdown-menu" role="menu">
		var existingPill = $(['ul.nav-pills li a[href="#',mAtt.column,'"]'].join(''), this.$el);
		if(existingPill.length) {
			var columnTabContent = $(['div#',mAtt.column, ' div.list-group'].join(''), this.$el),
				columnFilterCount = $('span.badge', existingPill).html()*1;
			$('span.badge', existingPill).html(++columnFilterCount);
			
			columnTabContent.append(flit);
			
		} else {
			var currentTabsCount = $('ul.nav-pills li a',this.$el).length;
			//add column pill to tab set
			$('ul.nav',this.$el).append(this.filterColumnTemplate(mAtt));
			
			//add tab content if needed, or create one
			var columnTabContent = $(['div#',mAtt.column].join(''),this.$el);
			if(columnTabContent.length<1) {
				// need to create a new tab content container
				$('div.tab-content',this.$el).append(this.filterColumnTabTemplate({'column':mAtt.column,'cid':mAtt.cid}));
				columnTabContent = $(['div#',mAtt.column,' div.list-group'].join(''),this.$el);
			}
			//add it to the current tab content and update counts
			// label, type, table, category, column, filterValue:{type, }
			columnTabContent.append(flit);
			
			//set this tab to active if it's the only one
			if(currentTabsCount<1) {
				//console.log($('ul.nav-pills li', this.$el));
				$('ul.nav-pills li a', this.$el).first().tab('show');
			}
		}
	},
	
	updateFilter:function(filter) {
		var fALink = $('div.tab-content div.list-group a.list-group-item[data-filter-cid="'+filter.cid+'"]', this.$el);
		if(fALink.length) {
			$('h4.list-group-item-heading strong',fALink).html([filter.attributes.label,filter.attributes.filterValue.type].join(' : '));
			$('p.list-group-item-text span',fALink).html(filter.attributes.filterValue.description);
		}
	},
	
	remove:function() {
		
	},
	
	tagName:'div',
	className:'panel-body cf-data-filters-container',
	events:{},
	
	template:_.template(CFTEMPLATES.dataFiltersControlBody,{variable:'container'}),
	
	// this is the tab
	filterColumnTemplate:_.template(
		['<li>',
			'<a href="#<%= dataColumn.column %>" role="pill" data-toggle="pill" class="list-group-item">',
				'<%= dataColumn.column %> <span class="badge pull-right">1</span>',
			'</a>',
		'</li>'].join(''),
		{variable:'dataColumn'}
	),
	
	// this is the content for the tab
	filterColumnTabTemplate:_.template(
		['<div class="tab-pane" id="<%= columnData.column %>">',
			'<div class="list-group"></div>',
		'</div>'].join(''),
		{variable:'columnData'}
	),
	
	// this is an item in the tab content list
	filterListItemTemplate:_.template(
		[
			'<a href="#" class="list-group-item" data-filter-cid="<%= filterData.cid %>">',
				'<h4 class="list-group-item-heading"><strong><%= filterData.label %> : <%= filterData.filterValue.type %></strong>',
					'<button class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>',
					'<span class="btn pull-right cf-filter-edit-button"><span class="glyphicon glyphicon-cog"></span></span>',
				'</h4>',
				'<p class="list-group-item-text">',
					'<span><%= filterData.filterValue.description %></span>',
				'</p>',
			'</a>'
		].join(''),
		{variable:'filterData'}
	),
	
	initialize:function(options) {
		/*
		.nav : add > <li><a href="#column1" role="pill" data-toggle="pill">Column 1 <span class="badge pull-right">99</span></a></li>
		.tab-content : add > <div class="tab-pane" id="column1">
								<div class="list-group">
									<a href="#" class="list-group-item">Cras justo odio</a> ...
		*/
		
		this.$el.append(this.template({}));
		
	},
	render:function() {
		return this;
	}
});
var VDataFilters = Backbone.View.extend({
	defaultConfig:{
		'table':'undefined',
		'showFirst':null,
		'filters':false,
		'filterCategories':[]
	},
	table:'undefined',		//the name of the database table or virtual source
	filters:null,			//a collection of MDataFilter
	filterCategories:[],	//array of names
	
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
	
	//pointer to the filter set in the filter categories
	currentWorkingFilterSet:null,
	
	//cid of the model in the filters collection during an edit
	editFilterCid:null,
	
	//used to keep track of filters displayed in the dataFiltersContainer
	currentColumnFilter:{'table':null,'type':null,'column':null,'label':null},
	
	//used to keep track of the filter control nav bar dropdowns
	preEditFilterControlStates:[],
	
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
	
	// changes the filter factory widget to the given type
	changeFilterFactoryType:function(type,column,label,subType) {
		this.currentColumnFilter = {
			'table':this.table,
			'type':type,
			'column':column,
			'label':label
		};
		this.filterFactory.load(this.currentColumnFilter.type, this.currentColumnFilter.column, this.currentColumnFilter.label, subType);
	},
	
	//
	editFilterMode:function() {
		// show edit done button
		$('button.cf-edit-filter-button', this.$el).show();
		$('button.cf-cancel-edit-filter-button', this.$el).show();
		
		//	hide add filter/change column button
		$('.cf-add-change-filter-group-button button',this.$el).hide();
		
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
	
	//
	cancelEditFilterMode:function() {
		$('button.cf-edit-filter-button', this.$el).hide();
		$('button.cf-cancel-edit-filter-button', this.$el).hide();
		$('.cf-add-change-filter-group-button button',this.$el).show();
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
	
	tagName:'div',
	className:'panel panel-default',
	
	
	events:{
		// COLUMN FILTER CHANGE
		// is to load the data info from the clicked event into the filter factory
		'click ul.cf-columns-select-dd li a':function(e) {
			this.changeFilterFactoryType($(e.currentTarget).attr('data-type'),$(e.currentTarget).attr('data-name'),$(e.currentTarget).html());
		},
		
		// ADD FILTER CLICK
		// should first call validate on the active filter type
		'click button.cf-add-filter-button':function(e) {
			//this.filterFactory.disable();
			var af = this.filterFactory.activeFilter(),
				fVal = af?this.filterFactory.getFilterValue():false;
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
		
		var panelHeading = $(document.createElement('div')).addClass('panel-heading well-sm').append(
			$(document.createElement('div')).addClass('row').append(
				$(document.createElement('div')).addClass('col-md-2 text-center').append(
					$(document.createElement('strong')).addClass('h3').html('Data Filters')
				),
				$(document.createElement('div')).addClass('col-md-2').append(
					
					$(document.createElement('div')).addClass('btn-group cf-add-change-filter-group-button').append(
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
					),
					
					$(document.createElement('button')).attr({'type':'button'}).addClass('btn btn-default btn-sm cf-edit-filter-button').html('Save').hide(),
					$(document.createElement('button')).attr({'type':'button'}).addClass('btn btn-default btn-sm cf-cancel-edit-filter-button').html('Cancel').hide()
				),
				$(document.createElement('div')).addClass('col-md-8').append(
					this.filterFactory.el
				)
			)
		);
		
		
		// There will always be a user (or default) filter
		// should pull all table filters/column filters for this user + common and public
		this.dataFiltersContainer = new VDataFiltersContainer();
		
		this.$el.append(
			panelHeading,
			this.dataFiltersContainer.el,
			_.template(CFTEMPLATES.dataFiltersControlFooter,{variable:'controller'})({'filterCategories':this.defaultConfig.filterCategories})
		);
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
		
		// 
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
		
		
		if(this.defaultConfig.filterCategories.length) {
			for(var i in this.defaultConfig.filterCategories) {
				this.addCategory(this.defaultConfig.filterCategories[i]);
			}
		}
		
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
var VFilterWidgetTypeTextEq = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'equals',
	
	
	isValid:function() {
		return $.trim($('input',this.$el).val()).length>0;
	},
	validate:function() {
		// TODO unset inputs/labels from danger status
		if(this.isValid()) {
			// TODO set inputs/labels to danger status
			return true;
		}
		
		console.log('text cannot be empty');
		return false;
	},
	getValueDescription:function() {
		if(this.isValid()) {
			return 'is equal to ' + $.trim($('input',this.$el).val());
		} else {
			return false;
		}
	},
	getValue:function() {
		if(this.validate()) {
			return {
				'type':this.type,
				value:$.trim($('input',this.$el).val()),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		$('input',this.$el).val(filterValue.value);
	},
	reset:function() {
		$('input',this.$el)[0].reset();
	},
	
	
	initialize:function(options) {
		this.$el.html(
			'<input type="text" placeholder="equals" size="32" maxlength="45" autocomplete="off" value="" />'+
			'<span class="help-block">filtering the results by column values equal to this</span>'
		);
	},
	render:function() {
		return this;
	}
});
var VFilterWidgetTypeTextSrch = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'search',
	
	
	isValid:function() {
		return $.trim($('input',this.$el).val()).length>0;
	},
	validate:function() {
		// TODO unset inputs/labels from danger status
		if(this.isValid()) {
			// TODO set inputs/labels to danger status
			return true;
		}
		
		console.log('text cannot be empty');
		return false;
	},
	getValueDescription:function() {
		if(this.isValid()) {
			return 'is like to ' + $.trim($('input',this.$el).val());
		} else {
			return false;
		}
	},
	getValue:function() {
		if(this.validate()) {
			return {
				'type':this.type,
				value:$.trim($('input',this.$el).val()),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		$('input',this.$el).val(filterValue.value);
	},
	reset:function() {
		$('input',this.$el)[0].reset();
	},
	
	
	initialize:function(options) {
		this.$el.html(
			'<input type="text" placeholder="equals" size="32" maxlength="45" autocomplete="off" value="" />'+
			'<span class="help-block">filtering the results by column values similar to this</span>'
		);
	},
	render:function() {
		return this;
	}
});
var VFilterWidgetTypeNumberEq = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'equals',
	sb:null,
	sbOptions:{
		//value:<number>
		//min:<number>
		//max:<number>
		//step:<number>
		//hold:<boolean>
		//speed:<string> "fast","medium","slow"
		//disabled:<boolean>
		//units:<array> array of strings that are allowed to be entered in the input with the number
		min:-10, max:100, step:.25
	},
	
	
	isValid:function() {
		return !isNaN(this.sb.spinbox('value')*1);
	},
	validate:function() {
		if(this.isValid()) {
			return true;
		}
	},
	getValueDescription:function() {
		if(this.isValid()) {
			return 'is equal to ' + this.sb.spinbox('value')*1;
		} else {
			return false;
		}
	},
	getValue:function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':this.sb.spinbox('value')*1,
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		this.sb.spinbox('value',filterValue.value);
	},
	reset:function() {
		this.setValue(0);
	},
	
	template:_.template(
		CFTEMPLATES.numberSpinner1+
		'<span class="help-block">filtering the results by column values equal to this</span>',
		{variable:'spinbox'}
	),
	initialize:function(options) {
		this.$el.addClass('fuelux');
		// TODO make this a spinner (FuelUX, JQueryUI)
		this.$el.html(this.template({}));
		$('.spinbox',this.$el).spinbox(this.sbOptions);
		this.sb = $('.spinbox',this.$el);
	},
	render:function() {
		return this;
	}
});
var VFilterWidgetTypeNumberBtwn = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'between',
	sbFrom:null,
	sbTo:null,
	sbOptions:{
		//value:<number>
		//min:<number>
		//max:<number>
		//step:<number>
		//hold:<boolean>
		//speed:<string> "fast","medium","slow"
		//disabled:<boolean>
		//units:<array> array of strings that are allowed to be entered in the input with the number
		min:-10, max:100, step:.25
	},
	
	
	isValid:function() {
		var fromNum = this.sbFrom.spinbox('value')*1,
			toNum = this.sbTo.spinbox('value')*1,
			fromNumCheck = !isNaN(fromNum),
			toNumCheck = !isNaN(toNum),
			isNotEqualCheck = (fromNum!==toNum);
		return (fromNumCheck && toNumCheck && isNotEqualCheck);
	},
	validate:function() {
		// TODO unset inputs/labels from danger status
		if(this.isValid()) {
			// TODO set inputs/labels to danger status
			return true;
		}
		
		console.log('a from and to number must be given');
		return false;
	},
	getValueDescription:function() {
		if(this.isValid()) {
			return 'is between ' + this.sbFrom.spinbox('value') + ' and ' + this.sbTo.spinbox('value');
		} else {
			return false;
		}
	},
	getValue:function() {
		if(this.validate()) {
			return {
				'type':this.type,
				from:this.sbFrom.spinbox('value')*1,
				to:this.sbTo.spinbox('value')*1,
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		console.log(filterValue);
		//data is expected to be an object with from/to keys
		if(_.has(filterValue,'from') && _.isNumber(filterValue.from)) {
			this.sbFrom.spinbox('value',filterValue.from);
		}
		if(_.has(filterValue,'to') && _.isNumber(filterValue.to)) {
			this.sbTo.spinbox('value',filterValue.to);
		}
	},
	reset:function() {
		this.setValue({'from':0,'to':0});
	},
	
	
	events:{
		'changed.fu.spinbox div.spinbox.sbFrom':function(e) {
			//console.log('spinbox from changed');
			// TODO
		},
		'changed.fu.spinbox div.spinbox.sbTo':function(e) {
			//console.log('spinbox to changed');
			
		}
	},
	template:_.template(
		'<div class="row"><div class="col-xs-4">'+_.template(CFTEMPLATES.numberSpinner1,{variable:'spinbox'})({name:'sbFrom'})+'</div>'+
		'<div class="col-xs-2"><span class="btn btn-default disabled"><span class="glyphicon glyphicon-resize-horizontal"></span> to</span></div>'+
		'<div class="col-xs-6">'+_.template(CFTEMPLATES.numberSpinner1,{variable:'spinbox'})({name:'sbTo'})+'</div>'+
		'<span class="help-block">filtering the results by column values between these numbers</span>'
	),
	initialize:function(options) {
		this.$el.addClass('fuelux');
		this.$el.html(this.template);
		$('.spinbox',this.$el).spinbox(this.sbOptions);
		this.sbFrom = $('.spinbox.sbFrom',this.$el);
		this.sbTo = $('.spinbox.sbTo',this.$el);
	},
	render:function() {
		return this;
	}
});
var VFilterWidgetTypeNumberSel = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'select',
	sb:null,
	sbOptions:{min:-10, max:100, step:.25},
	valueList:[],
	listEl:null,
	
	
	isValid:function() {
		return this.valueList.length>0;
	},
	
	validate:function() {
		// TODO unset inputs/labels from danger status
		if(this.isValid()) {
			// TODO set inputs/labels to danger status
			return true;
		}
		
		console.log('one or more numbers must be selected');
		return false;
	},
	
	getValueDescription:function() {
		if(this.isValid()) {
			return 'is one of these numbers: (' + this.valueList.join(',') + ')';
		} else {
			return false;
		}
	},
	
	getValue:function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':this.valueList,
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	setValue:function(filterValue) {
		//expecting array of numbers
		this.valueList = filterValue.value;
		for(var i in filterValue.value) {
			addToList(filterValue.value[i]);
		}
	},
	
	reset:function() {
		this.sb.spinbox('value',0);
		this.listEl.empty();
		this.valueList = [];
	},
	
	addToList:function(value) {
		/*
		<div class="cf-list-item">
			<span>x.x</span>
			<button class="close" data-numberValue="x.x"><span area-hidden="true">&times;</span><span class="sr-only">Close</span></button>
		</div>
		*/
		this.valueList.push(value);
		return $(document.createElement('div')).addClass('cf-list-item')
											   .mouseover(function(e){
													$('button.close',$(e.currentTarget)).show();
											 }).mouseleave(function(e){
													$('button.close',$(e.currentTarget)).hide();
											 }).append(
			$(document.createElement('span')).html(value),
			$(document.createElement('button')).addClass('close')
											   .data('numberValue',value)
											   .click({dataList:this.valueList}, function(e) {
												   var idx = _.indexOf(e.data.dataList, $(e.currentTarget).data('numberValue')*1);
												   e.data.dataList.splice(idx,1);
												   $(e.currentTarget).parent().remove();
											   })
											   .html('<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>')
											   .hide()
		);
	},
	
	events:{
		'click button.sbadd':function(e) {
			// TODO make sure it's not a duplicate
			var num = this.sb.spinbox('value')*1;
			if($.inArray(num, this.valueList)<0) {
				this.listEl.append(this.addToList(this.sb.spinbox('value')*1));
			}
		}
	},
	
	template:_.template(
		'<div class="row">'+
		'	<div class="col-md-5">'+CFTEMPLATES.numberSpinner1+'</div>'+
		'	<div class="col-md-2">'+
		'		<div class="pull-left"><button class="btn btn-default sbadd"><span class="glyphicon glyphicon-plus"></span></button></div>'+
		'	</div>'+
		'	<div class="col-md-5">'+
		'		<div class="panel panel-default">'+
		'			<div class="panel-heading">List of Values</div>'+
		'			<div class="panel-body"><div class="cf-list"></div>'+
		'		</div>'+
		'	</div>'+
		'</div>'+
		'<span class="help-block">filtering the results by column values in this list</span>',
		{variable:'spinbox'}
	),
	
	initialize:function(options) {
		this.$el.addClass('fuelux');
		this.$el.html(this.template({name:'sb'}));
		$('.spinbox',this.$el).spinbox(this.sbOptions);
		this.sb = $('.spinbox.sb',this.$el);
		this.listEl = $('.cf-list',this.$el);
	},
	render:function() {
		return this;
	}
});
var VFilterWidgetTypeDateEq = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'equals',
	dp:null,
	dpConfig:{
		autoclose:true,
		'name':'dpeq',
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
	},
	
	isValid:function() {
		return !isNaN(this.dp.datepicker('getDate').getTime());
	},
	validate:function() {
		// TODO unset inputs/labels from danger status
		if(this.isValid()) {
			// TODO set inputs/labels to danger status
			return true;
		}
		
		console.log('a date must be selected');
		return false;
	},
	getValueDescription:function() {
		if(this.isValid()) {
			return 'is equal to ' + this.dp.datepicker('getDate').toLocaleDateString();
		} else {
			return false;
		}
	},
	getValue:function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':this.dp.datepicker('getDate'),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		// date should be a date
		if(_.isDate(filterValue.value)) {
			this.dp.datepicker('setDate',filterValue.value);
		}
	},
	reset:function() {
		this.dp.datepicker('setDate',null);
		//this.dp.datepicker('setEndDate',null);
		//this.dp.datepicker('setStartDate',null);
	},
	
	
	template:_.template(CFTEMPLATES.datepicker3,{variable:'datepicker'}),
	events:{
		'changeDate div.dpeq':function(e) {
			return false;
			
		}
	},
	initialize:function(options) {
		/*
		template datepicker3 wants: 
			name -required: string that will be added to the class list, 
			date: string date that should be in the same format as what you assign the datepicker, 
			format: string format - viewMode:CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us/en_gb/zh_cn, 
			viewMode: use CFTEMPLATES.DATEPICKER_VIEW_MODES.YEARS/MONTHS/DAYS, 
			minViewMode: same as viewMode
		*/
		this.$el.html(this.template(this.dpConfig));
		$('.dpeq',this.$el).datepicker(this.dpConfig);
		this.dp = $('.dpeq input',this.$el);
	}
});
var VFilterWidgetTypeDateBtwn = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'between',
	dpFrom:null,
	dpStartDate:null,
	dpTo:null,
	dpEndDate:null,
	dpConfig:{
		autoclose:true,
		format:CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
	},
	
	isValid:function() {
		return !isNaN(this.dpFrom.datepicker('getDate').getTime()) && !isNaN(this.dpTo.datepicker('getDate').getTime());
	},
	validate:function() {
		// TODO unset inputs/labels from danger status
		if(this.isValid()) {
			// TODO set inputs/labels to danger status
			return true;
		}
		
		console.log('a to and from date must be selected');
		return false;
	},
	getValueDescription:function() {
		if(this.isValid()) {
			return [
				'is between ',
				this.dpFrom.datepicker('getDate').toLocaleDateString(),
				' and ',
				this.dpTo.datepicker('getDate').toLocaleDateString()
			].join('');
		} else {
			return false;
		}
	},
	getValue:function() {		
		if(this.validate()) {
			return {
				'type':this.type,
				'fromDate':this.dpFrom.datepicker('getDate'),
				'toDate':this.dpTo.datepicker('getDate'),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		this.dpStartDate = filterValue.fromDate;
		this.dpEndDate = filterValue.toDate;
		this.dpFrom.datepicker('setDate', this.dpStartDate);
		this.dpTo.datepicker('setDate', this.dpEndDate);
		this.dpFrom.datepicker('setEndDate',this.dpEndDate);
		this.dpTo.datepicker('setStartDate',this.dpStartDate);
	},
	reset:function() {
		this.dpStartDate = null;
		this.dpEndDate = null;
		this.dpFrom.datepicker('setDate',null);
		this.dpTo.datepicker('setDate',null);
		this.dpFrom.datepicker('setEndDate',null);
		this.dpTo.datepicker('setStartDate',null);
	},
	
	
	template:_.template(CFTEMPLATES.datepicker4,{variable:'datepicker'}),
	events:{
		'changeDate .dpbtw input:first-child':function(e) {
			this.dpFrom.datepicker('setEndDate',e.date);
			if(e.date) {
				//date is valid
				//does the to-date have a limiter?
				this.dpStartDate = new Date(e.date.valueOf()+86400000);
				this.dpTo.datepicker('setStartDate',this.dpStartDate);
			} else {
				//cleared date, clear dpTo.startDate
				this.dpStartDate = null;
				this.dpTo.datepicker('setStartDate',this.dpStartDate);
			}
			if(isNaN(this.dpTo.datepicker('getDate').getTime())) {
				this.dpTo[0].focus();
			}
		},
		'changeDate .dpbtw input:last-child':function(e) {
			//place date value in text input
			this.dpTo.datepicker('setStartDate',e.date);
			if(e.date) {
				this.dpEndDate = new Date(e.date.valueOf()-86400000);
				this.dpFrom.datepicker('setEndDate',this.dpEndDate);
			} else {
				//cleared date, clear dpFrom.endDate
				this.dpEndDate = null;
				this.dpFrom.datepicker('setEndDate',this.dpEndDate);
			}
			if(isNaN(this.dpFrom.datepicker('getDate').getTime())) {
				this.dpFrom[0].focus();
			}
		},
		'click .test':function(e) {
			console.log(this.dp1.getDate());
			console.log(this.dp2.getDate());
		}
	},
	
	initialize:function(options) {
		this.$el.html(this.template({name:'dpbtw'}));
		$('.dpbtw input',this.$el).datepicker(this.dpConfig);
		this.dpFrom = $('.dpbtw input:first-child',this.$el);
		this.dpTo = $('.dpbtw input:last-child',this.$el);
	},
	render:function() {
		return this;
	}
});
var VFilterWidgetTypeDateSel = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'select',
	dp:null,
	dpConfig:{
		'name':'dpsel',
		autoclose:true,
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
	},
	valueList:[],
	listEl:null,
	
	isValid:function() {
		return this.valueList.length>0;
	},
	validate:function() {
		// TODO unset inputs/labels from danger status
		if(this.isValid()) {
			// TODO set inputs/labels to danger status
			return true;
		}
		
		console.log('one or more dates must be selected');
		return false;
	},
	getValueDescription:function() {
		if(this.isValid()) {
			var dStrArr = [];
			for(var d in this.valueList) {
				dStrArr.push(new Date(this.valueList[d]).toLocaleDateString());
			}
			return 'is one of these dates: (' + dStrArr.join(',') + ')';
		} else {
			return false;
		}
	},
	getValue:function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':this.valueList,
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		//expecting array of date timestamp numbers
		this.valueList = filterValue.value;
		for(var i in filterValue.value) {
			addToList(new Date(filterValue.value[i]));
		}
	},
	reset:function() {
		//TODO reset datepicker and list
		this.dp.datepicker('setDate',null);
		this.listEl.empty();
		this.valueList = [];
	},
	
	addToList:function(value) {
		this.valueList.push(value.getTime());
		return $(document.createElement('div')).addClass('cf-list-item')
											   .mouseover(function(e){
													$('button.close',$(e.currentTarget)).show();
											 }).mouseleave(function(e){
													$('button.close',$(e.currentTarget)).hide();
											 }).append(
			$(document.createElement('span')).html(value.toLocaleDateString()),
			$(document.createElement('button')).addClass('close')
											   .data('dateValue',value)
											   .click({dataList:this.valueList}, function(e) {
												   var idx = _.indexOf(e.data.dataList, $(e.currentTarget).data('dateValue')*1);
												   e.data.dataList.splice(idx,1);
												   $(e.currentTarget).parent().remove();
											   })
											   .html('<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>')
											   .hide()
		);
	},
	
	events:{
		'click button.dpadd':function(e) {
			// make sure it's not a duplicate
			var d = this.dp.datepicker('getDate');
			if(!isNaN(d.getTime()) && ($.inArray(d.getTime(), this.valueList)<0)) {
				this.listEl.append(this.addToList(d));
			}
		}
	},
	template:_.template(
		'<div class="row">'+
		'	<div class="col-md-5">'+CFTEMPLATES.datepicker3+'</div>'+
		'	<div class="col-md-2">'+
		'		<div class="pull-left"><button class="btn btn-default dpadd"><span class="glyphicon glyphicon-plus"></span></button></div>'+
		'	</div>'+
		'	<div class="col-md-5">'+
		'		<div class="panel panel-default">'+
		'			<div class="panel-heading">List of Dates</div>'+
		'			<div class="panel-body"><div class="cf-list"></div>'+
		'		</div>'+
		'	</div>'+
		'</div>'+
		'<span class="help-block">filtering the results by column values in this list</span>',
		{variable:'datepicker'}
	),
	initialize:function(options) {
		this.$el.html(this.template(this.dpConfig));
		$('.dpsel',this.$el).datepicker(this.dpConfig);
		this.dp = $('.dpsel',this.$el);
		this.listEl = $('.cf-list',this.$el);
	},
	render:function() {
		return this;
	}
});
var VFilterWidgetTypeDateCycle = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'cycle',
	
	////////////////////////////////////////////////////////////////////
	// TODO Fix bug where the datepicker looses minViewMode setting
	////////////////////////////////////////////////////////////////////
	
	//aren't these available somewhere else like JQuery or Backbone or something?
	months:['January','February','March','April','May','June','July','August','September','October','November','December'],
	
	dp:null,
	dpConfig:{
		autoclose:true,
		minViewMode:1,
		startView:1,
		'name':'dpcy',
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.month_year
	},
	cycle:[
		{label:'1st-15th', value:1},
		{label:'16th-End Of Month', value:2}
	],
	
	
	isValid:function() {
		var d = this.dp.datepicker('getDate');
		return !isNaN(d.getTime());
	},
	validate:function() {
		// TODO unset inputs/labels from danger status
		if(this.isValid()) {
			// TODO set inputs/labels to danger status
			return true;
		}
		
		console.log('a month and year must be selected');
		return false;
	},
	getValueDescription:function() {
		if(this.isValid()) {
			var d = this.dp.datepicker('getDate');
			return 'for the billing cycle of ' + this.months[d.getMonth()] + ', ' + d.getFullYear();
		} else {
			return false;
		}
	},
	getValue:function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'monthYear':this.dp.datepicker('getDate'),
				'cycle':$('div.btn-group label.active input',this.$el).val()*1,
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		if(_.has(filterValue,'monthYear') && _.isDate(filterValue.monthYear)) {
			this.dp.datepicker('setDate',filterValue.monthYear);
		} else {
			this.dp.datepicker('setDate',null);
		}
		if(_.has(filterValue,'cycle')) {
			$('div.btn-group label').each(function(i,e){
				var lbl = $(e),
					inpt = $('input',$(e));
				lbl.removeClass('active');
				inpt.removeAttr('checked');
				if((inpt.val()*1)==filterValue.cycle){
					lbl.addClass('active');
					inpt.attr('checked','checked');
				}
			});
		}
	},
	reset:function() {
		this.setValue({'date':null,'cycle':1});
	},
	
	
	template:_.template(
		'<div class="btn-group" data-toggle="buttons"></div>'+CFTEMPLATES.datepicker3,
		{variable:'datepicker'}
	),
	initialize:function(options) {
		if(options && options.hasOwnProperty('cycle')) {
			// cycle is expected to be an array of date range objects within 1 month
			// [{label:<str>,value:<?>},...]
			this.cycle = options.cycle;
		}
		this.$el.html(this.template(this.dpConfig));
		$('.dpcy',this.$el).datepicker(this.dpConfig);
		this.dp = $('.dpcy input',this.$el);
		
		//populate buttons
		for(var i in this.cycle) {
			$('div.btn-group',this.$el).append(
				$(document.createElement('label')).addClass('btn btn-primary').append(
					$(document.createElement('input')).attr({'type':'radio','id':_.uniqueId('cf-dpcy_'),'value':this.cycle[i].value}),
					this.cycle[i].label
				)
			);
		}
		$('div.btn-group label.btn:first-child',this.$el).addClass('active');
		$('div.btn-group label.btn:first-child input',this.$el).first().attr('checked','checked');
	},
	render:function() {
		return this;
	}
});
