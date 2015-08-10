/**
 * Template for from/to number inputs with spinner controls (fuelux spinbox).
 * @memberof $.fn.ColumnFilters
 * @contant {string} NUMBER_BETWEEN_TEMPLATE
 */
$.fn.ColumnFilters.NUMBER_BETWEEN_TEMPLATE = [
    '<div class="form-group">',
        '<label class="control-label navbar-nav">from: </label>',
        '<div class="spinbox cf-fw-from-date" data-initialize="spinbox">',
            '<input type="text" <%= _.map(_.omit(config.fromAttributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
            '<div class="spinbox-buttons btn-group btn-group-vertical">',
                '<button class="btn btn-default spinbox-up btn-xs">',
                    '<span class="glyphicon glyphicon-chevron-up"></span><span class="sr-only">Increase</span>',
                '</button>',
                '<button class="btn btn-default spinbox-down btn-xs">',
                    '<span class="glyphicon glyphicon-chevron-down"></span><span class="sr-only">Decrease</span>',
                '</button>',
            '</div>',
        '</div>',
    '</div>',
    '<div class="form-group" style="margin:2px 10px"><span class="glyphicon glyphicon-resize-horizontal"></span></div>',
    '<div class="form-group">',
        '<label class="control-label navbar-nav">to: </label>',
        '<div class="spinbox cf-fw-from-date" data-initialize="spinbox">',
            '<input type="text" <%= _.map(_.omit(config.toAttributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
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

