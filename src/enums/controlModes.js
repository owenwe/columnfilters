/**
 * Enum of the different interactive modes various controls can be put.
 * @readonly
 * @memberof $.fn.ColumnFilters
 * @enum {number}
 */
$.fn.ColumnFilters.ControlModes = {
    /** selection type, columns, and operator selects are enabled */
    'NORMAL':0,
    
    /** everything but the operator and widgets is disabled */
    'EDIT':1,
    
    /** everything is disabled */
    'DISABLED':2
};

