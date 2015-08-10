/**
 * Enum for common date formats, typically used in a datepicker control.
 * @readonly
 * @memberof $.fn.ColumnFilters
 * @enum {string}
 */
$.fn.ColumnFilters.DateFormats = {
    /** English - United States */
    'en_us'       : 'm/d/yyyy',
    
    /** English - United Kingdom */
    'en_gb'       : 'dd-mm-yyyy',
    
    /** Chinese */
    'zh_cn'       : 'yyyy.mm.dd',
    
    /** Month and year, e.g. Sep, 1976 */
    'month_year'  : 'MM, yyyy',
    
    /** Only the year */
    'year'        : 'yyyy'
};

