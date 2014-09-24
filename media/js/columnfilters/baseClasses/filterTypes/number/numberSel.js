// Filter Widget Type Implementation Class for Number (Select)
var VFilterWidgetTypeNumberSel = VFilterWidgetType.extend({
	type:'select',
	sb:null,
	sbOptions:{min:-10, max:100, step:.25},
	valueList:[],
	listEl:null,
	validate:function() {
		
	},
	getValue:function() {
		return {'type':this.type, value:this.valueList};
	},
	setValue:function(data) {
		//expecting array of numbers
		this.valueList = data;
		for(var i in data) {
			addToList(data[i]);
		}
	},
	reset:function() {
		$('input',this.$el)[0].reset();
	},
	
	addToList:function(value) {
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
