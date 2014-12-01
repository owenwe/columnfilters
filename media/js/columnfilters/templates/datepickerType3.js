CFTEMPLATES.datepicker3 = [
	'<div class="input-group date<% _.isString(datepicker.name)?print(" "+datepicker.name):"" %>">',
		'<input type="text" class="form-control date" value="" readonly />',
		'<span class="input-group-addon btn btn-default">',
			'<span class="glyphicon glyphicon-calendar"></span>',
		'</span>',
	'</div>'
].join('');