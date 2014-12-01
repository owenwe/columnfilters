// Filter Widget Type Implementation Class for Date (Equals)
var VFilterWidgetTypeDateBtwn = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'between',
	dpFrom:null,
	dpStartDate:null,
	dpTo:null,
	dpEndDate:null,
	dpConfig:{
		autoclose:true,
		format:CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
	},
	
	isValid:function() {
		return !isNaN(this.dpFrom.datepicker('getDate').getTime()) && !isNaN(this.dpTo.datepicker('getDate').getTime());
	},
	validate:function() {
		// TODO unset inputs/labels from danger status
		if(this.isValid()) {
			// TODO set inputs/labels to danger status
			return true;
		}
		
		this.trigger('notify', 'danger', 'Date Filter ('+this.type+') Error', 'A to and from date must be selected.');
		return false;
	},
	getValueDescription:function() {
		if(this.isValid()) {
			return [
				'is between ',
				this.dpFrom.datepicker('getDate').toLocaleDateString(),
				' and ',
				this.dpTo.datepicker('getDate').toLocaleDateString()
			].join('');
		} else {
			return false;
		}
	},
	getValue:function() {		
		if(this.validate()) {
			return {
				'type':this.type,
				'fromDate':this.dpFrom.datepicker('getDate'),
				'toDate':this.dpTo.datepicker('getDate'),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		this.dpStartDate = filterValue.fromDate;
		this.dpEndDate = filterValue.toDate;
		this.dpFrom.datepicker('setDate', this.dpStartDate);
		this.dpTo.datepicker('setDate', this.dpEndDate);
		this.dpFrom.datepicker('setEndDate',this.dpEndDate);
		this.dpTo.datepicker('setStartDate',this.dpStartDate);
	},
	reset:function() {
		this.dpStartDate = null;
		this.dpEndDate = null;
		this.dpFrom.datepicker('setDate',null);
		this.dpTo.datepicker('setDate',null);
		this.dpFrom.datepicker('setEndDate',null);
		this.dpTo.datepicker('setStartDate',null);
	},
	
	
	template:_.template(CFTEMPLATES.datepicker4,{variable:'datepicker'}),
	events:{
		'changeDate .dpbtw input:first-child':function(e) {
			this.dpFrom.datepicker('setEndDate',e.date);
			if(e.date) {
				//date is valid
				//does the to-date have a limiter?
				this.dpStartDate = new Date(e.date.valueOf()+86400000);
				this.dpTo.datepicker('setStartDate',this.dpStartDate);
			} else {
				//cleared date, clear dpTo.startDate
				this.dpStartDate = null;
				this.dpTo.datepicker('setStartDate',this.dpStartDate);
			}
			if(isNaN(this.dpTo.datepicker('getDate').getTime())) {
				this.dpTo[0].focus();
			}
		},
		'changeDate .dpbtw input:last-child':function(e) {
			//place date value in text input
			this.dpTo.datepicker('setStartDate',e.date);
			if(e.date) {
				this.dpEndDate = new Date(e.date.valueOf()-86400000);
				this.dpFrom.datepicker('setEndDate',this.dpEndDate);
			} else {
				//cleared date, clear dpFrom.endDate
				this.dpEndDate = null;
				this.dpFrom.datepicker('setEndDate',this.dpEndDate);
			}
			if(isNaN(this.dpFrom.datepicker('getDate').getTime())) {
				this.dpFrom[0].focus();
			}
		},
		'click .test':function(e) {
			console.log(this.dp1.getDate());
			console.log(this.dp2.getDate());
		}
	},
	
	initialize:function(options) {
		this.$el.html(this.template({name:'dpbtw'}));
		$('.dpbtw input',this.$el).datepicker(this.dpConfig);
		this.dpFrom = $('.dpbtw input:first-child',this.$el);
		this.dpTo = $('.dpbtw input:last-child',this.$el);
	},
	render:function() {
		return this;
	}
});
