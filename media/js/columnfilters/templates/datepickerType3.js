CFTEMPLATES.datepicker3 = '<div class="input-group date<% _.isString(datepicker.name)?print(" "+datepicker.name):"" %>">'+
	//'<% print(_.has(datepicker,"date")?" data-date=\"datepicker.date\"":"")'+
	//'<% print(_.has(datepicker,"format")?" data-date-format=\"datepicker.format\"":"data-date-format=\"mm/dd/yyyy\"") %>'+
	//'<% print(_.has(datepicker,"viewMode")?" data-date-viewmode=\"+datepicker.viewMode+\"":"") %>'+
	//'<% print(_.has(datepicker,"minViewMode")?" data-date-minviewmode=\"+datepicker.minViewMode+\"":"") %>>'+
	'  <input type="text" class="form-control date" size="16" value="" readonly />'+
	'  <span class="input-group-addon btn btn-default"><span class="glyphicon glyphicon-calendar"></span></span>'+
'</div>';