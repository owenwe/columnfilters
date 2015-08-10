/**
 * Enum of the different selection types for all the columns available. 
 * These can be thought of as the type of filtering criteria for a group of 
 * columns. 
 * @readonly
 * @memberof $.fn.ColumnFilters
 * @enum {number}
 */
$.fn.ColumnFilters.FilterSelectionTypes = {
    /**
     * Column/Type-Based
     * These should translate to AND clauses being appended to the WHERE clause 
     * for the given columns. 
     * i.e. <code>WHERE id>1 AND (column) (filter operand) (filter value)
     */
    'DEFAULT':0,
    
    /**
     * Value/Type-Based
     * This should translate to a reverse IN clause being appended to the WHERE 
     * clause for the given columns.
     * i.e. WHERE id>1 AND {filter value} IN({column1}, {column2}, ...)
     */
    'COMMON_VALUE':1,
    
    /**
     * Reference-Based
     * This is for foreign-key type values
     * @todo implement this
     */
    'REFERENCE':2
};

