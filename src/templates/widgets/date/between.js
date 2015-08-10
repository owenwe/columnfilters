/**
 * Template for an input that would want "from" and "to" dates.
 * @memberof $.fn.ColumnFilters
 * @constant {string} DATEPICKER_BETWEEN_TEMPLATE
 */
$.fn.ColumnFilters.DATEPICKER_BETWEEN_TEMPLATE = [
    '<div class="input-daterange input-group date">',
        '<input type="text" <%= _.map(_.omit(config.fromAttributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
        '<span class="input-group-addon">to</span>',
        '<input type="text" <%= _.map(_.omit(config.toAttributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
    '</div>'
].join('');

