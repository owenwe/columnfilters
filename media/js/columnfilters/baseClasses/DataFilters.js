// DataFilters (the main shit)
var VDataFilters = Backbone.View.extend({
	columnFilterSelected:function(){},
	filterFactory:null,
	dispatcher:_.clone(Backbone.Events),
	
	tagName:'div',
	className:'panel panel-default',
	initialize:function(options) {
		
		// Event Functions
		this.dispatcher.on('init-complete', function(e) {
			console.log('init complete of data filter controller');
		});
		
		// when a data column from the drop down is selected
		this.dispatcher.on('column-filter-click', function(alink) {
			//tell the filter factory to load the filter widget
			this.filterFactory.load($(alink).attr('data-type'), $(alink).attr('data-name'), $(alink).html());
		}, this);
		
		// when the 'add filter' button is clicked
		this.dispatcher.on('filter-add-click', function() {
			//validate filter pull from filter factory
			console.log('filter add click');
			//test enable/disable
			this.filterFactory.disable();
		}, this);
		
		//
		this.dispatcher.on('test-event', function() {
			console.log('test event fired');
			this.filterFactory.enable();
		}, this);
		
		
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
					var li = $(document.createElement('li')),
						alink = $(document.createElement('a')).attr({'href':'#','data-type':tc.type,'data-name':tc.name}).html(tc.label);
					alink.click({dispatcher:this.dispatcher}, function(e){
						e.data.dispatcher.trigger('column-filter-click', e.currentTarget);
					});
					filterOptions.push(li.append(alink));
				}
			}
		}
		
		this.filterFactory = new VDataFilterFactory({collection:new Backbone.Collection(
			[
				new VDataColumnFilterWidget({type:'text',model:new MDataColumnFilterWidget(),collection:new Backbone.Collection([
					new VFilterWidgetTypeTextEq(),
					new VFilterWidgetTypeTextSrch()
				])}),
				new VDataColumnFilterWidget({type:'number',model:new MDataColumnFilterWidget(),collection:new Backbone.Collection([
					new VFilterWidgetTypeNumberEq(),
					new VFilterWidgetTypeNumberBtwn(),
					new VFilterWidgetTypeNumberSel()
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
														   .addClass('btn btn-default btn-xs')
														   .click({dispatcher:this.dispatcher}, function(e) {
															   e.data.dispatcher.trigger('filter-add-click');
														   })
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
			panelBody = $(document.createElement('div')).addClass('panel-body').html('foo bar');
		
		this.$el.append(panelHeading,panelBody);
		this.dispatcher.trigger('datafiltercontroller-initcomplete',{foo:'bar'});
	},
	render:function() {
		
		return this;
	}
});
