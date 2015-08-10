/**
 * Template string for the widget operator select in the FilterFactory view.
 * @memberof $.fn.ColumnFilters
 * @constant {string} WIDGET_OPERATOR_SELECT_TEMPLATE
 * @property {object} config - The template variable.
 * @property {string} config.activeIndex - A value that would match the type 
 * property in one of the objects in the config.dataTypeWidgets array.
 * @property {number} config.activeOperatorIndex - The index value in the 
 * widgets array of the active config.dataTypeWidgets object.
 * @property {DataTypeWidget[]} config.dataTypeWidgets - 
 * An array of objects with "type" and "widgets" properties.
 */
$.fn.ColumnFilters.WIDGET_OPERATOR_SELECT_TEMPLATE = [
    '<select class="cf-widget-operator-select navbar-nav form-control input-sm">',
    '<% for(var i in config.dataTypeWidgets[config.activeIndex].widgets) { %>',
        '<option value="<%= config.dataTypeWidgets[config.activeIndex].widgets[i].getOperator() %>"',
            ' data-index="<%= i %>"',
            '<% if(config.activeOperatorIndex==i) { %> selected="selected"<% } %>>',
            '<%= config.dataTypeWidgets[config.activeIndex].widgets[i].getOperator() %>',
        '</option>',
    '<% } %>',
    '</select>',
].join('');

