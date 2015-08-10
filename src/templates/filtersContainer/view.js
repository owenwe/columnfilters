/**
 * Template string for the ColumnFiltersContainer view. The template variable is expected 
 * to have a filters array of filter objects.
 * @memberof $.fn.ColumnFilters
 * @constant {string} FILTERS_CONTAINER_VIEW_TEMPLATE
 * @property {object} config - the template variable
 * @property {Backbone-Collection} config.filters - the filters from the view's 
 * collection ( not passed as .toJSON() )
 * @property {object.<string, Filter>} config.groupedFilters - the filters 
 * grouped by the column property.
 * @property {string} config.activeColumn - the name of the column that should be set 
 * as active when rendered as tabs.
 */
$.fn.ColumnFilters.FILTERS_CONTAINER_VIEW_TEMPLATE = [
    '<% if(config.filters.length) { %>',
    '<div class="cf-column-filters-list-container">',
        '<ul class="nav nav-pills nav-stacked">',
        '<% var i=0; for(var f in config.groupedFilters) { %>',
            '<li role="presentation"<% if(i===config.activeColumnIndex) { %> class="active"<% } %>>',
                '<a class="list-group-item" href="#cf-filters-column-<%= i %>" data-target="#cf-filters-column-<%= i %>" ',
                    'aria-controls="cf-filters-column-<%= i %>" role="pill" data-toggle="pill" data-column="<%= i++ %>">',
                    '<%= config.groupedFilters[f][0].label %> <span class="badge"><%= config.groupedFilters[f].length %></span>',
                '</a>',
            '</li>',
        '<% } %>',
        '</ul>',
    '</div>',
    '<div class="tab-content">',
    '<% var i=0; for(var f in config.groupedFilters) { %>',
        '<div role="tabpanel" class="tab-pane list-group<% if(i===config.activeColumnIndex) { %> active<% } %>" id="cf-filters-column-<%= i++ %>">',
        '<% for(var j in config.groupedFilters[f]) { %>',
            '<a href="#" class="list-group-item" data-filter="<%= config.groupedFilters[f][j].cid %>">',
                '<p class="list-group-item-text">',
                    '<button class="close cf-filter-remove-button hidden" title="remove this filter">',
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="sr-only">Close</span>',
                    '</button>',
                    '<% if(!_.isArray(config.groupedFilters[f][j].column)) { %>',
                    '<button class="close cf-filter-edit-button hidden" title="edit this filter">',
                        '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span><span class="sr-only">Edit</span>',
                    '</button>',
                    '<% } %>',
                    '<span class="label label-default"><%= config.groupedFilters[f][j].filterValue.operator %></span> ',
                    '<% var columnLabel = _.isArray(config.groupedFilters[f][j].column) ? ',
                        '["[",config.groupedFilters[f][j].column.join(", "),"]"].join("") : ',
                        'config.groupedFilters[f][j].column %>',
                    '<%= config.groupedFilters[f][j].table %>.<%= columnLabel %> <%= config.groupedFilters[f][j].filterValue.description %>',
                '</p>',
            '</a>',
        '<% } %>',
        '</div>',
    '<% } %>',
    '</div>',
    '<% } else { %>',
    '<p class="text-center text-muted"><em>There are no filters to display</em></p>',
    '<% } %>'
].join('');

