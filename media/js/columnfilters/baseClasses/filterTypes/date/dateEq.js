// Filter Widget Type Implementation Class for Date (Equals)
var VFilterWidgetTypeDateEq = VFilterWidgetType.extend({
	type:'equals',
	dp:null,
	dpConfig:{
		autoclose:true,
		'name':'dpeq',
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
	},
	
	isValid:function() {
		return !isNaN(this.dp.datepicker('getDate').getTime());
	},
	validate:function() {
		// TODO unset inputs/labels from danger status
		if(this.isValid()) {
			// TODO set inputs/labels to danger status
			return true;
		}
		
		console.log('a date must be selected');
		return false;
	},
	getValueDescription:function() {
		if(this.isValid()) {
			return 'is equal to ' + this.dp.datepicker('getDate').toLocaleDateString();
		} else {
			return false;
		}
	},
	getValue:function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':this.dp.datepicker('getDate'),
				'description':this.getValueDescription()
			};
		}
		return false;
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
	}
});
