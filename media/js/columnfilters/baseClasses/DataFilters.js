// DataFilters (the main shit)
var VDataFilters = Backbone.View.extend({
	columnFilterSelected:function(){},
	filterFactory:null,
	
	tagName:'div',
	className:'panel panel-default',
	events:{
		// triggered when the data column from the dropdown list is clicked
		'click ul.dropdown-menu li a':function(e) {
			this.filterFactory.load($(e.currentTarget).attr('data-type'), $(e.currentTarget).attr('data-name'), $(e.currentTarget).html());
		},
		// triggered when the add filter button is clicked
		'click button.cf-add-filter-button':function() {
			this.filterFactory.disable();
		},
		// 
		'click #btnTest':function() {
			this.filterFactory.enable();
		}
	},
	initialize:function(options) {
		//<div class="panel-heading well-sm">
		//  <div class="row">
		//    <div class="col-md-2 text-center">
		//      <strong class="h3">Data Filters</strong>
		//
		//    <div class="col-md-2">
		//      <div class="btn-group">
		//        <button type="button" class="btn btn-default btn-xs">Add Filter</button>
		//        <button id="dtColDataFilterDropDown" type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
		//          <span class="caret"></span>
		//          <span class="sr-only">Toggle Dropdown</span>
		//
		//        <ul class="dropdown-menu" role="menu">
		//          <li><a href="#">Text</a></li>
		//          ...
		//    <div class="col-md-8">
		//
		//<div class="panel-body">
		
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
		
		this.filterFactory = new VDataFilterFactory({showOnInit:true,collection:new Backbone.Collection(
			[
				new VDataColumnFilterWidget({type:'text',model:new MDataColumnFilterWidget(),collection:new Backbone.Collection([
					new VFilterWidgetTypeTextEq(),
					new VFilterWidgetTypeTextSrch()
				])}),
				new VDataColumnFilterWidget({type:'number',model:new MDataColumnFilterWidget(),collection:new Backbone.Collection([
					new VFilterWidgetTypeNumberEq(),
					new VFilterWidgetTypeNumberBtwn(),
					new VFilterWidgetTypeNumberSel()
					
				])}),
				new VDataColumnFilterWidget({type:'date',model:new MDataColumnFilterWidget(),collection:new Backbone.Collection([
					new VFilterWidgetTypeDateEq(),
					new VFilterWidgetTypeDateBtwn()
					
					
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
						$(document.createElement('ul')).attr({'role':'menu'}).addClass('dropdown-menu').append(filterOptions)
					)
				),
				$(document.createElement('div')).addClass('col-md-8').append(
					this.filterFactory.el
				)
			)
		),
			panelBody = $(document.createElement('div')).addClass('panel-body').html('<button type="button" id="btnTest">test</button>');
		
		this.$el.append(panelHeading,panelBody);
	},
	render:function() {
		
		return this;
	}
});
