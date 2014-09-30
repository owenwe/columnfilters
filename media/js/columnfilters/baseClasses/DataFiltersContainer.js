// Data Filters Container Controller
var VDataFiltersContainer = Backbone.View.extend({
	
	/*
	this is only the view for the current filter group, it should NOT control
	the interaction of filter groups, only add/edit/remove of the view elements
	*/
	
	
	add:function(filterData) {
		// add filter to current filter group
		// ASSERTION: filterData will be valid
		// filterData: {table, category, column, type, label, filterValue:{type, ...}}
		console.log('adding filter to group');
		console.log(filterData);
		var mAtt = _.clone(filterData.attributes);
		mAtt.cid = filterData.cid;
		//first look for an existing li in <ul class="dropdown-menu" role="menu">
		var existingPill = $(['ul.nav-pills li a[href="#',mAtt.column,'"]'].join(''), this.$el);
		if(existingPill.length) {
			var columnTabContent = $(['div#',mAtt.column, ' div.list-group'].join(''), this.$el),
				columnFilterCount = $('span.badge', existingPill).html()*1;
			console.log(columnFilterCount);
			$('span.badge', existingPill).html(++columnFilterCount);
			columnTabContent.append(this.filterListItemTemplate({'label':mAtt.label}));
			
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
			columnTabContent.append(this.filterListItemTemplate({'label':mAtt.label}));
			
			//set this tab to active if it's the only one
			if(currentTabsCount<1) {
				console.log($('ul.nav-pills li', this.$el));
				$('ul.nav-pills li a', this.$el).first().tab('show');
			}
		}
	},
	
	tagName:'div',
	className:'panel-body cf-data-filters-container',
	events:{},
	
	template:_.template(CFTEMPLATES.dataFiltersControlBody,{variable:'container'}),
	filterColumnTemplate:_.template(
		['<li>',
			'<a href="#<%= dataColumn.column %>" role="pill" data-toggle="pill" class="list-group-item">',
				'<%= dataColumn.column %> <span class="badge pull-right">1</span>',
			'</a>',
		'</li>'].join(''),
		{variable:'dataColumn'}
	),
	filterColumnTabTemplate:_.template(
		['<div class="tab-pane" id="<%= columnData.column %>">',
			'<div class="list-group"></div>',
		'</div>'].join(''),
		{variable:'columnData'}
	),
	filterListItemTemplate:_.template(
		['<a href="#" class="list-group-item"><%= filterData.label %></a>'
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