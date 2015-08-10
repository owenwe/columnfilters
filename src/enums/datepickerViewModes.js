/**
 * Enum for the datepicker <code>minViewMode</code> 
 * configuration option.  You can think of these as the inverse value of the 
 * integer used to set those options.
 * @readonly
 * @memberof $.fn.ColumnFilters
 * @enum {number}
 */
$.fn.ColumnFilters.DatepickerViewModes = {
    
    'DAYS'   : 0,
    
    /** Months within a year. */
    'MONTHS' : 1,
    
    /** Years within a decade. */
    'YEARS'  : 2
};

/**
 * Enum for the datepicker <code>startView</code> configuration option.
 * @readonly
 * @memberof $.fn.ColumnFilters
 * @enum {number}
 */
$.fn.ColumnFilters.DatepickerStartViewModes = {
    /** Days within a month. */
    'MONTH'  : 0,
    
    /** Months within a year. */
    'YEAR'   : 1,
    
    /** Years within a decade. */
    'DECADE' : 2
};

