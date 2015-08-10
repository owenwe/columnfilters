/**
 * Template for list item in the options list control.
 * @memberof $.fn.ColumnFilters
 * @constant {string} FILTER_OPTION_LIST_ITEM_TEMPLATE
 */
$.fn.ColumnFilters.FILTER_OPTION_LIST_ITEM_TEMPLATE = [
	'<li>',
		'<a href="#" data-type="<%= columnData.type %>" ',
		            'data-name="<%= _.has(columnData,"dataColumn") ? ',
		                'columnData.dataColumn : ',
		                '_.has(columnData,"data") ? ',
		                    'columnData.data : ',
		                    'columnData.name %>">',
	        '<%= columnData.label %>',
	    '</a>',
	'</li>'
].join('');

