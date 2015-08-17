/**
 * Template for from/to number inputs with spinner controls (fuelux spinbox).
 * @memberof $.fn.ColumnFilters
 * @contant {string} NUMBER_BETWEEN_TEMPLATE
 */
$.fn.ColumnFilters.NUMBER_BETWEEN_TEMPLATE = [
    '<div class="form-group">',
        '<div class="spinbox cf-fw-from-date pull-left">',
            '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
            '<div class="spinbox-buttons btn-group btn-group-vertical">',
                '<button class="btn btn-default spinbox-up btn-xs">',
                    '<span class="glyphicon glyphicon-chevron-up"></span><span class="sr-only">Increase</span>',
                '</button>',
                '<button class="btn btn-default spinbox-down btn-xs">',
                    '<span class="glyphicon glyphicon-chevron-down"></span><span class="sr-only">Decrease</span>',
                '</button>',
            '</div>',
        '</div>',
        '<div class="input-group-addon col-sm-1 pull-left"></div>',
        '<div class="spinbox cf-fw-to-date pull-left">',
            '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
            '<div class="spinbox-buttons btn-group btn-group-vertical">',
                '<button class="btn btn-default spinbox-up btn-xs">',
                    '<span class="glyphicon glyphicon-chevron-up"></span><span class="sr-only">Increase</span>',
                '</button>',
                '<button class="btn btn-default spinbox-down btn-xs">',
                    '<span class="glyphicon glyphicon-chevron-down"></span><span class="sr-only">Decrease</span>',
                '</button>',
            '</div>',
        '</div>',
    '</div>'
].join('');

