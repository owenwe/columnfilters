/**
 * Template for a date-type input (datepicker).
 * @memberof $.fn.ColumnFilters
 * @constant {string} DATEPICKER_TEMPLATE
 */
$.fn.ColumnFilters.DATEPICKER_TEMPLATE = [
    '<div class="input-group date">',
        '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
        '<span class="input-group-addon">',
            '<span class="glyphicon glyphicon-calendar"></span>',
        '</span>',
    '</div>'
].join('');

