/**
 * The different interactive modes into which the ColumnFilters can be put.
 * @readonly
 * @memberof $.fn.ColumnFilters
 * @enum {number}
 */
$.fn.ColumnFilters.Modes = {
    /** the controls for saving and creating filter sets are not available */
    'DEFAULT':0, 
    
    /** controls for creating/saving filter sets are available */
    'CATEGORY_SETS':1, 
    
    /**
     * the "Data Filters"/"Common Value" toggle buttons and the controls for 
     * creating/saving filter sets are not available
     */
    'NO_TYPES':2, 
    
    /** 
     * the controls for creating/saving filter sets are available, but not the 
     * "Data Filters"/"Common Value" toggle buttons
     */
    'CATEGORIES_NO_TYPES':3
};

