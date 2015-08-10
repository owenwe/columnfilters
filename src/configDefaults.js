// plugin default configuration values
$.fn.ColumnFilters.defaults = {
     // Attributes applied to the container element created during construction.
    'wrapperAttributes':{
        'class':'columnfilters'
    },
    
    // translates database types to columnfilters widget types
    'DB_TO_CF_TYPES':{
        'string'    : 'text',
        'varchar'   : 'text',
        'tinytext'  : 'text',
        'mediumtext': 'text',
        'text'      : 'text',
        'longtext'  : 'text',
        'num'       : 'number',
        'number'    : 'number',
        'tinyint'   : 'number',
        'smallint'  : 'number',
        'mediumint' : 'number',
        'int'       : 'number',
        'bigint'    : 'number',
        'double'    : 'number',
        'float'     : 'number',
        'decimal'   : 'number',
        'boolean'   : 'boolean',
        'bool'      : 'boolean',
        'date'      : 'date',
        'datetime'  : 'date',
        'timestamp' : 'date',
        'reference' : 'biglist',
        'object'    : 'enum'
    },
    
    // will enable/disable ColumnFilters controls
    'mode':$.fn.ColumnFilters.Modes.DEFAULT,
    
    // this is for the ajax calls that manage the filter categories
    'url':null,
    'ajax':{},
    
    // you can use these to pass in pre-populated filters and filter categories
    'filters':[],
    'filterCategories':[],
    'filterSets':[],
    
    // These would be overridden
    'table':null,
    'columns':[],
    
    // these are the default data type widgets, you can add to or change,
    // but see the documentation on TemplateFilterWidget for the interface
    'dataTypeWidgets':[
        {
            'type':'text', 
            'widgets':[
                new TextEqualsFilterWidget({}),
                new TextSearchFilterWidget({})
            ]
        },
        {
            'type':'number',
            'widgets':[
                new NumberEqualsFilterWidget({}),
                new NumberBetweenFilterWidget({}),
                new NumberListFilterWidget({})
            ]
        },
        {
            'type':'date',
            'widgets':[
                new DateEqualsFilterWidget({}),
                new DateAfterFilterWidget({}),
                new DateBeforeFilterWidget({}),
                new DateBetweenFilterWidget({}),
                new DateListFilterWidget({}),
                new DateMonthFilterWidget({}),
                new DateMonthYearFilterWidget({}),
                new DateYearFilterWidget({}),
            ]
        },
        {
            'type':'boolean',
            'widgets':[
                new BooleanEqualsFilterWidget({})
            ]
        },
        {
            'type':'enum',
            'widgets':[
                new EnumEqualsFilterWidget({})
            ]
        },
        {
            'type':'biglist',
            'widgets':[
                new BiglistEqualsFilterWidget({})
            ]
        }
    ],
    
    // you might need to change these to suite your needs
    'convertBooleanToNumeric':true,
    
    // changing these affects the initial state of things
    
    'columnsControlConfig':{
        // only NORMAL and DISABLED are acceptable
        'mode':$.fn.ColumnFilters.ControlModes.NORMAL,
        
        // the type of column selection to display
        'filterSelectionType':$.fn.ColumnFilters.FilterSelectionTypes.DEFAULT,
        
        // the value of the 'data' property in the 'columns' array that will be selected in the column value select
        'defaultSelectedColumnValue':null,
        
        // the vales of the 'data' property in the 'columns' array that will be selected in the common value select
        'defaultSelectedCommonValues':[]
    },
    'filterFactoryConfig':{
        'mode':$.fn.ColumnFilters.ControlModes.NORMAL
    },
    'filtersContainerConfig':{
        'activeColumnIndex':-1
    }
};

