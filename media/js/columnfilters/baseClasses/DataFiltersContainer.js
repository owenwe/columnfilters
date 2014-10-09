// Data Filters Container Controller
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