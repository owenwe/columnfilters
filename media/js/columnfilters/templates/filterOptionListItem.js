// 
CFTEMPLATES.filterOptionListItem = [
	'<li>',
		'<a href="#" data-type="<%= columnData.type %>" data-name="<%= _.has(columnData,"dataColumn")?columnData.dataColumn:_.has(columnData,"data")?columnData.data:columnData.name %>"><%= columnData.label %></a>',
	'</li>'
].join('');