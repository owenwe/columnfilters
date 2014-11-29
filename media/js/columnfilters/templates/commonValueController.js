CFTEMPLATES.commonValueController = [
	'<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">',
		'Select Columns <span class="caret"></span>',
	'</button>',
	'<ul class="dropdown-menu dropdown-menu-sm" role="menu">',
		'<% for(var i in data.columns) { %>',
			'<li class="cf-cvdd-active">',
				'<button type="button" class="btn btn-block text-capitalize " data-name="<%= data.columns[i].name %>" data-type="<%= data.columns[i].type %>">',
					'<span class="glyphicon glyphicon-ok pull-left hidden">',
					'</span> <%= data.columns[i].label %>',
				'</button>',
			'</li>',
		'<% } %>',
	'</ul>'
].join('');