/**
 * This template us used to save a new category into a collection.
 * @memberof $.fn.ColumnFilters
 * @constant {string} NEW_CATEGORY_FORM
 */
$.fn.ColumnFilters.NEW_CATEGORY_FORM = [
    '<form class="form-horizontal" role="form" data-save-type="category">',
        '<div class="form-group">',
            '<label class="col-sm-2 control-label">Name</label>',
            '<div class="col-sm-10">',
                '<input type="text" class="form-control" placeholder="Name for this set of filters" autocomplete="off">',
            '</div>',
        '</div>',
    '</form>'
].join('');

