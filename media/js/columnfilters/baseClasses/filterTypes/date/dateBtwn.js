/**
 * Filter Widget Type Implementation Class for Date (Equals)
 * requires:
 * 		bootstrap-datepicker.js (https://github.com/eternicode/bootstrap-datepicker/)
 * 		moment.js (http://momentjs.com/)
 */
var VFilterWidgetTypeDateBtwn = VFilterWidgetType.extend({
	'version':'1.0.8',
	'type':'between',
	
	'isValid':function() {
		var dFrom = this.model.get('dpFrom').datepicker('getUTCDate'),
			dTo = this.model.get('dpTo').datepicker('getUTCDate'),
			uxfrom = _.isDate(dFrom) ? dFrom.getTime() : NaN,
			uxto = _.isDate(dTo) ? dTo.getTime() : NaN,
			areDatesCheck = !isNaN(uxfrom) && !isNaN(uxto),
			isChronologicalCheck = uxfrom <= uxto;
		return areDatesCheck && isChronologicalCheck;
	},
	
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		this.trigger(	'notify',
						'danger',
						'Date Filter ('+this.type+') Error',
						'A "from" and "to" date must be selected and in chronological order.'
		);
		return false;
	},
	
	'getValueDescription':function() {
		if(this.isValid()) {
			return [
				'is between ',
				moment.utc(this.model.get('dpFrom').datepicker('getUTCDate')).format('M/D/YYYY'),
				' and ',
				moment.utc(this.model.get('dpTo').datepicker('getUTCDate')).format('M/D/YYYY')
			].join('');
		} else {
			return false;
		}
	},
	
	'getValue':function() {		
		if(this.validate()) {
			return {
				'type':this.type,
				'fromDate':this.model.get('dpFrom').datepicker('getUTCDate').getTime(),
				'toDate':this.model.get('dpTo').datepicker('getUTCDate').getTime(),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	'setValue':function(filterValue) {
		// from/toDate can be: 1) an ISO Date string, 2) a Timestamp integer, 3) a javascript Date object
		this.model.get('dpFrom').datepicker('setUTCDate', moment.utc(filterValue.fromDate).toDate());
		this.model.get('dpTo').datepicker('setUTCDate', moment.utc(filterValue.toDate).toDate());
	},
	
	'reset':function() {
		this.model.get('dpFrom').datepicker('update',null);
		this.model.get('dpTo').datepicker('update',null);
	},
	
	'template':_.template([
		'<div class="form-inline">',
			'<div class="form-group">',
				'<div class="input-group input-daterange">',
					'<input type="text" class="form-control date" value="" />',
					'<span  class="input-group-addon">to</span>',
					'<input type="text" class="form-control date" value="" />',
				'</div>',
			'</div>',
		'</div>'
	].join('')),
	
	'initialize':function(options) {
		
		this.model = new Backbone.Model({
			'dpFrom':null,
			'dpTo':null,
			'dpConfig':{
				'autoclose':true,
				'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
			}
		});
		
		this.$el.html(this.template({}));
		$('div.input-daterange', this.$el).datepicker(this.model.get('dpConfig'));
		this.model.set('dpFrom', $('input:first-child', this.$el));
		this.model.set('dpTo', $('input:last-child', this.$el));
	}
});
