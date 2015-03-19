/**
 * Filter Widget Type Implementation Class for Date (Equals)
 * requires:
 * 		bootstrap-datepicker.js (https://github.com/eternicode/bootstrap-datepicker/)
 * 		moment.js (http://momentjs.com/)
 */
var VFilterWidgetTypeDateBtwn = VFilterWidgetType.extend({
	'version':'1.0.4',
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
		return !isNaN(this.model.get('dpFrom').datepicker('getDate').getTime()) && !isNaN(this.model.get('dpTo').datepicker('getDate').getTime());
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
				moment(this.model.get('dpFrom').datepicker('getDate')).format('M/D/YYYY'),
				' and ',
				moment(this.model.get('dpTo').datepicker('getDate')).format('M/D/YYYY')
			].join('');
		} else {
			return false;
		}
	},
	
	'getValue':function() {		
		if(this.validate()) {
			return {
				'type':this.type,
				'fromDate':this.model.get('dpFrom').datepicker('getDate'),
				'toDate':this.model.get('dpTo').datepicker('getDate'),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	'setValue':function(filterValue) {
		// from/toDate can be: 1) an ISO Date string, 2) a Timestamp integer, 3) a javascript Date object
		this.dpStartDate = moment(filterValue.fromDate).toDate();
		this.dpEndDate = moment(filterValue.toDate).toDate();
		
		this.model.get('dpFrom').datepicker('setUTCDate', this.dpStartDate);
		this.model.get('dpTo').datepicker('setUTCDate', this.dpEndDate);
		this.model.get('dpFrom').datepicker('setEndDate',this.dpEndDate);
		this.model.get('dpTo').datepicker('setStartDate',this.dpStartDate);
	},
	
	// TODO unless we need to modify this, remove it
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
		this.model.get('dpFrom').datepicker('update',null);
		this.model.get('dpTo').datepicker('update',null);
		this.model.get('dpFrom').datepicker('setEndDate',null);
		this.model.get('dpTo').datepicker('setStartDate',null);
	},
	
	
	'template':_.template(CFTEMPLATES.datepickerBetween,{variable:'datepicker'}),
	'events':{
		// these are supposed to cap the start/end of the other datepicker
		// when the from date changes
		/*'changeDate .dpbtw input:first-child':function(e) {
			if(e.date) {
				//date is valid
				// add a day to the dpStartDate
				this.dpStartDate = new Date(e.timeStamp);
				//limit the to datepicker so it can't pick a date before this selected date
				this.model.get('dpTo').datepicker('setStartDate', this.dpStartDate);
			} else {
				//cleared date, clear dpTo.startDate
				this.model.get('dpTo').datepicker('setStartDate', this.dpStartDate = null);
			}
		},*/
		//'hide .dpbtw input:first-child':function(e) {
			//show the to-date datepicker if it doesn't have a selected date
			//if( this.model.get('dpTo').datepicker('getDate') && isNaN(this.model.get('dpTo').datepicker('getDate').getTime()) ) {
			//	this.model.get('dpTo').datepicker('show');
			//}
		//},
		
		// when the to date changes
		/*'changeDate .dpbtw input:last-child':function(e) {
			// limit
			console.log('dpTo:changeDate');
			if(e.date) {
				console.log('date is something: '+moment(e.timeStamp).format('M/D/YYYY'));
				// subtract a day from the dpEndDate
				this.dpEndDate = new Date(e.timeStamp);
				// limit the from datepicker so it can't pick a date after this selected date
				this.model.get('dpFrom').datepicker('setEndDate', this.dpEndDate);
				//this.dpTo.datepicker('hide');
			} else {
				console.log('date is falsy');
				//cleared date, clear dpFrom.endDate
				this.model.get('dpFrom').datepicker('setEndDate', this.dpEndDate = null);
			}
		}*/
		//'hide .dpbtw input:last-child':function(e) {
			//if there is a from date, then just close, otherwise show from datepicker
			//if( this.model.get('dpFrom').datepicker('getDate') && isNaN(this.model.get('dpFrom').datepicker('getDate').getTime()) ) {
				//this.model.get('dpFrom').datepicker('show');
			//}
		//}
	},
	
	'initialize':function(options) {
		this.$el.html(this.template({name:'dpbtw'}));
		$('.dpbtw',this.$el).datepicker(this.dpConfig);
		
		this.model = new Backbone.Model({
			'dpFrom':$('.dpbtw input:first-child',this.$el),
			'dpTo':$('.dpbtw input:last-child',this.$el)
		});
	}
});
