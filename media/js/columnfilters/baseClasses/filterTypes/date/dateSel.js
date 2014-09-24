// Filter Widget Type Implementation Class for Number (Select)
var VFilterWidgetTypeDateSel = VFilterWidgetType.extend({
	type:'select',
	dp:null,
	dpConfig:{
		'name':'dpsel',
		autoclose:true,
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
	},
	valueList:[],
	listEl:null,
	validate:function() {
		
	},
	getValue:function() {
		return {'type':this.type, value:this.valueList};
	},
	setValue:function(data) {
		//expecting array of date timestamp numbers
		this.valueList = data;
		for(var i in data) {
			addToList(new Date(data[i]));
		}
	},
	reset:function() {
		$('input',this.$el)[0].reset();
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
