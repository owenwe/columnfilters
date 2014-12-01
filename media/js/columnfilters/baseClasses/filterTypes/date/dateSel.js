// Filter Widget Type Implementation Class for Number (Select)
var VFilterWidgetTypeDateSel = VFilterWidgetType.extend({
	'version':'1.0.2',
	'type':'select',
	'dp':null,
	'dpConfig':{
		'name':'dpsel',
		autoclose:true,
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
	},
	'valueList':[],
	'listEl':null,
	
	'isValid':function() {
		return this.valueList.length>0;
	},
	'validate':function() {
		// TODO unset inputs/labels from danger status
		if(this.isValid()) {
			// TODO set inputs/labels to danger status
			return true;
		}
		
		this.trigger('notify', 'danger', 'Date Filter ('+this.type+') Error', 'One or more dates must be selected.');
		return false;
	},
	'getValueDescription':function() {
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
	'getValue':function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':this.valueList,
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	'setValue':function(filterValue) {
		//expecting array of date timestamp numbers
		this.valueList = filterValue.value;
		for(var i in filterValue.value) {
			addToList(new Date(filterValue.value[i]));
		}
	},
	'reset':function() {
		//TODO reset datepicker and list
		this.dp.datepicker('setDate',null);
		this.listEl.empty();
		this.valueList = [];
	},
	
	'addToList':function(value) {
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
	
	'events':{
		'click button.dpadd':function(e) {
			// make sure it's not a duplicate
			var d = this.dp.datepicker('getDate');
			if(!isNaN(d.getTime()) && ($.inArray(d.getTime(), this.valueList)<0)) {
				this.listEl.append(this.addToList(d));
			}
		}
	},
	'template':_.template(
		[
			'<div class="row">',
				'<div class="col-lg-4 col-md-5 col-sm-10 col-xs-8">'+CFTEMPLATES.datepicker3+'</div>',
				'<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">',
					'<div class="pull-left"><button class="btn btn-xs btn-default dpadd"><span class="glyphicon glyphicon-plus"></span></button></div>',
				'</div>',
				'<div class="col-lg-4 col-md-5 col-sm-12 col-xs-8">',
					'<div class="panel panel-default">',
						'<div class="panel-heading">List of Dates</div>',
						'<div class="panel-body"><div class="cf-list"></div></div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="row">',
				'<div class="col-xs-12">',
					'<span class="help-block">filtering the results by column values in this list</span>',
				'</div>',
			'</div>'
		].join(''),
		{variable:'datepicker'}
	),
	'initialize':function(options) {
		this.$el.html(this.template(this.dpConfig));
		$('.dpsel',this.$el).datepicker(this.dpConfig);
		this.dp = $('.dpsel',this.$el);
		this.listEl = $('.cf-list',this.$el);
	}
});
