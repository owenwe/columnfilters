/**
 * Template for a number input with spinner controls (fuelux spinbox).
 * @memberof $.fn.ColumnFilters
 * @contant {string} NUMBER_SPINNER_TEMPLATE
 */
$.fn.ColumnFilters.NUMBER_SPINNER_TEMPLATE = [
    '<div class="spinbox">',
        '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
        '<div class="spinbox-buttons btn-group btn-group-vertical">',
            '<button class="btn btn-default spinbox-up btn-xs">',
                '<span class="glyphicon glyphicon-chevron-up"></span><span class="sr-only">Increase</span>',
            '</button>',
            '<button class="btn btn-default spinbox-down btn-xs">',
                '<span class="glyphicon glyphicon-chevron-down"></span><span class="sr-only">Decrease</span>',
            '</button>',
        '</div>',
    '</div>'
].join('');

