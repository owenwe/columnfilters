/**
 * Template string for the ColumnSelectionControl view.
 * @memberof $.fn.ColumnFilters
 * @constant {string} COLUMN_SELECTION_CONTROL_VIEW_TEMPLATE
 */
$.fn.ColumnFilters.COLUMN_SELECTION_CONTROL_VIEW_TEMPLATE = [
    '<div class="container-fluid">',
        '<div class="navbar-header">',
            '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#cf-filter-select-tools" aria-expanded="false">',
                '<span class="glyphicon glyphicon-menu-hamburger"></span>',
            '</button>',
        '</div>',
        '<div class="collapse navbar-collapse" id="cf-filter-select-tools">',
            '<form class="navbar-form navbar-left">',
            '<fieldset class="cf-filter-select-tools">',
                '<div class="form-group nav navbar-nav cf-filter-type-select">',
                    '<select class="form-control input-sm" autocomplete="off">',
                        '<option value="<%= $.fn.ColumnFilters.FilterSelectionTypes.DEFAULT %>"',
                            '<% if(config.filterSelectionType==$.fn.ColumnFilters.FilterSelectionTypes.DEFAULT) { %> selected="selected"<% } %>>Filter per Column</option>',
                        '<option value="<%= $.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE %>"',
                            '<% if(config.filterSelectionType==$.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE) { %> selected="selected"<% } %>>Common Filter</option>',
                        '<option value="<%= $.fn.ColumnFilters.FilterSelectionTypes.REFERENCE %>" disabled="disabled"',
                            '<% if(config.defaultSelectionType==$.fn.ColumnFilters.FilterSelectionTypes.REFERENCE) { %> selected="selected"<% } %>>Reference</option>',
                    '</select>',
                '</div>',
                '<div class="form-group nav navbar-nav cf-filter-type-select-column">',
                    '<select class="form-control input-sm" autocomplete="off">',
                        '<% for(var i in config.columns) { %>',
                            '<% if(!_.has(config.columns[i], "cfexclude") || (_.has(config.columns[i], "cfexclude") && !config.columns[i].cfexclude)) { %>',
                                '<option value="<%= config.columns[i].data %>"<% if(config.defaultSelectedColumnValue==config.columns[i].data) { %> selected="selected"<% } %>>',
                                    '<%= config.columns[i].title %>',
                                '</option>',
                            '<% } %>',
                        '<% } %>',
                    '</select>',
                '</div>',
                '<div class="form-group nav navbar-nav cf-filter-type-select-common" style="display:none">',
                    '<select class="form-control input-sm" multiple="multiple" size="4" title="hold the ctrl key to add/remove a selected option" autocomplete="off">',
                        '<% for(var i in config.commonColumns) { %>',
                               '<option value="<%= config.commonColumns[i].data %>" data-type="<%= config.commonColumns[i].type %>"',
                                    '<% if(_.has(config.commonColumns[i], "table")) { %> data-table="<%= config.commonColumns[i].table %>"<% } %>><%= config.commonColumns[i].title %>',
                               '</option>',
                        '<% } %>',
                    '</select>',
                '</div>',
                
                // Filter Factory
                '<div class="cf-filter-factory-placeholder"></div>',
                
                '<div class="form-group btn-toolbar cf-column-control-action-controls" role="toolbar">',
                    '<div class="btn-group" role="group" style="display:none">',
                        '<button type="button" class="btn btn-success btn-sm">Save</button>',
                        '<button type="button" class="btn btn-default btn-sm">Cancel</button>',
                    '</div>',
                    '<button type="button" class="btn btn-default btn-success btn-sm cf-add-column-filter-button" title="add column filter" disabled="disabled">',
                        '<span class="glyphicon glyphicon-plus"></span>',
                    '</button>',
                '</div>',
            '</fieldset>',
            '</form>',
        '</div>',
    '</div>'
].join('');

