/**
 * Filter Widget Type Implementation Class for Date (Equals)
 * requires:
 * 		bootstrap-datepicker.js (https://github.com/eternicode/bootstrap-datepicker/)
 * 		moment.js (http://momentjs.com/)
 */
var VFilterWidgetTypeDateBtwn = VFilterWidgetType.extend({
	'version':'1.0.3',
	'type':'between',
	'dpFrom':null,
	'dpStartDate':null,
	'dpTo':null,
	'dpEndDate':null,
	'dpConfig':{
		'autoclose':true,
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
	},
	
	'isValid':function() {
		return !isNaN(this.dpFrom.datepicker('getDate').getTime()) && !isNaN(this.dpTo.datepicker('getDate').getTime());
	},
	
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		
		this.trigger('notify', 'danger', 'Date Filter ('+this.type+') Error', 'A to and from date must be selected.');
		return false;
	},
	
	'getValueDescription':function() {
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
	
	'getValue':function() {		
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
	
	'setValue':function(filterValue) {
		// from/toDate can be: 1) an ISO Date string, 2) a Timestamp integer, 3) a javascript Date object
		this.dpStartDate = moment(filterValue.fromDate).toDate();
		this.dpEndDate = moment(filterValue.toDate).toDate();
		
		this.dpFrom.datepicker('setUTCDate', this.dpStartDate);
		this.dpTo.datepicker('setUTCDate', this.dpEndDate);
		this.dpFrom.datepicker('setEndDate',this.dpEndDate);
		this.dpTo.datepicker('setStartDate',this.dpStartDate);
	},
	
	// TODO unless we need to modify this, then remove it
	'processDate':function(dateObj) {
		switch(typeof(dateObj)) {
			case 'object':
				// assume standard javascript date object
				return moment(dateObj).toDate();
				break;
			case 'number':
				return moment(dateObj).toDate();
				break;
			case 'string':
				return moment(dateObj).toDate();
				break;
		}
	},
	
	'reset':function() {
		this.dpStartDate = null;
		this.dpEndDate = null;
		this.dpFrom.datepicker('update',null);
		this.dpTo.datepicker('update',null);
		this.dpFrom.datepicker('setEndDate',null);
		this.dpTo.datepicker('setStartDate',null);
	},
	
	
	'template':_.template(CFTEMPLATES.datepickerBetween,{variable:'datepicker'}),
	'events':{
		// these are supposed to cap the start/end of the other datepicker
		'changeDate .dpbtw input:first-child':function(e) {
			//this.dpFrom.datepicker('setEndDate',e.date);
			if(e.date) {
				//date is valid
				// add a day to the dpStartDate
				this.dpStartDate = new Date(e.date.valueOf()+86400000);
				//limit the to datepicker so it can't pick a date before this selected date
				this.dpTo.datepicker('setStartDate',this.dpStartDate);
			} else {
				//cleared date, clear dpTo.startDate
				this.dpTo.datepicker('setStartDate',this.dpStartDate = null);
			}
		},
		'hide .dpbtw input:first-child':function(e) {
			//show the to-date datepicker if it doesn't have a selected date
			if(isNaN(this.dpTo.datepicker('getDate').getTime())) {
				this.dpTo.datepicker('show');
			}
		},
		
		'changeDate .dpbtw input:last-child':function(e) {
			// limit 
			//this.dpTo.datepicker('setStartDate',e.date);
			if(e.date) {
				// subtract a day from the dpEndDate
				this.dpEndDate = new Date(e.date.valueOf()-86400000);
				// limit the from datepicker so it can't pick a date after this selected date
				this.dpFrom.datepicker('setEndDate',this.dpEndDate);
				//this.dpTo.datepicker('hide');
			} else {
				//cleared date, clear dpFrom.endDate
				this.dpFrom.datepicker('setEndDate',this.dpEndDate = null);
			}
		},
		'hide .dpbtw input:last-child':function(e) {
			//if there is a from date, then just close, otherwise show from datepicker
			if(isNaN(this.dpFrom.datepicker('getDate').getTime())) {
				this.dpFrom.datepicker('show');
			}
		},
	},
	
	'initialize':function(options) {
		this.$el.html(this.template({name:'dpbtw'}));
		$('.dpbtw',this.$el).datepicker(this.dpConfig);
		this.dpFrom = $('.dpbtw input:first-child',this.$el);
		this.dpTo = $('.dpbtw input:last-child',this.$el);
	}
});
