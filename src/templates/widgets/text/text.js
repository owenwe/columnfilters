/**
 * Template for a text input.
 * @memberof $.fn.ColumnFilters
 * @contant {string} TEXT_TEMPLATE
 */
$.fn.ColumnFilters.TEXT_TEMPLATE = [
    '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />'
].join('');

// for future use
$.fn.ColumnFilters.TEXTAREA_TEMPLATE = [
    '<textarea <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %>></textarea>'
].join('');

