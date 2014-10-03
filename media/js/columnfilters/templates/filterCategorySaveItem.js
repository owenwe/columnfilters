// filterCategory: {name:<string>, glyph:<string>}
CFTEMPLATES.filterCategorySaveItem = '<li data-save-type="<%= filterCategory.name %>">'+
	'<a href="#">'+
		'<span class="badge pull-right">'+
			'<span class="glyphicon <%= filterCategory.glyph %>"></span>'+
		'</span> to <% print(filterCategory.name[0].toUpperCase()+filterCategory.name.substring(1)) %>'+
	'</a>'+
'</li>';