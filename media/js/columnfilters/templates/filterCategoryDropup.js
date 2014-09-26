CFTEMPLATES.filterCategoryMenu = '<ul class="nav navbar-nav" data-category-name="<%= filterCategory.name %>">'+
	'<li class="dropup btn btn-xs disabled">'+
		'<a href="#" class="dropdown-toggle btn btn-xs" data-toggle="dropdown"><%= filterCategory.name %> '+
			'<span class="badge"></span>'+
			'<span class="caret"></span>'+
		'</a>'+
		'<ul class="dropdown-menu" role="menu"></ul>'+
	'</li>'+
'</ul>';