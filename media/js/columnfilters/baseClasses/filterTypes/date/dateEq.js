// Filter Widget Type Implementation Class for Date (Equals)
var VFilterWidgetTypeDateEq = VFilterWidgetType.extend({
	type:'equals',
	dp:null,
	dpConfig:{
		autoclose:true,
		'name':'dpeq',
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
	},
	validate:function() {
		// TODO
	},
	getValue:function() {
		var d = this.dp.datepicker('getDate');
		return {
			'type':this.type,
			'value':isNaN(d.getTime())?null:d
		};
	},
	setValue:function(date) {
		// date should be a date
		if(_.isDate(date)) {
			this.dp.datepicker('setDate',date);
		}
	},
	reset:function() {
		this.dp.datepicker('setDate',null);
		this.dp.datepicker('setEndDate',null);
		this.dp.datepicker('setStartDate',null);
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
	},
	render:function() {
		return this;
	}
});
