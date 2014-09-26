// Filter Widget Type Implementation Class for Date (Equals)
var VFilterWidgetTypeDateCycle = VFilterWidgetType.extend({
	type:'cycle',
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
	validate:function() {
		// TODO
	},
	getValue:function() {
		var d = this.dp.datepicker('getDate');
		return {
			'type':this.type,
			monthYear:isNaN(d.getTime())?null:d,
			'cycle':$('div.btn-group label.active input',this.$el).val()*1
		};
	},
	setValue:function(data) {
		// data is expected to be: {date:<d>, cycle:<cycle>}
		if(_.has(data,'date') && _.isDate(data.date)) {
			this.dp.datepicker('setDate',data.date);
		} else {
			this.dp.datepicker('setDate',null);
		}
		if(_.has(data,'cycle')) {
			$('div.btn-group label').each(function(i,e){
				var lbl = $(e),
					inpt = $('input',$(e));
				lbl.removeClass('active');
				inpt.removeAttr('checked');
				if((inpt.val()*1)==(data*1)){
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
