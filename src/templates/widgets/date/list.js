/**
 * Template for a datepicker and a dropdown populated with values added from the 
 * datepicker.
 * @memberof $.fn.ColumnFilters
 * @contant {string} DATE_LIST_TEMPLATE
 */
$.fn.ColumnFilters.DATE_LIST_TEMPLATE = [
    '<div class="form-group pull-left">',
        '<div class="input-group date">',
            '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
            '<span class="input-group-addon">',
                '<span class="glyphicon glyphicon-calendar"></span>',
            '</span>',
        '</div>',
    '</div>',
    '<div class="col-sm-1"></div>',
    '<div class="form-group pull-left">',
        '<div class="btn-group">',
            '<button type="button" class="btn btn-default btn-sm cf-fw-numberList-btn-add" title="add date">',
                '<span class="glyphicon glyphicon-plus"></span> <span class="badge"><%= config.dates.length %></span>',
            '</button>',
            '<button type="button" class="btn btn-default btn-sm dropdown-toggle<% if(config.dates.length<1) { %> disabled<% } %>" data-toggle="dropdown" aria-expanded="false">',
                '<span class="caret"></span>',
                '<span class="sr-only">Toggle Dropdown</span>',
            '</button>',
            '<ul class="dropdown-menu list-group list-unstyled cf-select-widget-list" role="menu">',
            '<% for(var i=0; i<config.dates.length; i++) { %>',
                '<li class="list-group-item" data-cid="<%= config.dates.at(i).cid %>" style="padding:0 10px">',
                    '<button class="close" data-cid="<%= config.dates.at(i).cid %>"><span class="glyphicon glyphicon-remove btn-sm"></span></button>',
                    '<p class="list-group-item-heading"><%= moment.utc(config.dates.at(i).get("date")).format("M/D/YYYY") %></p>',
                '</li>',
            '<% } %>',
            '</ul>',
        '</div>',
    '</div>'
].join('');

