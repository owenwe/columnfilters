// Filter Widget Type Implementation Class for Date (Equals)
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
			// here it is
			$('div.btn-group label',this.$el).each(function(i,e){
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
