/**
 * Template string for the FilterFactory view.
 * @memberof $.fn.ColumnFilters
 * @constant {string} FILTER_FACTORY_VIEW_TEMPLATE
 * @property {object} config - The template variable.
 * @property {string} config.activeIndex - A value that would match the type 
 * property in one of the objects in the config.dataTypeWidgets array.
 * @property {number} config.activeOperatorIndex - The index value in the 
 * widgets array of the active config.dataTypeWidgets object.
 * @property {DataTypeWidget[]} config.dataTypeWidgets - 
 * An array of objects with "type" and "widgets" properties.
 */
$.fn.ColumnFilters.FILTER_FACTORY_VIEW_TEMPLATE = [
    '<% if(config.activeIndex>-1 && config.activeOperatorIndex>-1) { %>',
        '<%= _.template($.fn.ColumnFilters.WIDGET_OPERATOR_SELECT_TEMPLATE, {"variable":"config"})(config) %>',
    '<% } %>',
    '<div class="cf-data-type-control-container navbar-nav form-group"></div>'
].join('');

