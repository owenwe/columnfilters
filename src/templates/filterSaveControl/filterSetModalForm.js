/**
 * This template us used to save a new filter set to a category collection.
 * @memberof $.fn.ColumnFilters
 * @constant {string} FILTER_SET_MODAL_FORM
 * @property {object} config - the template object
 * @property {string} config.category - category name
 */
$.fn.ColumnFilters.NEW_FILTER_SET_FORM = [
    '<form class="form-horizontal" role="form" data-save-type="filterset" data-category="<%= config.category %>">',
        '<div class="form-group">',
            '<label class="col-sm-2 control-label">Name</label>',
            '<div class="col-sm-10">',
                '<input type="text" class="form-control" placeholder="Name for this set of filters" autocomplete="off">',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-2 control-label">Description</label>',
            '<div class="col-sm-10">',
                '<textarea class="form-control" rows="3" autocomplete="off"></textarea>',
            '</div>',
        '</div>',
    '</form>'
].join('');

