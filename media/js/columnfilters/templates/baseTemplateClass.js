// Dev-Only: templates and template global variable will be included in one file
var CFTEMPLATES = {
	'DATEPICKER_DATE_FORMATS':{
		'en_us':'mm/dd/yyyy',
		'en_gb':'dd-mm-yyyy',
		'zh_cn':'yyyy.mm.dd',
		'month_year':'MM, yyyy',
		'year':'yyyy'
	},
	'DATEPICKER_VIEW_MODES':{
		'DAYS':0,
		'MONTHS':1,
		'YEARS':2
	},
	'DATEPICKER_WEEK_START_DAYS':{
		'SUNDAY':0,
		'MONDAY':1,
		'TUESDAY':2,
		'WEDNESDAY':3,
		'THURSDAY':4,
		'FRIDAY':5,
		'SATURDAY':6
	},
	
	'datepicker':[
		'<div class="input-group date<% _.isString(datepicker.name)?print(" "+datepicker.name):"" %>">',
			'<input type="text" class="form-control date" value="" readonly="readonly" />',
			'<span class="input-group-addon">',
				'<span class="glyphicon glyphicon-calendar"></span>',
			'</span>',
		'</div>'
	].join(''),
	
	'datepickerBetween':[
		'<div class="input-daterange input-group date<% _.isString(datepicker.name)?print(" "+datepicker.name):"" %>">',
			'<input type="text" class="form-control" name="start" readonly="readonly" />',
			'<span class="input-group-addon">to</span>',
			'<input type="text" class="form-control" name="end" readonly="readonly" />',
		'</div>'
	].join('')
	
	
	//[[SCRIPT_INSERT]]//
};