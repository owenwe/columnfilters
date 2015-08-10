/**
 * Template for a number input with spinner controls (fuelux spinbox) and a 
 * dropdown populated with values added from the number spinbox.
 * @memberof $.fn.ColumnFilters
 * @contant {string} NUMBER_LIST_TEMPLATE
 */
$.fn.ColumnFilters.NUMBER_LIST_TEMPLATE = [
    '<div class="form-group pull-left">',
        '<div class="spinbox" data-initialize="spinbox">',
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
    '</div>',
    '<div class="col-sm-1"></div>',
    '<div class="form-group pull-left">',
        '<div class="btn-group">',
            '<button type="button" class="btn btn-default btn-sm cf-fw-numberList-btn-add" title="add number">',
                '<span class="glyphicon glyphicon-plus"></span> <span class="badge"><%= config.numbers.length %></span>',
            '</button>',
            '<button type="button" class="btn btn-default btn-sm dropdown-toggle<% if(config.numbers.length<1) { %> disabled<% } %>" data-toggle="dropdown" aria-expanded="false">',
                '<span class="caret"></span>',
                '<span class="sr-only">Toggle Dropdown</span>',
            '</button>',
            '<ul class="dropdown-menu list-group list-unstyled cf-select-widget-list" role="menu">',
            '<% for(var i=0; i<config.numbers.length; i++) { %>',
                '<li class="list-group-item" data-cid="<%= config.numbers.at(i).cid %>" style="padding:0 10px">',
                    '<button class="close" data-cid="<%= config.numbers.at(i).cid %>"><span class="glyphicon glyphicon-remove btn-sm"></span></button>',
                    '<p class="list-group-item-heading"><%= config.numbers.at(i).get("number") %></p>',
                '</li>',
            '<% } %>',
            '</ul>',
        '</div>',
    '</div>'
].join('');

