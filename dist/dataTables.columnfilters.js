/**
 * ColumnFilters jQuery Plugin
 * @version 1.0.1
 * @author Wes Owen wowen@ccctechcenter.org
 */
(function($){
    'use strict';
    
    // seems like this would be included in the underscore object functions
    _.createKeyValueObject = function(key, value) {
        var r = {};
        r[key] = value;
        return r;
    };
    
    /**
     * A Backbone View extended from Backbone.View.
     * @see http://backbonejs.org/#View-constructor
     * @typedef {Class} Backbone-View
     * @property {Element} el - an element constructed from this instance's tagName, className, id, and attributes properties
     * @property {string} className=undefined - The value of this instance's el class attribute.
     * @property {string} tagName=div - The DOM Element to create for this instance's el.
     * @property {string} id=undefined] - The value of this instance's el id attribute. The id attribute is not created unless this has a value.
     * @property {object} events=undefined] - An object hash used to define event listener functions for the elements within this instance.
     * @property {object} attributes=undefined] - A hash of attributes that will be set as HTML DOM element attributes on the view's el.
     * @property {Backbone.Model} model=undefined - A model this view can access directly as an instance variable.
     * @property {Backbone.Collection} collection - A collection this view can access directly as an instance variable.
     * @property {function} initialize - A function that can be overridden to customize the constructor. Takes an "options" parameter.
     * @property {function} render - A function that can be overridden.
     */
    
    /**
     * An object used in an array and passed inside a configuration object for 
     * the FilterFactory constructor.
     * @typedef {object} DataTypeWidget
     * @property {string} type - the data type e.g. string, number, enum, ...
     * @property {FilterWidget[]} widgets - an array of FilterWidget instances
     */
    
    /**
     * A filter within a filter collection.
     * @typedef {object} Filter
     * @property {string} column - the name of the column or property
     * @property {string} type - the data type this filter applies to
     * @property {string} label - the title of the column this filter applies to
     * @property {string} table - the database or named data map the column of 
     * this filter applies to
     * @property {object} filterValue - an object that will contain the specific 
     * limiting values that represent this filter
     * @property {string} filterValue.operator - the type of comparison this 
     * filter will perform
     * @property {string} filterValue.description - a descriptive phrase explaining 
     * the relationship between the operator and value
     * @property {*} filterValue.value - this will vary depending on the filter 
     * type and operator
     */
    /**
     * Interface for classes that represent a Filter Widget.
     * @interface FilterWidget
     */
    /**
     * Displays this Backbone-View instance.
     * @function FilterWidget#show
     * @return {FilterWidget} This FilterWidget instance
     * 
     */
    /**
     * Hides this Backbone-View instance.
     * @function FilterWidget#hide
     * @return {FilterWidget} This FilterWidget instance
     */
    /**
     * Enables all the interactive controls in this Backbone-View instance.
     * @function FilterWidget#enable
     * @return {FilterWidget} This Backbone-View instance
     */
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function FilterWidget#disable
     * @return {FilterWidget} This Backbone-View instance
     */
    /**
     * Returns an object populated with the values from the interactive controls 
     * within this Backbone-View.
     * @function FilterWidget#get
     * @return {object} The return object will vary depending on the data type 
     * and operator, but there will always be value, description, and operator 
     * properties.
     */
    /**
     * Uses the passed object to populate any internal values and input controls.
     * @function FilterWidget#set
     * @param {object} filterValue - An object that has values for the input 
     * controls in this Backbone-View.
     * @return {FilterWidget} This Backbone-View instance
     */
    /**
     * Sets all the interactive controls within this View's instance to their 
     * default state and value. This function may also change internal values.
     * @function FilterWidget#reset
     * @return {FilterWidget} This Backbone-View instance
     */
    /**
     * Returns the operator value for this FilterWidget instance.
     * @function FilterWidget#getOperator
     * @return {string} The value of the internal operator property.
     */
    /**
     * An event triggered by an "enter" key press while one of the internal inputs
     * has focus.
     * @event FilterWidget#"cf.fw.submit"
     * @property {object} filterValue - the same value as the FilterWidget#get 
     * function would return.
     */
    
    
var ColumnFilters = Backbone.View.extend(
/** @lends ColumnFilters.prototype */
{
    /**
     * Returns an array of the current working filters in JSON format.
     * @function ColumnFilters#getFilters
     * @return {object[]} JSON representation of the filters
     */
    'getFilters':function() {
        return this.collection.toJSON();
    },
    
    /**
     * Used as a shortcut method to "this.model.get('...')"
     * @function ColumnFilters#get
     * @param {string} key - the model key
     * @return {*}
     */
    'get':function(key) {
        return this.model.get(key);
    },
    
    /**
     * A function that returns the version of not just this object, but all the 
     * complex objects that this object manages.
     * @function ColumnFilters#versions
     * @return {object} A JSON object where the keys represent the class or 
     * object and the values are the versions.
     */
    'versions':function() {
        var dtws = this.get('columnControl').model.get('filterFactory').model.get('dataTypeWidgets'),
            dtwTypes = _.groupBy(dtws, 'type');
        
        return {
            'ColumnFilters':this.version,
            'ColumnSelectionControl':this.get('columnControl').version,
            'FilterFactory':this.get('columnControl').model.get('filterFactory').versions(),
            'ColumnFiltersContainer':this.get('filtersContainer').version,
            'FilterSaveControl':this.get('filtersControl').version
        };
    },
    
    
    /**
     * This View's events object. 
     * @protected
     * @type {object}
     * @property {function} filter.button.add.click - Event handler function 
     * when the "Add Filter" button is clicked.
     * @listens ColumnSelectionControl#event:"cc.filter.save"
     */
    'events':{
        // an event triggered when the "add" button has been clicked
        'cc.filter.add':function(e, filter) {
            var newModel = new Backbone.Model(filter);
            newModel.on('change', function(m, o) {
                console.log('model change');
                this.collection.trigger('update');
            }, this);
            this.collection.add(newModel);
        },
        
        // an event triggered after the "save" button has been clicked
        'cc.filter.save':function(e, filter) {
            // hopefully the collection will be updated too
            this.collection.get(filter.cid).set(filter.toJSON());
            this.get('columnControl').changeMode($.fn.ColumnFilters.ControlModes.NORMAL);
            this.get('filtersContainer').enable();
            this.collection.trigger('update');
        },
        
        'fc.filter-remove.click':function(e, cid) {
            this.collection.remove(cid);
        },
        
        'fc.filter-edit.click':function(e, cid) {
            var f = this.collection.get(cid);
            if(f) {
                // load filter into columnControl.filterFactory
                this.get('columnControl').loadFilter(f);
                this.get('columnControl').changeMode($.fn.ColumnFilters.ControlModes.EDIT);
                this.get('filtersContainer').disable();
            }
        },
        
        'cc.filter-cancel.click':function(e) {
            this.get('columnControl').changeMode($.fn.ColumnFilters.ControlModes.NORMAL);
            this.get('filtersContainer').enable();
        }
    },
    
    /**
     * This Backbone View's class values. This view is a Bootstrap panel so this 
     * value reflects the required class names needed for that component.
     * @protected
     * @type {string}
     * @default
     */
    'className':'columnfilters',
    
    /**
     * The main Backbone View used in this plugin.
     * @author Wes Owen wowen@ccctechcenter.org
     * @typedef {Backbone-View} ColumnFilters
     * @class
     * @classdesc This view renders and controls the ColumnFilters jQuery plugin.
     * @version 1.0.2
     * @constructs ColumnFilters
     * @extends Backbone-View
     * @param {object} options - configuration options for this View instance
     * @param {string} [options.url=null] - The url to the web service 
     * for the datatables server-side data.
     */
    'initialize':function(options) {
        this.version = '1.0.2';
        
        // add this view as the context to the ajax object used in the filter 
        // set Backbone.sync request
        options.ajax.context = this;
        
        /**
         * The ColumnFilters view model. This will contain all of the key/value 
         * properties from the options parameter and those listed here.
         * @name model
         * @type {Backbone.Model}
         * @memberof ColumnFilters.prototype
         * @property {Element} container - a link to the DOM element containing 
         * the ColumnFilter instance
         * @property {object[]} columns - an array of column objects
         * @property {Backbone-View} modalForm - 
         * @property {ColumnSelectionControl} columnControl - A control that 
         * manages how columns are selected and how filters are applied to a 
         * column or columns
         * @property {Backbone-View} filtersContainer - A control that displays 
         * and manages the filters added with the columnControl.
         * @property {Backbone-View} filtersControl - A control that manages the 
         * loading and saving of filters
         * @property {Filter} cachedFilter - A filter that is saved prior to 
         * putting this control into edit mode.
         * @property {Backbone-View} notification - todo
         */
        this.model = new Backbone.Model($.extend(_.omit(options, [
            'filters',
            'dataTypeWidgets', 
            'filterFactoryConfig', 
            'columnsControlConfig'
        ]), {'cachedFilter':null}));
        
        // this.collection == filters
        this.collection = new Backbone.Collection(options.filters);
        
        // re-broadcast this event
        this.collection.on('update', function(col, opt) {
            this.trigger('filters.update', col, opt);
            this.$el.trigger('filters.update', [col, opt]);
            
        }, this);
        this.collection.on('reset', function(col, opt) {
            this.trigger('filters.reset', col, opt);
            this.$el.trigger('filters.reset', [col, opt]);
        }, this);
        
        /* 
         * create the controls for the panel header: (filter type selections), 
         * (custom UI), (add button), (filter factory)
         * the columnsControlConfig.mode must only be NORMAL or DISABLED
         */
        if(options.columnsControlConfig.mode===$.fn.ColumnFilters.ControlModes.EDIT) {
            options.columnsControlConfig.mode = $.fn.ColumnFilters.ControlModes.NORMAL;
        }
        
        // create the column control
        this.model.set('columnControl', new ColumnSelectionControl(
            $.extend(options.columnsControlConfig, {
                'columns': _.map(
                    _.reject(options.columns, function(c) {
                        return _.has(c,'cfexclude') && c.cfexclude
                    }),
                    function(c) {
                        if(_.contains(['reference', 'object'], c.type)) {
                            // a table property is required for these types
                            _.extendOwn(c, {'referenceTable':c.table});
                        }
                        _.extendOwn(c, {'table':options.table});
                        return $.extend(c, {
                            'type':this.get('DB_TO_CF_TYPES')[c.type]
                        });
                    },
                    this
                ),
                'filterFactoryConfig':$.extend(options.filterFactoryConfig, {
                    'dataTypeWidgets':options.dataTypeWidgets
                })
        })));
        
        // create the filters container
        this.model.set('filtersContainer', new ColumnFiltersContainer($.extend(
            options.filtersContainerConfig, 
            {'filters':this.collection}
        )));
        
        // create the filters save control
        this.model.set('filtersControl', new FilterSaveControl({
            'mode':options.mode,
            'url':options.url,
            'table':options.table,
            'categories':_.map(options.filterCategories, function(c){
                return {'name':c}
            }),
            'filters':this.collection
        }));
        this.model.get('filtersControl').on('fsc.ajax.error', function(xhr, obj) {
            this.trigger('columnfilters.ajax.error', xhr, obj);
            this.$el.trigger('columnfilters.ajax.error', [xhr, obj]);
        }, this);
        
        this.render();
    },
    
    'render':function() {
        this.$el.empty();
        this.$el.append(
            $('<div />').addClass('panel panel-default').append(
                this.get('columnControl').$el, 
                this.get('filtersContainer').$el, 
                this.get('filtersControl').$el
            )
        );
        return this.$el;
    }
});


/**
 * The ColumnFilters jQuery plugin namespace. Access by using 
 * <code>$.fn.ColumnFilters</code>. To construct, pass in a configuration object 
 * or call <code>ColumnFilters(<em>config</em>)</code> on a jQuery selection.
 * @namespace $.fn.ColumnFilters
 */
$.fn.ColumnFilters = function(config) {
    // variables used in this scope
    var i, j,
        dtw,
        thisCF, 
        isReadonly = false,
        protectedConfig
    ;
     
    // protected configuration values
    // These cannot be overridden or altered prior to running the constructor
    protectedConfig = {
        'container':null,
        'modalForm':null,
        'columnControl':null,
        'filtersContainer':null,
        'filtersControl':null,
        'notification':null
    };
    
    // create the container for the view
    if(this.length && _.isElement(this[0])) {
        this.attr(
            $.fn.ColumnFilters.defaults.wrapperAttributes
        );
        protectedConfig.container = this;
    } else {
        protectedConfig.container = $('<div />').attr(
            $.fn.ColumnFilters.defaults.wrapperAttributes
        );
    }
    
    // combine and save the defaults with the passed in configuration object and 
    // protected configuration options
    // allow for configuration options to be passed with the constructor, but 
    // will need to have some options that can't be overridden
    if(_.has(config, 'dataTypeWidgets') && _.isArray(config.dataTypeWidgets)) {
        for(i in config.dataTypeWidgets) {
            if(_.isObject(config.dataTypeWidgets[i]) && 
                      _.has(config.dataTypeWidgets[i], 'type') && 
                      _.has(config.dataTypeWidgets[i], 'widgets')) {
                dtw = _.findWhere($.fn.ColumnFilters.defaults.dataTypeWidgets, 
                        {'type':config.dataTypeWidgets[i].type});
                if(dtw) {
                    for(j in config.dataTypeWidgets[i].widgets) {
                        dtw.widgets.push(config.dataTypeWidgets[i].widgets[j]);
                    }
                }
            }
        }
    }
    
    $.fn.ColumnFilters.defaults = $.extend(true, 
        $.fn.ColumnFilters.defaults, 
        _.omit(config, ['dataTypeWidgets']),
        protectedConfig
    );
    thisCF = new ColumnFilters($.fn.ColumnFilters.defaults);
    protectedConfig.container.append(thisCF.$el);
    
    // create and return a ColumnFilters object 
    return thisCF;
}


/**
 * Template string for the ColumnSelectionControl view.
 * @memberof $.fn.ColumnFilters
 * @constant {string} COLUMN_SELECTION_CONTROL_VIEW_TEMPLATE
 */
$.fn.ColumnFilters.COLUMN_SELECTION_CONTROL_VIEW_TEMPLATE = [
    '<div class="container-fluid">',
        '<div class="navbar-header">',
            '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#cf-filter-select-tools" aria-expanded="false">',
                '<span class="glyphicon glyphicon-menu-hamburger"></span>',
            '</button>',
        '</div>',
        '<div class="collapse navbar-collapse" id="cf-filter-select-tools">',
            '<form class="navbar-form navbar-left">',
            '<fieldset class="cf-filter-select-tools">',
                '<div class="form-group nav navbar-nav cf-filter-type-select">',
                    '<select class="form-control input-sm" autocomplete="off">',
                        '<option value="<%= $.fn.ColumnFilters.FilterSelectionTypes.DEFAULT %>"',
                            '<% if(config.filterSelectionType==$.fn.ColumnFilters.FilterSelectionTypes.DEFAULT) { %> selected="selected"<% } %>>Filter per Column</option>',
                        '<option value="<%= $.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE %>"',
                            '<% if(config.filterSelectionType==$.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE) { %> selected="selected"<% } %>>Common Filter</option>',
                        '<option value="<%= $.fn.ColumnFilters.FilterSelectionTypes.REFERENCE %>" disabled="disabled"',
                            '<% if(config.defaultSelectionType==$.fn.ColumnFilters.FilterSelectionTypes.REFERENCE) { %> selected="selected"<% } %>>Reference</option>',
                    '</select>',
                '</div>',
                '<div class="form-group nav navbar-nav cf-filter-type-select-column">',
                    '<select class="form-control input-sm" autocomplete="off">',
                        '<% for(var i in config.columns) { %>',
                            '<% if(!_.has(config.columns[i], "cfexclude") || (_.has(config.columns[i], "cfexclude") && !config.columns[i].cfexclude)) { %>',
                                '<option value="<%= config.columns[i].data %>"<% if(config.defaultSelectedColumnValue==config.columns[i].data) { %> selected="selected"<% } %>>',
                                    '<%= config.columns[i].title %>',
                                '</option>',
                            '<% } %>',
                        '<% } %>',
                    '</select>',
                '</div>',
                '<div class="form-group nav navbar-nav cf-filter-type-select-common" style="display:none">',
                    '<select class="form-control input-sm" multiple="multiple" size="4" title="hold the ctrl key to add/remove a selected option" autocomplete="off">',
                        '<% for(var i in config.commonColumns) { %>',
                               '<option value="<%= config.commonColumns[i].data %>" data-type="<%= config.commonColumns[i].type %>"',
                                    '<% if(_.has(config.commonColumns[i], "table")) { %> data-table="<%= config.commonColumns[i].table %>"<% } %>><%= config.commonColumns[i].title %>',
                               '</option>',
                        '<% } %>',
                    '</select>',
                '</div>',
                
                // Filter Factory
                '<div class="cf-filter-factory-placeholder"></div>',
                
                '<div class="form-group btn-toolbar cf-column-control-action-controls" role="toolbar">',
                    '<div class="btn-group" role="group" style="display:none">',
                        '<button type="button" class="btn btn-success btn-sm">Save</button>',
                        '<button type="button" class="btn btn-default btn-sm">Cancel</button>',
                    '</div>',
                    '<button type="button" class="btn btn-default btn-success btn-sm cf-add-column-filter-button" title="add column filter" disabled="disabled">',
                        '<span class="glyphicon glyphicon-plus"></span>',
                    '</button>',
                '</div>',
            '</fieldset>',
            '</form>',
        '</div>',
    '</div>'
].join('');


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


/**
 * Template string for the ColumnFiltersContainer view. The template variable is expected 
 * to have a filters array of filter objects.
 * @memberof $.fn.ColumnFilters
 * @constant {string} FILTERS_CONTAINER_VIEW_TEMPLATE
 * @property {object} config - the template variable
 * @property {Backbone-Collection} config.filters - the filters from the view's 
 * collection ( not passed as .toJSON() )
 * @property {object.<string, Filter>} config.groupedFilters - the filters 
 * grouped by the column property.
 * @property {string} config.activeColumn - the name of the column that should be set 
 * as active when rendered as tabs.
 */
$.fn.ColumnFilters.FILTERS_CONTAINER_VIEW_TEMPLATE = [
    '<% if(config.filters.length) { %>',
    '<div class="cf-column-filters-list-container">',
        '<ul class="nav nav-pills nav-stacked">',
        '<% var i=0; for(var f in config.groupedFilters) { %>',
            '<li role="presentation"<% if(i===config.activeColumnIndex) { %> class="active"<% } %>>',
                '<a class="list-group-item" href="#cf-filters-column-<%= i %>" data-target="#cf-filters-column-<%= i %>" ',
                    'aria-controls="cf-filters-column-<%= i %>" role="pill" data-toggle="pill" data-column="<%= i++ %>">',
                    '<%= config.groupedFilters[f][0].label %> <span class="badge"><%= config.groupedFilters[f].length %></span>',
                '</a>',
            '</li>',
        '<% } %>',
        '</ul>',
    '</div>',
    '<div class="tab-content">',
    '<% var i=0; for(var f in config.groupedFilters) { %>',
        '<div role="tabpanel" class="tab-pane list-group<% if(i===config.activeColumnIndex) { %> active<% } %>" id="cf-filters-column-<%= i++ %>">',
        '<% for(var j in config.groupedFilters[f]) { %>',
            '<a href="#" class="list-group-item" data-filter="<%= config.groupedFilters[f][j].cid %>">',
                '<p class="list-group-item-text">',
                    '<button class="close cf-filter-remove-button hidden" title="remove this filter">',
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="sr-only">Close</span>',
                    '</button>',
                    '<% if(!_.isArray(config.groupedFilters[f][j].column)) { %>',
                    '<button class="close cf-filter-edit-button hidden" title="edit this filter">',
                        '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span><span class="sr-only">Edit</span>',
                    '</button>',
                    '<% } %>',
                    '<span class="label label-default"><%= config.groupedFilters[f][j].filterValue.operator %></span> ',
                    '<% var columnLabel = _.isArray(config.groupedFilters[f][j].column) ? ',
                        '["[",config.groupedFilters[f][j].column.join(", "),"]"].join("") : ',
                        'config.groupedFilters[f][j].column %>',
                    '<%= config.groupedFilters[f][j].table %>.<%= columnLabel %> <%= config.groupedFilters[f][j].filterValue.description %>',
                '</p>',
            '</a>',
        '<% } %>',
        '</div>',
    '<% } %>',
    '</div>',
    '<% } else { %>',
    '<p class="text-center text-muted"><em>There are no filters to display</em></p>',
    '<% } %>'
].join('');


/**
 * This template contains elements for the footer navigation control. This 
 * template is only rendered in CATEGORY_SETS and CATEGORIES_NO_TYPES modes.
 * @memberof $.fn.ColumnFilters
 * @constant {string} DATA_FILTERS_CONTROL_FOOTER_TEMPLATE
 * @property {object} config - the template object
 * @property {object[]} config.filters - 
 * @property {object[]} config.categories - 
 * @property {object[]} config.filtersets - 
 */
$.fn.ColumnFilters.FILTER_SAVE_CONTROL_VIEW_TEMPLATE = [
    '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="save category or filter set" aria-hidden="true">',
        '<div class="modal-dialog modal-lg">',
            '<div class="modal-content">',
                '<div class="modal-header">',
                    '<button type="button" class="close" data-dismiss="modal">',
                        '<span aria-hidden="true">&times;</span>',
                        '<span class="sr-only">Cancel</span>',
                    '</button>',
                    '<h4 class="modal-title"></h4>',
                '</div>',
                '<div class="modal-body"></div>',
                '<div class="modal-footer">',
                    '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>',
                    '<button type="button" class="btn btn-primary" data-save-type="category">Save</button>',
                '</div>',
            '</div>',
        '</div>',
    '</div>',
	'<div class="container-fluid">',
	    '<div class="navbar-header">',
	        '<button class="navbar-toggle" data-target="#cf-filter-save-controls" data-toggle="collapse" type="button" aria-expanded="true">',
	            '<span class="glyphicon glyphicon-menu-hamburger"></span>',
	        '</button>',
	    '</div>',
		'<div id="cf-filter-save-controls" class="collapse navbar-collapse" aria-expanded="true">',
		    '<form class="navbar-form navbar-left">',
		        '<div class="form-group nav navbar-nav cf-fsc-save-filterset-buttongroup"<% if( config.controlMode!==$.fn.ColumnFilters.ControlModes.EDIT) { %> style="display:none"<% } %>>',
    		        '<fieldset>',
            		    '<div class="btn-group" role="group">',
            			    '<button type="button" class="btn btn-default btn-xs">Cancel</button>',
            			    '<button type="button" class="btn btn-success btn-xs">Done</button>',
            			'</div>',
            		'</fieldset>',
            	'</div>',
                '<% for(var i in config.categories) { ',
                'var hasFilters = _.has(config.filtersets, config.categories[i].name), ',
                    'filterset = hasFilters ? config.filtersets[config.categories[i].name] : false; %>',
                '<ul class="nav navbar-nav" data-category-id="<%= config.categories[i].cid %>">',
                    '<li class="dropup btn btn-xs<% if(!hasFilters) { %> disabled<% } %>">',
                        '<a class="dropdown-toggle btn btn-xs<% if( config.controlMode===$.fn.ColumnFilters.ControlModes.EDIT) { %> disabled<% } %>" data-toggle="dropdown" href="#" aria-expanded="false">',
                            '<%= config.categories[i].name %> ',
                            '<% if(hasFilters) { %>',
                            '<span class="badge"><%= filterset.length %></span>',
                            '<% } %>',
                        '</a>',
                        '<% if(hasFilters) { %>',
                        '<ul class="dropdown-menu list-group cf-fsc-filter-set-menu" role="menu"><% for(var j in filterset) { %>',
                            '<li class="list-group-item">',
                                '<button type="button" class="close cf-fsc-filter-set-edit-button" title="edit this filter set" data-id="<%= filterset[j].cid %>">',
                                    '<span class="glyphicon glyphicon-cog btn-sm"></span>',
                                '</button>',
                                '<button type="button" class="close cf-fsc-filter-set-remove-button" title="remove this filter set" data-id="<%= filterset[j].cid %>">',
                                    '<span class="glyphicon glyphicon-remove btn-sm"></span>',
                                '</button>',
                                '<h4 class="list-group-item-heading" title="load filters from this filter set">',
                                    '<a href="#" data-id="<%= filterset[j].cid %>"><%= filterset[j].name %></a>',
                                '</h4>',
                                '<p class="list-group-item-text"><%= filterset[j].description %></p>',
                            '</li>',
                        '<% } %></ul>',
                        '<% } %>',
                    '</li>',
                '</ul>',
                '<% } %>',
            	
        	'</form>',
        	'<form class="navbar-form navbar-right">',
        	    '<div class="form-group nav navbar-nav cf-fsc-clear-filterset-button">',
        		    '<button class="btn btn-danger btn-xs" type="button" title="clear all working filters"',
        		        '<% if(config.filters.length<1 || config.controlMode===$.fn.ColumnFilters.ControlModes.EDIT) { %> disabled="disabled"<% } %>',
        		    '>',
        		        '<span class="glyphicon glyphicon-remove"></span>',
        		    '</button>',
            	'</div>',
            	'<div class="col-sm-1"></div>',
            	'<div class="form-group nav navbar-nav cf-fsc-filter-category-menu">',
            		'<fieldset<% if(config.filters.length<1 || config.controlMode===$.fn.ColumnFilters.ControlModes.EDIT) { %> disabled="disabled"<% } %>>',
                        '<ul style="margin-bottom:0;padding-left:0">',
                            '<li class="dropup cf-save-filter-list-item" title="save">',
                                '<a href="#" class="dropdown-toggle btn btn-primary btn-xs" data-toggle="dropdown">',
                                    '<span class="glyphicon glyphicon-floppy-disk"></span>',
                                    '<span class="caret"></span>',
                                '</a>',
                                '<ul class="dropdown-menu" role="menu">',
                                    '<li data-category-index="0">',
                                        '<a href="#">',
                                            '<span class="badge pull-right">',
                                                '<span class="glyphicon glyphicon-plus"></span>',
                                            '</span> new category',
                                        '</a>',
                                    '</li>',
                                    '<% for(var i in config.categories) { %>',
                                    '<li data-category-index="<%= config.categories[i].cid %>">',
                                        '<a href="#">',
                                            '<span class="badge pull-right">',
                                                '<span class="glyphicon glyphicon-filter"></span>',
                                            '</span> <%= config.categories[i].name %>',
                                        '</a>',
                                    '</li>',
                                    '<% } %>',
                                '</ul>',
                            '</li>',
                        '</ul>',
                    '</fieldset>',
                '</div>',
			'</form>',
		'</div>',
	'</div>'
].join('');


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


/**
 * Template for a text input.
 * @memberof $.fn.ColumnFilters
 * @contant {string} TEXT_TEMPLATE
 */
$.fn.ColumnFilters.TEXT_TEMPLATE = [
    '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />'
].join('');

// for future use
$.fn.ColumnFilters.TEXTAREA_TEMPLATE = [
    '<textarea <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %>></textarea>'
].join('');


/**
 * Template for a number input with spinner controls (fuelux spinbox).
 * @memberof $.fn.ColumnFilters
 * @contant {string} NUMBER_SPINNER_TEMPLATE
 */
$.fn.ColumnFilters.NUMBER_SPINNER_TEMPLATE = [
    '<div class="spinbox">',
        '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
        '<div class="spinbox-buttons btn-group btn-group-vertical">',
            '<button class="btn btn-default spinbox-up btn-xs">',
                '<span class="glyphicon glyphicon-chevron-up"></span><span class="sr-only">Increase</span>',
            '</button>',
            '<button class="btn btn-default spinbox-down btn-xs">',
                '<span class="glyphicon glyphicon-chevron-down"></span><span class="sr-only">Decrease</span>',
            '</button>',
        '</div>',
    '</div>'
].join('');


/**
 * Template for from/to number inputs with spinner controls (fuelux spinbox).
 * @memberof $.fn.ColumnFilters
 * @contant {string} NUMBER_BETWEEN_TEMPLATE
 */
$.fn.ColumnFilters.NUMBER_BETWEEN_TEMPLATE = [
    '<div class="form-group">',
        '<div class="spinbox cf-fw-from-date pull-left">',
            '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
            '<div class="spinbox-buttons btn-group btn-group-vertical">',
                '<button class="btn btn-default spinbox-up btn-xs">',
                    '<span class="glyphicon glyphicon-chevron-up"></span><span class="sr-only">Increase</span>',
                '</button>',
                '<button class="btn btn-default spinbox-down btn-xs">',
                    '<span class="glyphicon glyphicon-chevron-down"></span><span class="sr-only">Decrease</span>',
                '</button>',
            '</div>',
        '</div>',
        '<div class="input-group-addon col-sm-1 pull-left"></div>',
        '<div class="spinbox cf-fw-to-date pull-left">',
            '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
            '<div class="spinbox-buttons btn-group btn-group-vertical">',
                '<button class="btn btn-default spinbox-up btn-xs">',
                    '<span class="glyphicon glyphicon-chevron-up"></span><span class="sr-only">Increase</span>',
                '</button>',
                '<button class="btn btn-default spinbox-down btn-xs">',
                    '<span class="glyphicon glyphicon-chevron-down"></span><span class="sr-only">Decrease</span>',
                '</button>',
            '</div>',
        '</div>',
    '</div>'
].join('');


/**
 * Template for a number input with spinner controls (fuelux spinbox) and a 
 * dropdown populated with values added from the number spinbox.
 * @memberof $.fn.ColumnFilters
 * @contant {string} NUMBER_LIST_TEMPLATE
 */
$.fn.ColumnFilters.NUMBER_LIST_TEMPLATE = [
    '<div class="form-group pull-left">',
        '<div class="spinbox">',
            '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
            '<div class="spinbox-buttons btn-group btn-group-vertical">',
                '<button class="btn btn-default spinbox-up btn-xs">',
                    '<span class="glyphicon glyphicon-chevron-up"></span><span class="sr-only">Increase</span>',
                '</button>',
                '<button class="btn btn-default spinbox-down btn-xs">',
                    '<span class="glyphicon glyphicon-chevron-down"></span><span class="sr-only">Decrease</span>',
                '</button>',
            '</div>',
        '</div>',
    '</div>',
    '<div class="col-sm-1"></div>',
    '<div class="form-group pull-left">',
        '<div class="btn-group">',
            '<button type="button" class="btn btn-default btn-sm cf-fw-numberList-btn-add" title="add number">',
                '<span class="glyphicon glyphicon-plus"></span> <span class="badge"><%= config.numbers.length %></span>',
            '</button>',
            '<button type="button" class="btn btn-default btn-sm dropdown-toggle<% if(config.numbers.length<1) { %> disabled<% } %>" data-toggle="dropdown" aria-expanded="false">',
                '<span class="caret"></span>',
                '<span class="sr-only">Toggle Dropdown</span>',
            '</button>',
            '<ul class="dropdown-menu list-group list-unstyled cf-select-widget-list" role="menu">',
            '<% for(var i=0; i<config.numbers.length; i++) { %>',
                '<li class="list-group-item" data-cid="<%= config.numbers.at(i).cid %>" style="padding:0 10px">',
                    '<button class="close" data-cid="<%= config.numbers.at(i).cid %>"><span class="glyphicon glyphicon-remove btn-sm"></span></button>',
                    '<p class="list-group-item-heading"><%= config.numbers.at(i).get("number") %></p>',
                '</li>',
            '<% } %>',
            '</ul>',
        '</div>',
    '</div>'
].join('');


/**
 * Template for a date-type input (datepicker).
 * @memberof $.fn.ColumnFilters
 * @constant {string} DATEPICKER_TEMPLATE
 */
$.fn.ColumnFilters.DATEPICKER_TEMPLATE = [
    '<div class="input-group date">',
        '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
        '<span class="input-group-addon">',
            '<span class="glyphicon glyphicon-calendar"></span>',
        '</span>',
    '</div>'
].join('');


/**
 * Template for an input that would want "from" and "to" dates.
 * @memberof $.fn.ColumnFilters
 * @constant {string} DATEPICKER_BETWEEN_TEMPLATE
 */
$.fn.ColumnFilters.DATEPICKER_BETWEEN_TEMPLATE = [
    '<div class="input-daterange input-group date">',
        '<input type="text" <%= _.map(_.omit(config.fromAttributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
        '<span class="input-group-addon">to</span>',
        '<input type="text" <%= _.map(_.omit(config.toAttributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
    '</div>'
].join('');


/**
 * Template for a datepicker and a dropdown populated with values added from the 
 * datepicker.
 * @memberof $.fn.ColumnFilters
 * @contant {string} DATE_LIST_TEMPLATE
 */
$.fn.ColumnFilters.DATE_LIST_TEMPLATE = [
    '<div class="form-group pull-left">',
        '<div class="input-group date">',
            '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
            '<span class="input-group-addon">',
                '<span class="glyphicon glyphicon-calendar"></span>',
            '</span>',
        '</div>',
    '</div>',
    '<div class="col-sm-1"></div>',
    '<div class="form-group pull-left">',
        '<div class="btn-group">',
            '<button type="button" class="btn btn-default btn-sm cf-fw-numberList-btn-add" title="add date">',
                '<span class="glyphicon glyphicon-plus"></span> <span class="badge"><%= config.dates.length %></span>',
            '</button>',
            '<button type="button" class="btn btn-default btn-sm dropdown-toggle<% if(config.dates.length<1) { %> disabled<% } %>" data-toggle="dropdown" aria-expanded="false">',
                '<span class="caret"></span>',
                '<span class="sr-only">Toggle Dropdown</span>',
            '</button>',
            '<ul class="dropdown-menu list-group list-unstyled cf-select-widget-list" role="menu">',
            '<% for(var i=0; i<config.dates.length; i++) { %>',
                '<li class="list-group-item" data-cid="<%= config.dates.at(i).cid %>" style="padding:0 10px">',
                    '<button class="close" data-cid="<%= config.dates.at(i).cid %>"><span class="glyphicon glyphicon-remove btn-sm"></span></button>',
                    '<p class="list-group-item-heading"><%= moment.utc(config.dates.at(i).get("date")).format("M/D/YYYY") %></p>',
                '</li>',
            '<% } %>',
            '</ul>',
        '</div>',
    '</div>'
].join('');


var ColumnSelectionControl = Backbone.View.extend(
/** @lends ColumnSelectionControl.prototype */
{
    /**
     * Enables user interface controls
     * @function ColumnSelectionControl#enable
     * @return ColumnSelectionControl
     */
    'enable':function() {
        // elements to disable: 
        $('fieldset.cf-filter-select-tools', this.$el).removeAttr('disabled', 'disabled');
        return this;
    },
    
    /**
     * Disabled user interface controls
     * @function ColumnSelectionControl#disable
     * @return ColumnSelectionControl
     */
    'disable':function() {
        $('fieldset.cf-filter-select-tools', this.$el).attr('disabled', 'disabled');
        return this;
    },
    
    /**
     * Displays the appropriate controls for the type of selection and sets the 
     * "activeColumn" model property if there are selected options.
     * @function ColumnSelectionControl#displayColumnSelectControl
     * @param {string} selectionType - the type of selection column/common
     * @return ColumnSelectionControl
     */
    'displayColumnSelectControl':function(selectionType) {
        var selections, selection, selectedType;
        this.model.set('filterSelectionType', selectionType);
        switch(this.model.get('filterSelectionType')) {
            // 
            case $.fn.ColumnFilters.FilterSelectionTypes.DEFAULT:
                $('div.cf-filter-type-select-common', this.$el).hide();
                $('div.cf-filter-type-select-column', this.$el).show();
                this.model.set('activeColumn', _.findWhere(
                    this.model.get('columns'), {
                        'data':$('div.cf-filter-type-select-column select', this.$el).val()
                    }
                ));
                if(this.model.get('activeColumn')) {
                    this.showFilterType(this.model.get('activeColumn').type);
                }
                break;
            // 
            case $.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE:
                $('div.cf-filter-type-select-column', this.$el).hide();
                $('div.cf-filter-type-select-common', this.$el).show();
                // selections is an array of column.data values
                selections = $('div.cf-filter-type-select-common select', this.$el).val();
                if(selections && selections.length) {
                    selection = _.findWhere(this.model.get('columns'), {'data':selections[0]});
                    if(selection) {
                        this.showFilterType(selection.type);
                        // also set active Column
                        this.model.set(
                            'activeColumn', 
                            _.filter(this.model.get('columns'), function(c){
                                return _.contains(selections, c.data)
                            }, this));
                    } else {
                        // disable the add button
                        $('button.cf-add-column-filter-button', this.$el).attr('disabled', 'disabled');
                    }
                } else {
                    // disable the add button and hide the filter factory
                    $('button.cf-add-column-filter-button', this.$el).attr('disabled', 'disabled');
                    this.model.get('filterFactory').reset().hide();//.reset()
                }
                break;
            // 
            case 'reference':
                $('div.cf-filter-type-select-common', this.$el).hide();
                $('div.cf-filter-type-select-column', this.$el).hide();
                break;
        }
        return this;
    },
    
    /**
     * Uses the parameters to enable/disable the options in the common value 
     * select form element.
     * @function ColumnSelectionControl#enableColumnsByType
     * @param {string[]} columnData - an array of values that will match the 
     * .data property in the list of columns
     * @param {string} type - the type value of the option(s) selected
     * @return ColumnSelectionControl
     */
    'enableColumnsByType':function(columnData, type) {
        if(columnData) {
            $('button.cf-add-column-filter-button', this.$el).removeAttr('disabled');
            var selectedColumns = _.filter(this.model.get('commonColumns'), 
                function(c) {
                    return _.contains(columnData, c.data)
                }, this);
            $('option', $('div.cf-filter-type-select-common select', this.$el)).each(function(i, e) {
                if($(e).data('type')!==type) {
                    $(e).attr('disabled', 'disabled').addClass('disabled');
                } else {
                    // same type, but not the same table (for enum and biglist)
                    if(_.contains(['biglist','enum'], $(e).data('type'))) {
                        // does this option have the same table value as the currently selected options?
                        if(_.contains(_.pluck(selectedColumns, 'table'), $(e).data('table'))) {
                            $(e).removeAttr('disabled').removeClass('disabled');
                        } else {
                            $(e).attr('disabled', 'disabled').addClass('disabled');
                        }
                    } else {
                        $(e).removeAttr('disabled').removeClass('disabled');
                    }
                }
            });
            // set activeColumn
            this.model.set(
                'activeColumn', 
                _.filter(this.model.get('columns'), function(c){
                    return _.contains(columnData, c.data)
                }, this)
            );
            this.showFilterType(type);
        } else {
            $('option', $('div.cf-filter-type-select-common select', this.$el)).removeAttr('disabled').removeClass('disabled');
            $('button.cf-add-column-filter-button', this.$el).attr('disabled', 'disabled');
            this.model.set('activeColumn', null);
            this.model.get('filterFactory').reset().hide();
        }
        return this;
    },
    
    /**
     * Prompts the filter factory to display the filter tool for the supplied type
     * @function ColumnSelectionControl#showFilterType
     * @param {string} type - the data type from the columns array
     * @param {string} [operator=undefined] - the filter type operator to display
     * @return ColumnSelectionControl
     */
    'showFilterType':function(type, operator) {
        var at = this.model.get('filterFactory').activeType(),
            aw = this.model.get('filterFactory').activeType(type, operator);
        if(aw) {
            $('button.cf-add-column-filter-button', this.$el).removeAttr('disabled');
            // inform filterFactory about special filter types
            switch(type) {
                case 'number':
                    this.model.get('filterFactory').configureNumberWidget(
                        this.model.get('activeColumn').data,
                        operator
                    );
                    break;
                case 'boolean':
                    this.model.get('filterFactory').configureBooleanWidget(
                        this.model.get('activeColumn').data
                    );
                    break;
                case 'enum':
                    this.model.get('filterFactory').configureEnumWidget(
                        this.model.get('activeColumn').referenceTable,
                        this.model.get('activeColumn').data
                    );
                    break;
                case 'biglist':
                    this.model.get('filterFactory').configureBiglistWidget(
                        this.model.get('activeColumn').referenceTable,
                        this.model.get('activeColumn').data
                    );
                    break;
            }
            this.model.get('filterFactory').show();
        } else {
            this.model.get('filterFactory').hide();
        }
        return this;
    },
    
    /**
     * Returns the column name(s) of the currently active column(s) in one of 
     * the select elements, or false if an option is not selected.
     * @function ColumnSelectionControl#activeColumn
     * @return {string|string[]|false}
     * @todo add a parameter to implement the ability to set the activeColumn 
     * and the interactive controls
     */
    'activeColumn':function() {
        var ac = this.model.get('activeColumn');
        if(ac) {
            switch(this.model.get('filterSelectionType')) {
                case $.fn.ColumnFilters.FilterSelectionTypes.DEFAULT:
                    return ac.data;
                    break;
                case $.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE:
                    return _.pluck(ac, 'data');
                    break;
            }
        } else {
            return false;
        }
    },
    
    /**
     * Returns the column title(s) of the currently active column(s) in one of 
     * the select elements, or false if an option is not selected. 
     * @function ColumnSelectionControl#activeLabel
     * @return {string|string[]|false}
     */
    'activeLabel':function() {
        var ac = this.model.get('activeColumn');
        if(ac) {
            switch(this.model.get('filterSelectionType')) {
                case $.fn.ColumnFilters.FilterSelectionTypes.DEFAULT:
                    return ac.title;
                    break;
                case $.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE:
                    return _.pluck(ac, 'title');
                    break;
            }
        } else {
            return false;
        }
    },
    
    /**
     * Applies the values from the passed filter into the filter factory control.
     * This is only for the column type control (for now).
     * @function ColumnSelectionControl#loadFilter
     * @param {Filter} filter
     * @return ColumnSelectionControl
     * @todo implement a way to handle common type control filters
     */
    'loadFilter':function(filter) {
        var foundModel = _.findWhere(
            this.model.get('columns'), {'data':filter.get('column')}
        );
        if(foundModel) {
            this.model.set('activeColumn', foundModel);
            $('div.cf-filter-type-select-column select', this.$el).val(foundModel.data);
            this.showFilterType(
                filter.get('type'), 
                filter.get('filterValue').operator
            ).model.get('filterFactory').loadFilter(filter);
            this.model.set('cachedFilter', filter);
        }
    },
    
    /**
     * Changes the mode of this instance.
     * @function ColumnSelectionControl#changeMode
     * @param {number} newMode - An enum value from ControlModes, if the value 
     * passed is the same as the current mode value nothing will happen.
     * @return {ColumnSelectionControl}
     */
    'changeMode':function(newMode) {
        if(_.isFinite(newMode) && this.model.get('mode')!==_.identity(newMode*1)) {
            this.model.set('mode', newMode*1);
        }
        return this;
    },
    
    'modeChangeHandler':function(m, v, options) {
        switch(this.model.get('mode')) {
            case $.fn.ColumnFilters.ControlModes.NORMAL:
                // enable stuff
                this.enable();
                $([
                   'div.cf-filter-type-select select',
                   'div.cf-filter-type-select-column select',
                   'div.cf-filter-type-select-common select',
                   'button.cf-add-column-filter-button'
               ].join(', '), this.$el).removeAttr('disabled');
                $('button.cf-add-column-filter-button', this.$el).show();
                $('div.cf-column-control-action-controls div.btn-group', this.$el).hide();
                break;
            case $.fn.ColumnFilters.ControlModes.EDIT:
                // disable everything but the operator select and widget
                $([
                   'div.cf-filter-type-select select',
                   'div.cf-filter-type-select-column select',
                   'div.cf-filter-type-select-common select',
                   'button.cf-add-column-filter-button'
               ].join(', '), this.$el).attr('disabled', 'disabled');
                $('button.cf-add-column-filter-button', this.$el).hide();
                $('div.cf-column-control-action-controls div.btn-group', this.$el).show();
                break;
            case $.fn.ColumnFilters.ControlModes.DISABLED:
                // disable everything
                this.disable();
                break;
        }
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @protected
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.COLUMN_SELECTION_CONTROL_VIEW_TEMPLATE, {'variable':'config'}),
    
     
    /**
     * 
     * @protected
     * @readonly
     * @namespace events
     * @memberof ColumnSelectionControl
     */
    'events':{
        /**
         * Change event for the filter type select
         * @event ColumnSelectionControl.events#"div.cf-filter-type-select select":change
         */
        /**
         * Handles when the filter type select triggers a change
         * @function ColumnSelectionControl.events#"div.cf-filter-type-select select":change
         * @param {object} e - the event object
         * @listens ColumnSelectionControl.events#"div.cf-filter-type-select select":change
         */
        'change div.cf-filter-type-select select':function(e) {
            this.displayColumnSelectControl($(e.currentTarget).val()*1);
        },
        
        /**
         * Change event for the common column select
         * @event ColumnSelectionControl.events#"div.cf-filter-type-select-common select":change
         * 
         */
        /**
         * Change event for the common columns select
         * @function ColumnSelectionControl.events#"div.cf-filter-type-select-common select":change
         * @param {object} e - the event object
         * @listens ColumnSelectionControl.events#"div.cf-filter-type-select-common select":change
         */
        'change div.cf-filter-type-select-common select':function(e) {
            this.enableColumnsByType(
                $(e.currentTarget).val(), 
                $(':selected', $(e.currentTarget)).data('type'));
        },
        
        /**
         * Change event for the column select
         * @event ColumnSelectionControl.events#"div.cf-filter-type-select-column select":change
         */
        /**
         * Change event handler for the column select
         * @function ColumnSelectionControl.events#"div.cf-filter-type-select-column select":change
         * @param {object} e - the event object
         * @listens ColumnSelectionControl.events#"div.cf-filter-type-select-column select":change
         */
        'change div.cf-filter-type-select-column select':function(e) {
            this.model.set('activeColumn', 
                _.findWhere(this.model.get('columns'), 
                    {'data':$(e.currentTarget).val()}));
            
            var act = this.model.get('activeColumn').type,
                at = this.model.get('filterFactory').activeType(),
                o = act===at ? 
                    this.model.get('filterFactory').getActiveWidget().getOperator() : 
                    undefined;
            this.showFilterType(this.model.get('activeColumn').type, o);
        },
        
        /**
         * Event handler when a widget triggers its cf.fw.submit submit event
         * @function ColumnSelectionControl.events#"cf.fw.submit"
         * @param {FilterWidget#"cf.fw.submit"} e - a cf.fw.submit event object
         * @param {FilterWidget#"cf.fw.submit"} filterValue - an object generated from the  FilterWidget's .get() function
         * @listens FilterWidget#"cf.fw.submit"
         * @fires ColumnSelectionControl.events#"cc.filter.add"
         */
        'cf.fw.submit':function(e, filterValue) {
            var activeWidget = this.model.get('filterFactory').getActiveWidget();
            if(activeWidget) {
                switch(this.model.get('mode')) {
                    case $.fn.ColumnFilters.ControlModes.EDIT:
                        this.model.get('cachedFilter').set({
                            'column':this.model.get('activeColumn').data,
                            'label':this.model.get('activeColumn').title,
                            'table':this.model.get('activeColumn').table,
                            'type':this.model.get('activeColumn').type,
                            'filterValue':filterValue
                        });
                        this.$el.trigger('cc.filter.save', [this.model.get('cachedFilter')]);
                        break;
                    case $.fn.ColumnFilters.ControlModes.NORMAL:
                        /**
                         * An event triggered from a filter widget acting as a proxy for 
                         * the add or save button.
                         * @event ColumnSelectionControl.events#"cc.filter.add"
                         * @property {Filter} filter - a filter with populated values
                         */
                        this.$el.trigger('cc.filter.add', [{
                            'column':this.activeColumn(),
                            'label':this.activeLabel(),
                            'table':this.model.get('activeColumn').table,
                            'type':this.model.get('activeColumn').type,
                            'filterValue':filterValue
                        }]);
                        break;
                }
            }
        },
        
        /**
         * Click event for the add filter button
         * @event ColumnSelectionControl.events#"button.cf-add-column-filter-button":click
         */
        /**
         * Click event handler for the add column filter button.
         * @function ColumnSelectionControl.events#"button.cf-add-column-filter-button":click
         * @param {object} e - the event object
         * @listens ColumnSelectionControl.events#"button.cf-add-column-filter-button":click
         * @fires ColumnSelectionControl.events#"cc.filter.add"
         */
        'click button.cf-add-column-filter-button':function(e) {
            // get value from active filter widget
            var activeWidget = this.model.get('filterFactory').getActiveWidget(),
                filterValue = activeWidget ? activeWidget.get() : false;
            if(activeWidget && filterValue) {
                switch(this.model.get('filterSelectionType')) {
                    case $.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE:
                        // .column and .label will be different
                        this.$el.trigger('cc.filter.add', [
                            {
                                'column':this.activeColumn(),
                                'label':this.activeLabel().join(', '),
                                'table':this.model.get('activeColumn')[0].table,
                                'type':this.model.get('activeColumn')[0].type,
                                'filterValue':filterValue
                           }
                        ]);
                        break;
                    case $.fn.ColumnFilters.FilterSelectionTypes.DEFAULT:
                        this.$el.trigger('cc.filter.add', [
                            {
                                'column':this.activeColumn(),
                                'label':this.activeLabel(),
                                'table':this.model.get('activeColumn').table,
                                'type':this.model.get('activeColumn').type,
                                'filterValue':filterValue
                            }
                        ]);
                        break;
                }
            }
        },
        
        /**
         * Click event from the save button.
         * @event ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-success":click
         */
        /**
         * Click event handler for the save filter button (when in edit mode).
         * @function ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-success":change
         * @param {object} e - the event object
         * @listens ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-success":change
         * @fires ColumnSelectionControl.events#"cc.filter.save"
         * @todo also put this functionality into the cf.fw.submit event handler
         */
        'click div.cf-column-control-action-controls div.btn-group button.btn-success':function(e) {
            var activeWidget = this.model.get('filterFactory').getActiveWidget(),
                filterValue = activeWidget ? activeWidget.get() : false;
                if(activeWidget && filterValue) {
                    /**
                     * An event signifying that an edited filter should be saved.
                     * @event ColumnSelectionControl.events#"cc.filter.save"
                     * @property {Filter} filter - a filter with populated values
                     */
                    this.model.get('cachedFilter').set({
                        'column':this.activeColumn(),
                        'label':this.activeLabel(),
                        'table':this.model.get('activeColumn').table,
                        'type':this.model.get('activeColumn').type,
                        'filterValue':filterValue
                    });
                    this.$el.trigger('cc.filter.save', [this.model.get('cachedFilter')]);
                }
        },
        
        /**
         * Click event from the edit filter cancel button.
         * @event ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-default":click
         */
        /**
         * Click event handler for the cancel edit filter button.
         * @function ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-default":click
         * @param {object} e - the event object
         * @listens ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-default":click
         * @fires ColumnSelectionControl.events#"cc.filter-cancel.click"
         */
        'click div.cf-column-control-action-controls div.btn-group button.btn-default':function(e) {
            /**
             * An event signifying that this mode's edit mode should be canceled.
             * @event ColumnSelectionControl.events#"fc.filter-cancel.click"
             */
            this.$el.trigger('cc.filter-cancel.click');
        }
    },
    
    /**
     * The element this View will exist as in the document.
     * @protected
     * @type {string}
     * @default
     */
    'tagName':'nav',
    
    /**
     * This View's class values.
     * @protected
     * @type {string}
     * @default
     */
    'className':'navbar navbar-default cf-column-select-control',
    
    /**
     * A customized extended Backbone-View instance
     * @class
     * @classdesc A ColumnSelectionControl manages how columns are set up for 
     * the filter factory to apply its filter.
     * @version 1.0.2
     * @extends Backbone-View
     * @constructs ColumnSelectionControl
     * 
     * @fires ColumnSelectionControl.events#"button.cf-add-column-filter-button":click
     * @fires ColumnSelectionControl.events#"div.cf-filter-type-select select":change
     * @fires ColumnSelectionControl.events#"div.cf-filter-type-select-common select":change
     * @fires ColumnSelectionControl.events#"div.cf-filter-type-select-column select":change
     * @fires ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-success":click
     * @fires ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-default":click
     * 
     * @param {object} options - A configuration object passed with the constructor
     * see the {@link Backbone-View} type definition for common properties.
     * @param {Array.<Object>} options.columns - an array of column objects 
     * with "data" and "title" attributes.
     * @param {string} [options.filterSelectionType=FilterSelectionTypes.DEFAULT] - the initial 
     * type of column selection to display
     * @param {string} [options.defaultSelectedColumnValue=null] - the value of 
     * the 'data' property in the 'columns' array that will be selected in the 
     * column value select
     * @param {string[]} [options.defaultSelectedCommonValues=[]] - the values  
     * of the 'data' property in the 'columns' array that will be selected in  
     * the common value select
     * @param {object} options.filterFactoryConfig - a configuration object for 
     * the filter factory control
     * @param {number} mode [options.mode=ControlModes.NORMAL] - The default 
     * mode to set this control into
     */
    'initialize':function(options) {
        this.version = '1.0.2';
        //console.log(options);
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof ColumnSelectionControl.prototype
         * @property {FilterFactory} filterFactory - A View for managing the 
         * filter values for column(s)
         * @property {string|string[]} activeColumn - the column(s) that 
         * are actively selected in one of the select controls
         * @property {Filter} cachedFilter - A Filter passed to loadFilter when 
         * in edit mode
         */
        this.model = new Backbone.Model(
            $.extend(_.omit(options, 'filterFactoryConfig'), {
                'activeColumn':null,
                'cachedFilter':null
        }));
        
        this.model.on('change:mode', this.modeChangeHandler, this);
        
        var i, j, w, w2,
            commonColumns = [], 
            datasourcedGroup,
            // group columns by type
            groupedCol = _.groupBy(
                _.reject(this.model.get('columns'), function(c) {
                    _.has(c, 'cfexclude') && c.cfexclude
                }), 
                'type'
            ),
            currentWidget, dataTypeWidgets, widgetsCollection = []
        ;
        
        // pick out the data-backed columns where the datasources don't match
        for(i in groupedCol) {
            if(groupedCol[i].length>1) {
                if(_.contains(['biglist','enum'], i)) {
                    datasourcedGroup = _.groupBy(groupedCol[i], function(c2) {
                        return c2.table
                    });
                    for(j in datasourcedGroup) {
                        if(datasourcedGroup[j].length>1) {
                            $.merge(commonColumns, datasourcedGroup[j]);
                        }
                    }
                } else {
                    $.merge(commonColumns, groupedCol[i]);
                }
            }
        }
        this.model.set('commonColumns', commonColumns);
        
        // set activeType and activeOperator
        switch(this.model.get('filterSelectionType')) {
            case $.fn.ColumnFilters.FilterSelectionTypes.DEFAULT:
                if(!this.model.get('defaultSelectedColumnValue')) {
                    // set defaultSelectedColumnValue to the 1st column data type
                    w = this.model.get('columns')[0];
                } else {
                    w = _.findWhere(this.model.get('columns'), {
                        'data':this.model.get('defaultSelectedColumnValue')
                    })
                }
                options.filterFactoryConfig.activeType = w.type;
                this.model.set('activeColumn', w);
                break;
        }
        
        // pass number columns to the filterFactory for processing
        // pass boolean columns to the filterFactory for processing
        // pass enum columns to the filterFactory for processing
        // pass reference columns to the filterFactory for processing
        // create the filter factory
        this.model.set('filterFactory', new FilterFactory($.extend(
            options.filterFactoryConfig,
            {
                'numberColumns':_.filter(options.columns, function(c) {
                    return c.type==='number'
                }),
                'booleanColumns':_.filter(options.columns, function(c) {
                    return c.type==='boolean'
                }),
                'enumColumns':_.filter(options.columns, function(c) {
                    return c.type==='enum'
                }),
                'biglistColumns':_.filter(options.columns, function(c) {
                    return c.type==='biglist'
                })
            }
        )));
        this.model.get('filterFactory').hide().$el.addClass('form-group nav navbar-nav');
        
        this.render();
    },
    
    // this view does not get re-rendered
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        $('div.cf-filter-factory-placeholder', this.$el).replaceWith(this.model.get('filterFactory').render());
        
        if(this.model.get('defaultSelectedCommonValues').length) {
            // check if there are common columns to be selected by default
            var filteredColumns = _.filter(
                    this.model.get('commonColumns'), 
                    function(o) {
                        return _.contains(this.model.get('defaultSelectedCommonValues'), o.data)
                    },
                    this
                ),
                countedColumnTypes = _.countBy(filteredColumns, function(o){ return o.type}),
                commonColumnsTypes = _.toArray(countedColumnTypes);
            
            // if there are common columns to populate the select then apply 
            // default selected common columns
            if(commonColumnsTypes.length===1) {
                $('div.cf-filter-type-select-common select', this.$el).val(this.model.get('defaultSelectedCommonValues'));
                this.enableColumnsByType(filteredColumns[0].type);
                this.displayColumnSelectControl($.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE);
            }
            
        } else if(this.model.get('defaultSelectedColumnValue')) {
            $('div.cf-filter-type-select-column select', this.$el).val(this.model.get('defaultSelectedColumnValue'));
            this.displayColumnSelectControl($.fn.ColumnFilters.FilterSelectionTypes.DEFAULT);
            
        } else {
            this.displayColumnSelectControl(this.model.get('filterSelectionType'));
        }
        
        // set the state according to the mode
        this.modeChangeHandler(this.model, this.model.get('mode'), {});
        
        return this.$el;
    }
});


var FilterSaveControl = Backbone.View.extend(
/** @lends FilterSaveControl.prototype */
{
    'enable':function() {
        this.changeMode($.fn.ColumnFilters.ControlModes.NORMAL);
        return this;
    },
    
    'disable':function() {
        this.changeMode($.fn.ColumnFilters.ControlModes.DISABLED);
        return this;
    },
    
    /**
     * Makes sure there are no duplicates and then adds a menu item to the 
     * "save to" category dropup menu
     * @function FilterSaveControl#addCategory
     * @param {string} categoryName - the name of the category
     * @return {FilterSaveControl}
     */
    'addCategory':function(categoryName) {
        // if a category menu with the same name doesn't already exist
        if(this.categories.where({'name':categoryName}).length<1) {
            // add category to the categories collection
            this.categories.add({'name':categoryName});
        }
        return this;
    },
    
    /**
     * Resets the filters collection with the filters retrieved from a filterSet 
     * model in the collection using the passed filterSetId.
     * @function FilterSaveControl#loadFilters
     * @param {string} filterSetId - the id of the filterSet in the collection
     * @return {FilterSaveControl}
     */
    'loadFilters':function(filterSetId) {
        var fs = this.collection.get(filterSetId);
        this.filters.reset(fs.get('filters'));
        return this;
    },
    
    /**
     * 
     * @function FilterSaveControl#changeMode
     * @param {number} newMode - An enum value from ControlModes, if the value 
     * passed is the same as the current controlMode value, nothing will happen.
     * @return {FilterSaveControl}
     */
    'changeMode':function(newMode) {
        if(_.isFinite(newMode) && this.model.get('controlMode')!==_.identity(newMode*1)) {
            this.model.set('controlMode', newMode*1);
        }
        return this;
    },
    
    // private function -- not sure if we need now
    'modeChangeHandler':function(m, v, options) {
        this.filters.trigger('update');
    },
    
    
    /**
     * The event listener object for the FilterSaveControl View.
     * @protected 
     * @readonly
     * @namespace events
     * @memberof FilterSaveControl
     */
    'events':{
        /**
         * Click event for a save filterset list item.
         * @event FilterSaveControl.events#"li.cf-save-filter-list-item ul.dropdown-menu li":click
         */
        /**
         * Click event handler for when a filterset list item is clicked.
         * @function FilterSaveControl.events#"li.cf-save-filter-list-item ul.dropdown-menu li":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"li.cf-save-filter-list-item ul.dropdown-menu li":click
         */
        'click li.cf-save-filter-list-item ul.dropdown-menu li':function(e) {
            // are we saving to a new category or an existing one ?
            var catIndex = $(e.currentTarget).data('category-index'),
                isNewCategory = Boolean(catIndex === 0);
            
            if(isNewCategory) {
                // set the modal header title and action button label
                $('h4.modal-title', this.$el).html('Create New Category');
                $('div.modal-footer button:last-child', this.$el).html('Create');
                
                // render form inside modal body
                $('div.modal-body', this.$el).empty().append(
                    _.template($.fn.ColumnFilters.NEW_CATEGORY_FORM)({}));
            } else {
                // set the modal header title and action button label
                $('h4.modal-title', this.$el).html('Save to Filter Set');
                $('div.modal-footer button:last-child', this.$el).html('Save');
                // render form inside modal body
                $('div.modal-body', this.$el).empty().append(
                    _.template($.fn.ColumnFilters.NEW_FILTER_SET_FORM, 
                        {'variable':'config'})({
                            'category':this.categories.get(catIndex).get('name')
                        }
                    )
                );
            }
            
            $('div.modal', this.$el).modal('show');
        },
        
        /**
         * Click event for the clear filters button.
         * @event FilterSaveControl.events#"div.cf-fsc-clear-filterset-button button":click
         */
        /**
         * Click event handler for when the clear filters button is clicked.
         * @function FilterSaveControl.events#"div.cf-fsc-clear-filterset-button button":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"div.cf-fsc-clear-filterset-button button":click
         */
        'click div.cf-fsc-clear-filterset-button button':function(e) {
            this.filters.reset();
        },
        
        /**
         * Click event for the modal action button.
         * @event FilterSaveControl.events#"div.modal-footer button:last-child":click
         */
        /**
         * Click event handler when the modal action button is clicked.
         * @function FilterSaveControl.events#"div.modal-footer button:last-child":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"div.modal-footer button:last-child":click
         */
        'click div.modal-footer button:last-child':function(e) {
            var saveType = $('div.modal-body form', this.$el).data('save-type'),
                name, desc, category;
            
            switch(saveType) {
                case 'filterset':
                    // validate name, description is optional
                    name = $.trim($('div.modal-body form input', this.$el).val());
                    desc = $.trim($('div.modal-body form textarea', this.$el).val());
                    category = $('div.modal-body form', this.$el).data('category');
                    if(name.length) {
                        this.disable();
                        this.collection.create({
                            'category':category,
                            'table':this.model.get('table'),
                            'name':name,
                            'description':desc.length ? desc : null,
                            'filters':this.filters.clone().toJSON(),
                            'error':function(cm, resp, opts) {
                                this.trigger('fsc.ajax.error', resp, cm);
                                this.$el.trigger('fsc.ajax.error', [resp, cm]);
                            }
                        });
                    }
                    
                    break;
                case 'category':
                    // creating a new category
                    name = $.trim($('div.modal-body form input', this.$el).val());
                    if(name.length) {
                        this.addCategory(name);
                    }
                    break;
            }
        },
        
        /**
         * Click event for the remove filter set button.
         * @event FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-remove-button":click
         */
        /**
         * Click event handler for the remove filter set button.
         * @function FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-remove-button":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-remove-button":click
         */
        'click ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-remove-button':function(e) {
            if(confirm('Are you sure you want to remove this Filter Set?')) {
                var m = this.collection.get($(e.currentTarget).data('id'));
                this.disable();
                m.destroy({
                    'sucess':function(model, resp, opts) {
                        //console.log('model destroy success');
                    },
                    'error':function(model, resp, opts) {
                        this.trigger('fsc.ajax.error', resp, model);
                        this.$el.trigger('fsc.ajax.error', [resp, model]);
                    }
                });
                this.collection.remove($(e.currentTarget).data('id'));
                
            }
        },
        
        /**
         * Click event for the edit filter set button.
         * @event FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-edit-button":click
         */
        /**
         * Click event handler for the edit filter set button.
         * @function FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-edit-button":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-edit-button":click
         */
        'click ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-edit-button':function(e) {
            this.loadFilters($(e.currentTarget).data('id'));
            this.model.set('editingFilterSet', this.collection.get($(e.currentTarget).data('id')));
            // change edit mode
            this.changeMode($.fn.ColumnFilters.ControlModes.EDIT);
        },
        
        /**
         * Click event for the filter set link.
         * @event FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li h4 a":click
         */
        /**
         * Click event handler for the filter set link.
         * @function FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li h4 a":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li h4 a":click
         */
        'click ul.cf-fsc-filter-set-menu li h4 a':function(e) {
            this.loadFilters($(e.currentTarget).data('id'));
        },
        
        /**
         * Click event for the cancel editing filter set button.
         * @event FilterSaveControl.events#"div.cf-fsc-save-filterset-buttongroup button:first-child":click
         */
        /**
         * Click event handler for the cancel editing filter set button.
         * @function FilterSaveControl.events#"div.cf-fsc-save-filterset-buttongroup button:first-child":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"div.cf-fsc-save-filterset-buttongroup button:first-child":click
         */
        'click div.cf-fsc-save-filterset-buttongroup button:first-child':function(e) {
            this.changeMode($.fn.ColumnFilters.ControlModes.NORMAL);
        },
        
        /**
         * Click event for the done editing filter set button.
         * @event FilterSaveControl.events#"div.cf-fsc-save-filterset-buttongroup button:first-child":click
         */
        /**
         * Click event handler for the done editing filter set button.
         * @function FilterSaveControl.events#"div.cf-fsc-save-filterset-buttongroup button:first-child":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"div.cf-fsc-save-filterset-buttongroup button:first-child":click
         */
        'click div.cf-fsc-save-filterset-buttongroup button:last-child':function(e) {
            if(this.filters.length) {
                // put the filters from this.filters.collection into the 
                // editingFilterSet.filters and do an update()
                this.disable();
                this.model.get('editingFilterSet').save({
                    'filters':this.filters.toJSON(),
                    'error':function(model, resp, opts) {
                        this.trigger('fsc.ajax.error', resp, model);
                        this.$el.trigger('fsc.ajax.error', [resp, model]);
                    }
                });
                this.changeMode($.fn.ColumnFilters.ControlModes.NORMAL);
            }
        }
    },
    
    /**
     * The value of this property changes the type of DOM Element created as this View's container.
     * @readonly
     * @type {string}
     */
    'tagName':'nav',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'navbar navbar-default cf-filter-save-control',
    
    /**
     * This View controls the saving and managing of filters, filter categories, and filter groups.
     * @typedef {Backbone-View} FilterSaveControl
     * @class
     * @classdesc The FilterSaveControl manages how filters are applied to columns.
     * @version 1.0.1
     * @constructs FilterSaveControl
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof FilterSaveControl.prototype
         * @property {number} mode - An enum value from ColumnFilters.Modes
         * @property {string} url - 
         * @property {string} table - 
         * @property {number} controlMode - 
         * @property {object} editingFilterSet - 
         */
        this.model = new Backbone.Model($.extend(
            {
                'mode':$.fn.ColumnFilters.Modes.DEFAULT,
                'url':undefined,
                'table':undefined
            },
            _.omit(options, ['filters','categories']),
            {
                'controlMode':$.fn.ColumnFilters.ControlModes.NORMAL,
                'editingFilterSet':null
            }
        ));
        
        this.model.on('change:controlMode', this.modeChangeHandler, this);
        
        this.filters = options.filters;
        
        // if the mode is one that displays filter sets
        if(_.contains(
                [$.fn.ColumnFilters.Modes.CATEGORY_SETS,
                 $.fn.ColumnFilters.Modes.CATEGORIES_NO_TYPES], 
            this.model.get('mode'))) {
            
            this.categories = new Backbone.Collection(options.categories, {
                'model':Backbone.Model.extend({
                    'defaults':{'name':undefined}
                })
            });
            // TODO implement a way to add existing filterSets
            this.collection = new Backbone.Collection([], {
                'model':Backbone.Model.extend({
                    'defaults':{
                        'category'    :null,
                        'table'       :null,
                        'name'        :null,
                        'description' :null,
                        'filters'     :null
                    }
                })
            });
            
            this.filters.on('update reset', this.render, this);
            this.categories.on('update reset', this.render, this);
            this.collection.on('update reset', this.render, this);
            
            if(options.url) {
                this.collection.url = options.url;
                
                // after the xhr response
                this.collection.on('sync', function(col, resp, opts) {
                    this.enable();
                }, this);
                // when the request is sent
                this.collection.on('request', function(col, xhr, opts) {
                    this.disable();
                }, this);
                // an error in the xhr happened
                this.collection.on('error', function(col, resp, opts) {
                    this.trigger('fsc.ajax.error', resp, col);
                    this.$el.trigger('fsc.ajax.error', [resp, col]);
                }, this);
                
                // initialize the filterSet collection
                this.collection.fetch({
                    'context':this,
                    'remove':false, 
                    'data':{'table':options.table},
                    'success':function(col, resp, opts) {
                        // add categories from the fetched filterSets
                        // to the categories collection
                        var i, 
                            existingCategories = this.categories.pluck('name'),
                            fetchedCategories = _.keys(_.groupBy(col.toJSON(), 'category'));
                        for(i in fetchedCategories) {
                            if(!_.contains(existingCategories, fetchedCategories[i])) {
                                existingCategories.push(fetchedCategories[i]);
                            }
                        }
                        this.categories.reset(_.map(existingCategories, 
                            function(c) {
                                return {'name':c}
                            }
                        ));
                    },
                    'error':function(col, resp, opts) {
                        this.trigger('fsc.ajax.error', resp, col);
                        this.$el.trigger('fsc.ajax.error', [resp, col]);
                    }
                });
            } else {
                this.render();
            }
        }
    },
    
    'render':function(col, opts) {
        if(_.contains(
                    [$.fn.ColumnFilters.Modes.CATEGORY_SETS,
                     $.fn.ColumnFilters.Modes.CATEGORIES_NO_TYPES], 
                this.model.get('mode'))) {
            
            var templateData = $.extend(this.model.toJSON(),
                {
                    'filters':_.map(this.filters.models, function(m) {
                        return $.extend(m.toJSON(), {'cid':m.cid})
                    }),
                    'categories':_.map(this.categories.models, function(m) {
                        return $.extend(m.toJSON(), {'cid':m.cid})
                    }),
                    'filtersets':_.groupBy(
                        _.map(this.collection.models, function(m) {
                            return $.extend(m.toJSON(), {
                                'cid':m.cid
                            })
                        }), 'category')
                }
            );
            
            this.$el.empty().append(
                _.template($.fn.ColumnFilters.FILTER_SAVE_CONTROL_VIEW_TEMPLATE, 
                    {'variable':'config'})(templateData)
            );
            $('div.modal', this.$el).modal({
                'backdrop':'static',
                'keyboard':false,
                'show':false
            });
        } else {
            this.$el.empty();
        }
    }
});


var FilterFactory = Backbone.View.extend(
/** @lends FilterFactory.prototype */
{
    /**
     * Displays this View instance.
     * @function FilterFactory#show
     * @return {FilterFactory}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function FilterFactory#hide
     * @return {FilterFactory}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Resets this control to its default state.
     * @function FilterFactory#reset
     * @return {FilterFactory}
     */
    'reset':function() {
        var aw, at, ai, ao, aoi, dtw = this.model.get('dataTypeWidgets');
        
        aw = this.getActiveWidget();
        if(aw) {
            aw.reset().hide();
        }
        
        this.model.set('activeType', dtw[0].type);
        at = this.model.get('activeType');
        this.model.set('activeIndex', 
            _.findIndex(dtw, 
                function(o){ return o.type===at }, 
                this));
        ai = this.model.get('activeIndex');
        this.model.set('activeOperator', dtw[0].widgets[0].getOperator());
        ao = this.model.get('activeOperator');
        this.model.set('activeOperatorIndex', 
            _.findIndex(dtw[ai].widgets, 
                function(o){ return o.getOperator()===ao }, 
                this));
        aoi = this.model.get('activeOperatorIndex');
        
        // re-render the operator select and reset the activeWidget
        $('select.cf-widget-operator-select', this.$el).replaceWith(
            _.template(
                $.fn.ColumnFilters.WIDGET_OPERATOR_SELECT_TEMPLATE, 
                {'variable':'config'}
            )(this.model.toJSON())
        );
        this.getActiveWidget().reset().show();
        return this;
    },
    
    /**
     * Prompts the enum filter widget(s) to set their datasource using the 
     * passed parameters.
     * @function FilterFactory#configureEnumWidget
     * @param {string} enumTable - the value of the table property
     * @param {string} enumColumn - the value of the column/data property
     * @return {FilterFactory}
     */
    'configureEnumWidget':function(enumTable, enumColumn) {
        var efw = this.getWidget('enum', 'equals');
        if(efw) {
            efw.useDatasource(enumTable, enumColumn);
        }
        return this;
    },
    
    /**
     * Prompts the biglist filter widget(s) to set their datasource using the 
     * passed parameters.
     * @function FilterFactory#configureBiglistWidget
     * @param {string} biglistTable - the value of the referenceTable property
     * @param {string} biglistColumn - the value of the column/data property
     * @return {FilterFactory}
     */
    'configureBiglistWidget':function(biglistTable, biglistColumn) {
        var bfw = this.getWidget('biglist', 'equals');
        if(bfw) {
            bfw.useDatasource(biglistTable, biglistColumn);
        }
        return this;
    },
    
    /**
     * Prompts the boolean filter widget(s) to set their datasource using the 
     * passed parameter.
     * @function FilterFactory#configureBooleanWidget
     * @param {string} booleanColumn - the value of the column/data property
     * @return {FilterFactory}
     */
    'configureBooleanWidget':function(booleanColumn) {
        var bfw = this.getWidget('boolean', 'equals');
        if(bfw) {
            bfw.useDatasource(booleanColumn);
        }
        return this;
    },
    
    /**
     * Prompts the number filter widget(s) to set their datasource using the
     * passed parameter.
     * @function FilterFactory#configureNumberWidget
     * @param {string} numberColumn - the value of the column/data property
     * @param {string} operator - the operator for the type
     * @return {FilterFactory}
     */
    'configureNumberWidget':function(numberColumn, operator) {
        var i, widgets = [],
        numberDT = _.findWhere(this.model.get('dataTypeWidgets'), {'type':'number'});;
        if(numberDT) {
            for(i in numberDT.widgets) {
                numberDT.widgets[i].useDatasource(numberColumn);
            }
        }
        return this;
    },
    
    /**
     * A function to get a filter widget by type and operator.
     * @function FilterFactory#getWidget
     * @return {FilterWidget|false} A filter widget where the type and operator 
     * match the passed parameters.
     */
    'getWidget':function(type, operator) {
        var i, tw, fw, isFound = false, dtw = this.model.get('dataTypeWidgets');
        tw = _.findWhere(dtw, {'type':type});
        if(tw) {
            for(i in tw.widgets) {
                fw = tw.widgets[i];
                if(fw.getOperator()===operator) {
                    isFound = true;
                    break;
                }
            }
            return isFound ? fw : false;
        } else {
            return false;
        }
    },
    
    
    /**
     * Returns the actively displayed widget or false if there isn't one.
     * @function FilterFactory#getActiveWidget
     * @return {Backbone-View|false}
     */
    'getActiveWidget':function() {
        var ai = this.model.get('activeIndex'),
            oi = this.model.get('activeOperatorIndex'),
            aw = false;
        if(ai>-1 && oi>-1) {
            aw = this.model.get('dataTypeWidgets')[ai].widgets[oi];
        } else if(ai>-1) {
            aw = this.model.get('dataTypeWidgets')[ai].widgets[0];
        }
        return aw;
    },
    
    /**
     * Displays the filter widget for the passed type and optional operator or 
     * returns the type of the displayed widget if no parameters are passed.
     * @function FilterFactory#activeType
     * @param {string} [type=undefined] - A value that would match the 'type' 
     * property in one of the objects in the model.dataTypeWidgets array.
     * @param {string} [operator=undefined] - A value that would match a value 
     * returned from a widget Backbone-View's .getOperator() method.
     * @return {string|FilterWidget|false}
     */
    'activeType':function(type, operator) {
        var dtw = this.model.get('dataTypeWidgets'),
            at, ai = -1, ao, aoi = -1, aw;
        
        // if the activeType is the same then just check for the operator
        if(type===this.model.get('activeType')) {
            // hide current active widget
            aw = this.getActiveWidget();
            if(aw) {
                aw.hide();
            }
            
            // set model variable for new active widget
            ai = this.model.get('activeIndex');
            if(operator) {
                this.model.set('activeOperator', operator);
                ao = this.model.get('activeOperator');
                this.model.set('activeOperatorIndex', 
                    _.findIndex(dtw[ai].widgets, 
                        function(o){ return o.getOperator()===ao }, 
                        this)
                );
                
                // set option in operator select to operator
                $('select.cf-widget-operator-select', this.$el).val(ao);
            }
            
            // show new active widget
            aw = this.getActiveWidget();
            if(aw) {
                aw.show();
            }
            return aw;
        }
        
        // activeType is not the same as passed type
        if(type) {
            if(_.contains(_.pluck(dtw, 'type'), type)) {
                // hide current active widget
                aw = this.getActiveWidget();
                if(aw) {
                    aw.hide();
                }
                
                this.model.set('activeType', type);
                at = this.model.get('activeType');
                this.model.set('activeIndex', 
                    _.findIndex(dtw, function(o){ return o.type===at }, this)
                );
                ai = this.model.get('activeIndex');
                if(operator && 
                    _.contains(_.invoke(dtw[ai].widgets, 'getOperator'), operator)) {
                    this.model.set('activeOperator', operator);
                    ao = this.model.get('activeOperator');
                    this.model.set('activeOperatorIndex', 
                        _.findIndex(dtw[ai].widgets, 
                            function(o){ return o.getOperator()===ao }, 
                            this)
                    );
                    aoi = this.model.get('activeOperatorIndex');
                } else {
                    this.model.set('activeOperator', dtw[0].widgets[0].getOperator());
                    ao = this.model.get('activeOperator');
                    this.model.set('activeOperatorIndex', 
                        _.findIndex(dtw[ai].widgets, 
                            function(o){ return o.getOperator()===ao }, 
                            this)
                    );
                }
            }
            if(ai>-1) {
                // re-render the operator select
                $('select.cf-widget-operator-select', this.$el).replaceWith(
                    _.template(
                        $.fn.ColumnFilters.WIDGET_OPERATOR_SELECT_TEMPLATE, 
                        {'variable':'config'}
                    )(this.model.toJSON())
                );
                
                aw = this.getActiveWidget();
                if(aw) {
                    aw.show();
                }
                return aw;
            } else {
                return false;
            }
        } else {
            // type is empty or not in the data type widgets
            return this.model.get('activeType');
        }
    },
    
    /**
     * Applies the values from the filter parameter into the widget that matches 
     * the filter's type and operator properties.
     * @function FilterFactory#loadFilter
     * @param {Filter} filter - A {@link ColumnFilters."#Filter"}.
     * @return {FilterFactory} This FilterFactory instance
     */
    'loadFilter':function(filter) {
        //console.log(['get the filter widget ', filter.get('type'), ', ', filter.get('filterValue').operator].join(''));
        var aw = this.activeType(filter.get('type'), filter.get('filterValue').operator);
        if(aw) {
            aw.set(filter.get('filterValue'));
        }
        return this;
    },
    
    /**
     * A function that returns the version of not just this object, but all the 
     * complex objects that this object manages.
     * @function FilterFactory#versions
     * @return {object} A JSON object where the keys represent the class or 
     * object and the values are the versions.
     */
    'versions':function() {
        var wtypes = _.keys(_.groupBy(this.model.get('dataTypeWidgets'), 'type')),
            wtv = {},
            i, j, curT, tempA;
        for (i in wtypes) {
            curT = _.findWhere(this.model.get('dataTypeWidgets'), {'type':wtypes[i]});
            tempA = [];
            for(j in curT.widgets) {
                tempA.push(_.createKeyValueObject(curT.widgets[j].getOperator(), curT.widgets[j].version));
            }
            $.extend(wtv, _.createKeyValueObject(wtypes[i], tempA));
        }
        
        return {
            'FilterFactory':this.version,
            'Data Type Widgets':wtv
        };
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.FILTER_FACTORY_VIEW_TEMPLATE, 
        {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} namespaced.event - Event handler function
     */
    'events':{
        'change select.cf-widget-operator-select':function(e) {
            // hide widget for the current activeOperator
            var aw = this.getActiveWidget();
            if(aw) {
                aw.hide();
            }
            
            // set the new values for activeOperator, activeOperatorIndex
            this.model.set('activeOperator', $(e.currentTarget).val());
            this.model.set('activeOperatorIndex', 
                $('option:selected', $(e.currentTarget)).data('index')*1);
            
            // show the widget for the new activeOperator
            this.getActiveWidget().show();
            
            // check if the active widget is a number type
            if(this.activeType()==='number') {
                this.configureNumberWidget(
                    this.getActiveWidget().model.get('currentDatasource').get('data'), 
                    this.getActiveWidget().getOperator()
                );
            }
        }
    },
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-factory',
    
    /**
     * The FilterFactory manages all the types of filters.
     * @typedef {Backbone-View} FilterFactory
     * @class
     * @classdesc An instance of FilterFactory will contain controls for text, number, 
     * date, enum, reference, and boolean value types. However, an instance can be 
     * configured to have a custom set of value type controls.
     * @version 1.0.2
     * @constructs FilterFactory
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     * @param {DataTypeWidget[]} options.dataTypeWidgets - An array of DataTypeWidgets.
     * @param {object[]} [options.enumColumns=[]] - An array of enum type columns.
     * @param {object[]} [options.biglistColumns=[]] - An array of biglist type columns.
     * @param {object[]} [options.booleanColumns=[]] - An array of boolean type columns.
     * @param {object[]} [options.numberColumns=[]] - An array of number type columns.
     */
    'initialize':function(options) {
        this.version = '1.0.2';
        //console.log(options);
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof FilterFactory.prototype
         * @protected
         * @property {string} activeType - the currently visible widget data type
         * @property {string} activeOperator - the currently visible widget type operator
         */
        this.model = new Backbone.Model($.extend(
            {
                'enumColumns':[],
                'biglistColumns':[],
                'booleanColumns':[],
                'numberColumns':[]
            },
            options
        ));
        
        var i, at, ai, ao, dtw = this.model.get('dataTypeWidgets');
        
        // check if activeType was passed with the config options
        if(!this.model.get('activeType')) {
            this.model.set('activeType', dtw[0].type);
        }
        
        // set activeIndex, activeOperator, and activeOperatorIndex
        at = this.model.get('activeType');
        this.model.set('activeIndex', _.findIndex(dtw, function(o){ 
            return o.type===at
            }, 
            this));
        ai = this.model.get('activeIndex');
        
        if(!this.model.get('activeOperator')) {
            ai = this.model.get('activeIndex');
            this.model.set('activeOperator', dtw[ai].widgets[0].getOperator());
            ao = this.model.get('activeOperator');
            this.model.set('activeOperatorIndex', 
                _.findIndex(dtw[ai].widgets, 
                    function(o){ return o.getOperator()===ao }, 
                    this));
        } else {
            ao = this.model.get('activeOperator');
            this.model.set('activeOperatorIndex', _.findIndex(dtw[ai].widgets, 
                function(o){ return o.getOperator()===ao }, 
                this));
        }
        
        // process enumColumns
        at = _.findWhere(dtw, {'type':'enum'});
        if(at && this.model.get('enumColumns').length) {
            for(i in at.widgets) {
                at.widgets[i].addDatasource(this.model.get('enumColumns'));
            }
        }
        
        // process biglistColumns
        at = _.findWhere(dtw, {'type':'biglist'});
        if(at && this.model.get('biglistColumns').length) {
            for(i in at.widgets) {
                at.widgets[i].addDatasource(this.model.get('biglistColumns'));
            }
        }
        
        // process booleanColumns
        at = _.findWhere(dtw, {'type':'boolean'});
        if(at && this.model.get('booleanColumns').length) {
            for(i in at.widgets) {
                at.widgets[i].addDatasource(this.model.get('booleanColumns'));
            }
        }
        
        // process numberColumns
        at = _.findWhere(dtw, {'type':'number'});
        if(at && this.model.get('numberColumns').length) {
            for(i in at.widgets) {
                at.widgets[i].addDatasource(this.model.get('numberColumns'));
            }
        }
    },
    
    /**
     * This is the View's private render method. It should only be called once 
     * to build the elements of this view.
     * @function {Dom Element} FilterFactory#render
     * @protected
     * @readonly
     */
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        
        var aw, i, j;
        
        // add all the widgets
        for(i in this.model.get('dataTypeWidgets')) {
            for(j in this.model.get('dataTypeWidgets')[i].widgets) {
                aw = this.model.get('dataTypeWidgets')[i].widgets[j];
                //console.log(aw);
                aw.hide();
                $('div.cf-data-type-control-container', this.$el).append(
                    aw.$el
                );
            }
        }
        
        // show the active widget (if there is one)
        aw = this.getActiveWidget();
        if(aw) {
            aw.show();
        }
        
        return this.$el;
    }
});


var ColumnFiltersContainer = Backbone.View.extend(
/** @lends ColumnFiltersContainer.prototype */
{
    /**
     * Enables all the interactive controls in this View instance.
     * @function ColumnFiltersContainer#enable
     * @return {ColumnFiltersContainer}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        $([
           'ul.nav li', 
           'div.tab-pane a.list-group-item', 
           'ul.nav li a.list-group-item'
          ].join(','), this.$el).removeClass('disabled');
        $('div.tab-pane a p button', this.$el).show();
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function ColumnFiltersContainer#disable
     * @return {ColumnFiltersContainer}
     */
    'disable':function() {
        this.$el.attr('disabled', 'disabled');
        $([
           'ul.nav li', 
           'div.tab-pane a.list-group-item', 
           'ul.nav li a.list-group-item'
          ].join(','), this.$el).addClass('disabled');
        $('div.tab-pane a p button', this.$el).hide();
        return this;
    },
    
    'activeColumnIndex':function(column) {
        this.model.set('activeColumnIndex', 
            _.indexOf(
                this.collection.models, 
                this.collection.findWhere({
                    'column':column
                })
            )
        );
        return this.model.get('activeColumnIndex');
    },
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @protected
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.FILTERS_CONTAINER_VIEW_TEMPLATE, 
        {'variable':'config'}),
    
    'events':{
        'shown.bs.tab':function(e) {
            this.model.set('activeColumnIndex', $(e.target).data('column'));
        },
        'mouseover div.tab-pane a':function(e) {
            $('button', $(e.currentTarget)).removeClass('hidden');
        },
        'mouseleave div.tab-pane a':function(e) {
            $('button', $(e.currentTarget)).addClass('hidden');
        },
        'click button.cf-filter-remove-button':function(e) {
            this.$el.trigger('fc.filter-remove.click', [$(e.currentTarget).parent().parent().data('filter')]);
            
        },
        'click button.cf-filter-edit-button':function(e) {
            this.$el.trigger('fc.filter-edit.click', [$(e.currentTarget).parent().parent().data('filter')]);
        }
    },
    
    'tagName':'fieldset',
    
    'className':'panel-body cf-data-filters-container',
    
    /**
     * The ColumnFiltersContainer displays and facilitates 
     * the adding, editing and removing of column filters.
     * @typedef {Backbone-View} ColumnFiltersContainer
     * @class
     * @classdesc An instance of ColumnFiltersContainer will display added column 
     * filters in a per column tab navigation view. Each display representation 
     * of a column filter has edit and remove controls that trigger events when 
     * clicked. Those events area captured in the parent ColumnFilters view. 
     * @version 1.0.1
     * @constructs ColumnFiltersContainer
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     * @param {Backbone-Collection} [options.filters=[]] - collection of the 
     * filters from the parent ColumnFilters view.
     * @param {string} [options.activeColumn=undefined] - The value of the named 
     * column tab that should be active. If this is undefined and 
     * options.filters is populated, it will be set to the first filter.
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof ColumnFiltersContainer.prototype
         * @protected
         * @property {number} activeColumnIndex=-1 - the index of the li in 
         * the tab nav ul that is active
         */
        this.model = new Backbone.Model($.extend(
            _.omit(options, 'filters')
        ));
        this.collection = options.filters;
        this.collection.on('update reset', function(col, opt) {
            // is the activeColumnIndex within range
            if(this.collection.length) {
                if(this.model.get('activeColumnIndex') >= this.collection.length) {
                    this.model.set('activeColumnIndex', 0);
                }
            }
            this.render();
        }, this);
        
        this.render();
    },
    
    'render':function() {
        var templateData, columnNames, foundFilter, groupedFilters, f;
        
        if(this.model.get('activeColumnIndex')<0 && this.collection.length) {
            // set to the first column
            this.model.set('activeColumnIndex', 0);
        }
        
        templateData = {
            'filters':this.collection,
            'groupedFilters':_.groupBy(
                _.map(this.collection.models, function(m) {
                    return $.extend(m.toJSON(), {
                        'cid':m.cid
                    })
                }), 'column'),
                'activeColumnIndex':this.model.get('activeColumnIndex')
        };
        
        this.$el.empty().append(this.template(templateData));
        if(this.collection.length) {
            f = $([
                'ul.nav li a[data-column="', 
                this.model.get('activeColumnIndex'),
                '"]'
            ].join(''), this.$el);
            
            // this is a bit controversial so I will leave it to the end user 
            // to decide if they want it or not -- default is off
            //if(f.length) {
            //    f[0].scrollIntoView({'block':'start','behavior':'smooth'});
            //}
        }
        return this.$el;
    }
});


var TextEqualsFilterWidget = Backbone.View.extend(
/** @lends TextEqualsFilterWidget.prototype */
{
    
    /**
     * Displays this View instance.
     * @function TextEqualsFilterWidget#show
     * @return {TextEqualsFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function TextEqualsFilterWidget#hide 
     * @return {TextEqualsFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function TextEqualsFilterWidget#enable
     * @return {TextEqualsFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function TextEqualsFilterWidget#disable
     * @return {TextEqualsFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * 
     * @function TextEqualsFilterWidget#get
     * @return {object} 
     */
    'get':function() {
        var value = $.trim($('input', this.$el).val());
        if(value.length) {
            return {
                'operator':this.getOperator(), 
                'value':value, 
                'description':['is equal to', value].join(' ')
            };
        } else {
            // TODO trigger and handle error notification
            
            return false;
        }
    },
    
    /**
     * 
     * @function TextEqualsFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {TextEqualsFilterWidget}
     */
    'set':function(filterValue) {
        $('input', this.$el).val(filterValue.value);
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their 
     * default state and value.
     * @function TextEqualsFilterWidget#reset
     * @return {TextEqualsFilterWidget}
     */
    'reset':function() {
        $('input', this.$el).val(null);
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function TextEqualsFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.TEXT_TEMPLATE, {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} "keyup input" - Handles the "Enter" keyup event and 
     * triggers a "cf.fw.submit" event.
     */
    'events':{
        'keyup input':function(e) {
            // 13 == enter
            if(e.keyCode===13) {
                var fval = this.get();
                if(fval) {
                    this.$el.trigger('cf.fw.submit', [fval]);
                }
            }
        }
    },
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} TextEqualsFilterWidget
     * @class
     * @classdesc A widget for text data type that is equal to a value.
     * @version 1.0.5
     * @implements {FilterWidget}
     * @constructs TextEqualsFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     * @param {object} [options.attributes={class:"form-control input-sm", 
     * autocomplete:"off", placeholder:"is equal to value", size:"25"}] - The 
     * attributes that will applied to the input element in this control.
     */
    'initialize':function(options) {
        this.version = '1.0.5';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof TextEqualsFilterWidget.prototype
         * @protected
         * @property {string} operator='equals' - the type of filter matching 
         * that this widget would perform
         */
        this.model = new Backbone.Model(
            $.extend(
                // these can be overridden
                {
                    'attributes':{
                        'class':'form-control input-sm', 
                        'autocomplete':'off',
                        'placeholder':'is equal to value',
                        'size':'25'
                    }
                }, 
                options, 
                
                // these cannot
                {'operator':'equals'}
            )
        );
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        return this.$el;
    }
});


var TextSearchFilterWidget = Backbone.View.extend(/** @lends TextSearchFilterWidget.prototype */{
    
    /**
     * Displays this View instance.
     * @function TextSearchFilterWidget#show
     * @return {TextSearchFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function TextSearchFilterWidget#hide
     * @return {TextSearchFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function TextSearchFilterWidget#enable
     * @return {TextSearchFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function TextSearchFilterWidget#disable
     * @return {TextSearchFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * 
     * @function TextSearchFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var value = $.trim($('input', this.$el).val());
        if(value.length) {
            return {
                'operator':this.getOperator(), 
                'value':value, 
                'description':['is like', value].join(' ')
            };
        } else {
            
            return false;
        }
    },
    
    /**
     * 
     * @function TextSearchFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {TextSearchFilterWidget}
     */
    'set':function(filterValue) {
        $('input', this.$el).val(filterValue.value);
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function TextSearchFilterWidget#reset
     * @return {TextSearchFilterWidget}
     */
    'reset':function() {
        $('input', this.$el).val(null);
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function TextSearchFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template([
        '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />'
    ].join(''), {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} "keyup input" - Handles the "Enter" keyup event and 
     * triggers a "cf.fw.submit" event.
     */
    'events':{
        'keyup input':function(e) {
            // 13 == enter
            if(e.keyCode===13) {
                var fval = this.get();
                if(fval) {
                    this.$el.trigger('cf.fw.submit', [fval]);
                }
            }
        }
    },
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} TextSearchFilterWidget
     * @class
     * @classdesc A widget for text data type that is equal to a value.
     * @constructs TextSearchFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     * @param {object} [options.attributes={class:"form-control input-sm", 
     * autocomplete:"off", placeholder:"is similar to value", size:"25"}] - The 
     * attributes that will applied to the input element in this control.
     */
    'initialize':function(options) {
        this.version = '1.0.3';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof TextSearchFilterWidget.prototype
         * @protected
         * @property {string} operator='search' - the type of filter matching that this widget would perform
         */
        this.model = new Backbone.Model(
            $.extend(
                // these can be overridden
                {
                    'attributes':{
                        'class':'form-control input-sm', 
                        'autocomplete':'off',
                        'placeholder':'is similar to value',
                        'size':'25'
                    }
                }, 
                options, 
                
                // these cannot
                {'operator':'search'}
            )
        );
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        return this.$el;
    }
});


var NumberEqualsFilterWidget = Backbone.View.extend(
/** @lends NumberEqualsFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function NumberEqualsFilterWidget#show
     * @return {NumberEqualsFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function NumberEqualsFilterWidget#hide
     * @return {NumberEqualsFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function NumberEqualsFilterWidget#enable
     * @return {NumberEqualsFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function NumberEqualsFilterWidget#disable
     * @return {NumberEqualsFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function NumberEqualsFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var value = $('div.spinbox', this.$el).spinbox('value'),
            cds = this.model.get('currentDatasource');
        if(_.isFinite(value)) {
            return {
                'operator':this.getOperator(), 
                'column':cds.get('data'),
                'value':value,
                'description':['is equal to', value].join(' ')
            };
        }
        return false;
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function NumberEqualsFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {NumberEqualsFilterWidget}
     */
    'set':function(filterValue) {
        this.useDatasource(filterValue.column);
        if(_.isFinite(filterValue.value)) {
            $('div.spinbox', this.$el).spinbox('value', filterValue.value);
        }
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function NumberEqualsFilterWidget#reset
     * @return {NumberEqualsFilterWidget}
     */
    'reset':function() {
        this.model.trigger('change:currentDatasource');
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function NumberEqualsFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    /**
     * Adds a single or multiple datasource objects to this View's collection.
     * @function NumberEqualsFilterWidget#addDatasource
     * @param {object|object[]} ds - A column data object that includes a 
     * datasource property, or an array of datasource objects. 
     * @return {NumberEqualsFilterWidget}
     */
    'addDatasource':function(ds) {
        if(_.isArray(ds)) {
            for(var i in ds) {
                this.collection.add(ds[i]);
            }
        } else if(_.isObject(ds)) {
            this.collection.add(ds);
        }
        
        if(this.model.get('currentDatasourceIndex')<0) {
            this.model.set('currentDatasourceIndex', 0);
            this.model.set('currentDatasource', 
                this.collection.at(this.model.get('currentDatasourceIndex')));
        }
        return this;
    },
    
    /**
     * Attempts to change the current datasource by comparing the passed table 
     * and column parameters.
     * @function NumberEqualsFilterWidget#useDatasource
     * @param {string} column - the column/data property of the datasource
     * @return {boolean} - true when the datasource was changed
     */
    'useDatasource':function(column) {
        var currentDS = this.model.get('currentDatasource'),
            newDSIndex;
        if(currentDS.get('data')===column) {
            return false;
        }
        
        newDSIndex = _.findIndex(this.collection.toJSON(), function(c) {
            return c.data===column
        });
        if(newDSIndex>-1) {
            this.model.set('currentDatasourceIndex', newDSIndex);
            this.model.set('currentDatasource', 
                this.collection.at(this.model.get('currentDatasourceIndex')
            ));
        }
        return true;
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.NUMBER_SPINNER_TEMPLATE, 
        {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} "keyup input" - Handles the "Enter" keyup event and 
     * triggers a "cf.fw.submit" event.
     */
    'events':{
        'changed.fu.spinbox':function(e, val) {
            if(!_.isFinite(val)) {
                $('div.spinbox', this.$el).spinbox('value', 
                    this.model.get('spinboxConfig').min);
            }
        },
        'keyup input':function(e) {
            // 13 == enter
            if(e.keyCode===13) {
                var fval = this.get();
                if(fval) {
                    this.$el.trigger('cf.fw.submit', [fval]);
                }
            }
        }
    },
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget fuelux',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} NumberEqualsFilterWidget
     * @class
     * @classdesc A widget for a number data type that is equal to a value.
     * @version 1.0.5
     * @constructs NumberEqualsFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     * @param {object} [options.attributes={class:"form-control spinbox-input", autocomplete:"off", placeholder:"equal", size:"4"}] - 
     * The attributes that will applied to the input element in this control.
     * @param {object} [options.spinboxConfig={}] - The configuration object 
     * for the fuelux spinbox. See the fuelux spinbox documentation for the
     * default values.
     */
    'initialize':function(options) {
        this.version = '1.0.5';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof NumberEqualsFilterWidget.prototype
         * @protected
         * @property {string} operator='equals' - the type of filter matching 
         * this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'currentDatasource':null,
                'currentDatasourceIndex':-1
            },
            options, 
            {
                'operator':'equals',
                'defaults':{
                    'attributes':{
                        'class':'form-control spinbox-input', 
                        'autocomplete':'off',
                        'placeholder':'equals',
                        'size':'4'
                    },
                    'spinboxConfig':{
                        'value':1,
                        'min':1,
                        'max':999,
                        'step':1,
                        'hold':true,
                        'speed':'medium',
                        'disabled':false,
                        'units':[]
                    }
                }
            }
        ));
        
        this.model.on('change:currentDatasource', 
            this.render, this);
        
        this.collection = new Backbone.Collection();
    },
    
    'render':function(mod, value, opts) {
        var cds = this.model.get('currentDatasource');
        this.$el.empty().append(this.template(
            {
                'attributes':cds.has('attributes') ? cds.get('attributes') :
                    this.model.get('defaults').attributes
            }
        ));
        $('div.spinbox', this.$el).spinbox(
            cds.has('spinboxConfig') ? cds.get('spinboxConfig') : 
                this.model.get('defaults').spinboxConfig);
        return this.$el;
    }
});


var NumberBetweenFilterWidget = Backbone.View.extend(
/** @lends NumberBetweenFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function NumberBetweenFilterWidget#show
     * @return {NumberBetweenFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function NumberBetweenFilterWidget#hide
     * @return {NumberBetweenFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function NumberBetweenFilterWidget#enable
     * @return {NumberBetweenFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function NumberBetweenFilterWidget#disable
     * @return {NumberBetweenFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function NumberBetweenFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var from = $('div.cf-fw-from-date', this.$el).spinbox('value'), 
            to   = $('div.cf-fw-to-date', this.$el).spinbox('value'),
            cds = this.model.get('currentDatasource');
        if(_.isFinite(from) && _.isFinite(to)) {
            return {
                'operator':this.getOperator(),
                'column':cds.get('data'),
                'from':from,
                'to':to,
                'description':['is between', from, 'and', to].join(' ')
            };
        }
        
        return false;
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function NumberBetweenFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {NumberBetweenFilterWidget}
     */
    'set':function(filterValue) {
        this.useDatasource(filterValue.column);
        if(_.isFinite(filterValue.from)) {
            $('div.cf-fw-from-date', this.$el).spinbox('value', filterValue.from);
        }
        if(_.isFinite(filterValue.to)) {
            $('div.cf-fw-to-date', this.$el).spinbox('value', filterValue.to);
        }
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their 
     * default state and value.
     * @function NumberBetweenFilterWidget#reset
     * @return {NumberBetweenFilterWidget}
     */
    'reset':function() {
        this.model.trigger('change:currentDatasource');
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function NumberBetweenFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    /**
     * Adds a single or multiple datasource objects to this View's collection.
     * @function NumberBetweenFilterWidget#addDatasource
     * @param {object|object[]} ds - A column data object that includes a 
     * datasource property, or an array of datasource objects. 
     * @return {NumberBetweenFilterWidget}
     */
    'addDatasource':function(ds) {
        if(_.isArray(ds)) {
            for(var i in ds) {
                this.collection.add(ds[i]);
            }
        } else if(_.isObject(ds)) {
            this.collection.add(ds);
        }
        
        if(this.model.get('currentDatasourceIndex')<0) {
            this.model.set('currentDatasourceIndex', 0);
            this.model.set('currentDatasource', 
                this.collection.at(this.model.get('currentDatasourceIndex')));
        }
        return this;
    },
    
    /**
     * Attempts to change the current datasource by comparing the passed table 
     * and column parameters.
     * @function NumberBetweenFilterWidget#useDatasource
     * @param {string} column - the column/data property of the datasource
     * @return {boolean} - true when the datasource was changed
     */
    'useDatasource':function(column) {
        var currentDS = this.model.get('currentDatasource'),
            newDSIndex;
    
        if(currentDS.get('data')===column) {
            return false;
        }
        
        newDSIndex = _.findIndex(this.collection.toJSON(), function(c) {
            return c.data===column
        });
        if(newDSIndex>-1) {
            this.model.set('currentDatasourceIndex', newDSIndex);
            this.model.set('currentDatasource', 
                this.collection.at(this.model.get('currentDatasourceIndex')
            ));
        }
        return true;
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.NUMBER_BETWEEN_TEMPLATE, 
        {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} namespaced.event - Event handler function
     */
    'events':{
        'changed.fu.spinbox':function(e, val) {
            if(!_.isFinite(val)) {
                // which spinbox is it?
                console.log(e);
            }
        },
        'keyup input':function(e) {
            return false;
        }
    },
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget form-inline fuelux',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} NumberBetweenFilterWidget
     * @class
     * @classdesc A widget for number data type that is between two values.
     * @version 1.0.4
     * @constructs NumberBetweenFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.4';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof NumberBetweenFilterWidget.prototype
         * @protected
         * @property {string} operator='between' - the type of filter matching 
         * that this widget would perform
         * @property {object} fromAttributes - 
         * @property {object} toAttributes - 
         * @property {object} fromSpinboxConfig - 
         * @property {object} toSpinboxConfig - 
         */
        this.model = new Backbone.Model($.extend(
            {
                'currentDatasource':null,
                'currentDatasourceIndex':-1
            },
            options,
            {
                'operator':'between',
                'defaults':{
                    'attributes':{
                        'class':'form-control spinbox-input', 
                        'autocomplete':'off',
                        'size':'4'
                    },
                    'spinboxConfig':{
                        'value':1,
                        'min':1,
                        'max':999,
                        'step':1,
                        'hold':true,
                        'speed':'medium',
                        'disabled':false,
                        'units':[]
                    }
                }
            }
        ));
        
        this.model.on('change:currentDatasource', 
            this.render, this);
        
        this.collection = new Backbone.Collection();
    },
    
    'render':function(mod, value, opts) {
        var cds = this.model.get('currentDatasource');
        this.$el.empty().append(this.template(
            {
                'attributes':cds.has('attributes') ? 
                    cds.get('attributes') :
                    this.model.get('defaults').attributes
            }
        ));
        $('div.cf-fw-from-date', this.$el).spinbox(
            cds.has('spinboxConfig') ? 
                cds.get('spinboxConfig') : 
                this.model.get('defaults').spinboxConfig
        );
        $('div.cf-fw-to-date', this.$el).spinbox(
            cds.has('spinboxConfig') ? 
                cds.get('spinboxConfig') : 
                this.model.get('defaults').spinboxConfig
        );
        return this.$el;
    }
});


var NumberListFilterWidget = Backbone.View.extend(
/** @lends NumberListFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function NumberListFilterWidget#show
     * @return {NumberListFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function NumberListFilterWidget#hide
     * @return {NumberListFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function NumberListFilterWidget#enable
     * @return {NumberListFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function NumberListFilterWidget#disable
     * @return {NumberListFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function NumberListFilterWidget#get
     * @return {object}
     */
    'get':function() {
        if(this.collection.length<1) {
            return false;
        }
        var cds = this.model.get('currentDatasource');
        return {
            'operator':this.getOperator(),
            'column':cds.get('data'),
            'value':this.collection.map(function(n){return n.get('number')}),
            'description':[
                'is one of these: (',
                $.map(this.collection.models, function(m){
                    return m.get('number')
                }),
                ')'
            ].join('')
        }
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function NumberListFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {NumberListFilterWidget}
     */
    'set':function(filterValue) {
        this.useDatasource(filterValue.column);
        this.collection.reset(
            _.map(filterValue.value, function(n){
                return {'number':n}
            }
        ));
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their 
     * default state and value.
     * @function NumberListFilterWidget#reset
     * @return {NumberListFilterWidget}
     */
    'reset':function() {
        this.collection.reset();
        this.model.trigger('change:currentDatasource');
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function NumberListFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    /**
     * Adds a single or multiple datasource objects to this View's collection.
     * @function NumberListFilterWidget#addDatasource
     * @param {object|object[]} ds - A column data object that includes a 
     * datasource property, or an array of datasource objects. 
     * @return {NumberListFilterWidget}
     */
    'addDatasource':function(ds) {
        if(_.isArray(ds)) {
            for(var i in ds) {
                this.datasources.add(ds[i]);
            }
        } else if(_.isObject(ds)) {
            this.datasources.add(ds);
        }
        
        if(this.model.get('currentDatasourceIndex')<0) {
            this.model.set('currentDatasourceIndex', 0);
            this.model.set('currentDatasource', 
                this.datasources.at(this.model.get('currentDatasourceIndex')));
        }
        return this;
    },
    
    /**
     * Attempts to change the current datasource by comparing the passed table 
     * and column parameters.
     * @function NumberListFilterWidget#useDatasource
     * @param {string} column - the column/data property of the datasource
     * @return {boolean} - true when the datasource was changed
     */
    'useDatasource':function(column) {
        var currentDS = this.model.get('currentDatasource'),
            newDSIndex;
        
        if(currentDS.get('data')===column) {
            return false;
        }
        
        newDSIndex = _.findIndex(this.datasources.toJSON(), function(c) {
            return c.data===column
        });
        if(newDSIndex>-1) {
            this.model.set('currentDatasourceIndex', newDSIndex);
            this.model.set('currentDatasource', 
                this.datasources.at(this.model.get('currentDatasourceIndex')
            ));
        }
        return true;
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.NUMBER_LIST_TEMPLATE, {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * 
     */
    'events':{
        'changed.fu.spinbox':function(e, val) {
            if(!_.isFinite(val)) {
                $('div.spinbox', this.$el).spinbox('value', 
                    this.model.get('spinboxConfig').min);
            }
        },
        'keyup input':function(e) {
            // 13 == enter
            if(e.keyCode===13) {
                return false;
            }
        },
        'click button.cf-fw-numberList-btn-add':function(e) {
            var n = $('div.spinbox', this.$el).spinbox('value');
            if(_.isFinite(n) && this.collection.where({'number':n}).length<1) {
                this.collection.add({'number':n});
            }
        },
        'click button.close':function(e) {
            this.collection.remove($(e.currentTarget).data('cid'));
            return false;
        }
    },
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget form-inline fuelux',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} NumberListFilterWidget
     * @class
     * @classdesc A widget for a list of number data types.
     * @version 1.0.4
     * @constructs NumberListFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.4';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof NumberListFilterWidget.prototype
         * @protected
         * @property {string} operator='' - the type of filter matching that 
         * this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'currentDatasource':null,
                'currentDatasourceIndex':-1
            },
            options, 
            {
                'operator':'list',
                'defaults':{
                    'attributes':{
                        'class':'form-control spinbox-input', 
                        'autocomplete':'off',
                        'size':'4'
                    },
                    'spinboxConfig':{
                        'value':1,
                        'min':1,
                        'max':999,
                        'step':1,
                        'hold':true,
                        'speed':'medium',
                        'disabled':false,
                        'units':[]
                    }
                }
            }
        ));
        
        this.collection = new Backbone.Collection();
        this.collection.on('update', this.render, this);
        this.collection.on('reset', this.render, this);
        
        this.model.on('change:currentDatasource', 
            this.render, this);
        
        this.datasources = new Backbone.Collection();
    },
    
    'render':function(mod, value, opts) {
        var cds = this.model.get('currentDatasource');
        this.$el.empty().append(this.template(
            {
                'attributes':cds.has('attributes') ? cds.get('attributes') :
                    this.model.get('defaults').attributes,
                'numbers':this.collection
            }
        ));
        $('div.spinbox', this.$el).spinbox(
            cds.has('spinboxConfig') ? cds.get('spinboxConfig') : 
                this.model.get('defaults').spinboxConfig);
        return this.$el;
    }
});


var DateEqualsFilterWidget = Backbone.View.extend(
/** @lends DateEqualsFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function DateEqualsFilterWidget#show
     * @return {DateEqualsFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function DateEqualsFilterWidget#hide
     * @return {DateEqualsFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function DateEqualsFilterWidget#enable
     * @return {DateEqualsFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function DateEqualsFilterWidget#disable
     * @return {DateEqualsFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function DateEqualsFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var d = $('div.date', this.$el).datepicker('getUTCDate');
        if(d && !isNaN(d.getTime())) {
            return {
                'operator':this.getOperator(),
                'value':d.valueOf(),
                'description':['is equal to',moment.utc(d).format('M/D/YYYY')].join(' ')
            }
        } else {
            return false;
        }
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function DateEqualsFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {DateEqualsFilterWidget}
     */
    'set':function(filterValue) {
        if(filterValue.value) {
            $('div.date', this.$el).datepicker(
                'setUTCDate', 
                moment.utc(filterValue.value).toDate()
            );
        }
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their 
     * default state and value.
     * @function DateEqualsFilterWidget#reset
     * @return {DateEqualsFilterWidget}
     */
    'reset':function() {
        $('div.date', this.$el).datepicker('update', null);
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function DateEqualsFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.DATEPICKER_TEMPLATE, {'variable':'config'}),
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} DateEqualsFilterWidget
     * @class
     * @classdesc A widget for date data type that is equal to a value.
     * @version 1.0.8
     * @constructs DateEqualsFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     * @param {object} [options.attributes={class:"form-control date", autocomplete:"off", size:'12', value:""}] - 
     * The attributes that will applied to the input element in this control.
     * @param {object} [options.datepickerConfig={autoclose:false, clearBtn:true, format:$.fn.ColumnFilters.DateFormats.en_us, minViewMode:$.fn.ColumnFilters.DatepickerViewModes.DAYS, startView:$.fn.ColumnFilters.DatepickerStartViewModes.MONTH, todayBtn:true, todayHighlight:true, weekStart:$.fn.ColumnFilters.DatepickerWeekStartDays.SUNDAY}] - The datepicker configuration options object.
     */
    'initialize':function(options) {
        this.version = '1.0.8';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof DateEqualsFilterWidget.prototype
         * @protected
         * @property {string} operator='equals' - the type of filter matching 
         * that this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'attributes':{
                    'class':'form-control date', 
                    'autocomplete':'off',
                    'size':'12',
                    'value':''
                },
                'datepickerConfig':{
                    'autoclose':false,
                    'clearBtn':true,
                    'format':$.fn.ColumnFilters.DateFormats.en_us,
                    'minViewMode':$.fn.ColumnFilters.DatepickerViewModes.DAYS,
                    'startView':$.fn.ColumnFilters.DatepickerStartViewModes.MONTH,
                    'todayBtn':true,
                    'todayHighlight':true,
                    'weekStart':$.fn.ColumnFilters.DatepickerWeekStartDays.SUNDAY
                }
            },
            options, 
            {'operator':'equals'}
        ));
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        $('div.date', this.$el).datepicker(this.model.get('datepickerConfig'));
        return this.$el;
    }
});


var DateAfterFilterWidget = Backbone.View.extend(
/** @lends DateAfterFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function DateAfterFilterWidget#show
     * @return {DateAfterFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function DateAfterFilterWidget#hide
     * @return {DateAfterFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function DateAfterFilterWidget#enable
     * @return {DateAfterFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function DateAfterFilterWidget#disable
     * @return {DateAfterFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * 
     * @function DateAfterFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var d = $('div.date', this.$el).datepicker('getUTCDate');
        if(d && !isNaN(d.getTime())) {
            return {
                'operator':this.getOperator(),
                'value':d.valueOf(),
                'description':['is after',moment.utc(d).format('M/D/YYYY')].join(' ')
            }
        } else {
            return false;
        }
    },
    
    /**
     * 
     * @function DateAfterFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {DateAfterFilterWidget}
     */
    'set':function(filterValue) {
        if(filterValue.value) {
            $('div.date', this.$el).datepicker(
                'setUTCDate', 
                moment.utc(filterValue.value).toDate()
            );
        }
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function DateAfterFilterWidget#reset
     * @return {DateAfterFilterWidget}
     */
    'reset':function() {
        $('div.date', this.$el).datepicker('update', null);
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function DateAfterFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.DATEPICKER_TEMPLATE, 
        {'variable':'config'}),
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} DateAfterFilterWidget
     * @class
     * @classdesc A widget for text data type that is equal to a value.
     * @version 1.0.5
     * @constructs DateAfterFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.5';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof DateAfterFilterWidget.prototype
         * @protected
         * @property {string} operator='' - the type of filter matching that this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'attributes':{
                    'class':'form-control date', 
                    'autocomplete':'off',
                    'size':'12',
                    'value':''
                },
                'datepickerConfig':{
                    'autoclose':false,
                    'clearBtn':true,
                    'format':$.fn.ColumnFilters.DateFormats.en_us,
                    'minViewMode':$.fn.ColumnFilters.DatepickerViewModes.DAYS,
                    'startView':$.fn.ColumnFilters.DatepickerStartViewModes.MONTH,
                    'todayBtn':true,
                    'todayHighlight':true,
                    'weekStart':$.fn.ColumnFilters.DatepickerWeekStartDays.SUNDAY
                }
            },
            options, 
            {'operator':'after'}
        ));
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        $('div.date', this.$el).datepicker(this.model.get('datepickerConfig'));
        return this.$el;
    }
});


var DateBeforeFilterWidget = Backbone.View.extend(
/** @lends DateBeforeFilterWidget.prototype */{
    
    /**
     * Displays this View instance.
     * @function DateBeforeFilterWidget#show
     * @return {DateBeforeFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function DateBeforeFilterWidget#hide
     * @return {DateBeforeFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function DateBeforeFilterWidget#enable
     * @return {DateBeforeFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function DateBeforeFilterWidget#disable
     * @return {DateBeforeFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * 
     * @function DateBeforeFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var d = $('div.date', this.$el).datepicker('getUTCDate');
        if(d && !isNaN(d.getTime())) {
            return {
                'operator':this.getOperator(),
                'value':d.valueOf(),
                'description':['is before',moment.utc(d).format('M/D/YYYY')].join(' ')
            }
        } else {
            return false;
        }
    },
    
    /**
     * 
     * @function DateBeforeFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {DateBeforeFilterWidget}
     */
    'set':function(filterValue) {
        if(filterValue.value) {
            $('div.date', this.$el).datepicker(
                'setUTCDate', 
                moment.utc(filterValue.value).toDate()
            );
        }
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function DateBeforeFilterWidget#reset
     * @return {DateBeforeFilterWidget}
     */
    'reset':function() {
        $('div.date', this.$el).datepicker('update', null);
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function DateBeforeFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.DATEPICKER_TEMPLATE, 
        {'variable':'config'}),
    
    
    'tagName':'fieldset',
        
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} DateBeforeFilterWidget
     * @class
     * @classdesc A widget for text data type that is equal to a value.
     * @version 1.0.5
     * @constructs DateBeforeFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.5';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof DateBeforeFilterWidget.prototype
         * @protected
         * @property {string} operator='' - the type of filter matching that this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'attributes':{
                    'class':'form-control date', 
                    'autocomplete':'off',
                    'size':'12',
                    'value':''
                },
                'datepickerConfig':{
                    'autoclose':false,
                    'clearBtn':true,
                    'format':$.fn.ColumnFilters.DateFormats.en_us,
                    'minViewMode':$.fn.ColumnFilters.DatepickerViewModes.DAYS,
                    'startView':$.fn.ColumnFilters.DatepickerStartViewModes.MONTH,
                    'todayBtn':true,
                    'todayHighlight':true,
                    'weekStart':$.fn.ColumnFilters.DatepickerWeekStartDays.SUNDAY
                }
            },
            options, 
            {'operator':'before'}
        ));
        
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        $('div.date', this.$el).datepicker(this.model.get('datepickerConfig'));
        return this.$el;
    }
});


var DateBetweenFilterWidget = Backbone.View.extend(
/** @lends DateBetweenFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function DateBetweenFilterWidget#show
     * @return {DateBetweenFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function DateBetweenFilterWidget#hide
     * @return {DateBetweenFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function DateBetweenFilterWidget#enable
     * @return {DateBetweenFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function DateBetweenFilterWidget#disable
     * @return {DateBetweenFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function DateBetweenFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var dfrom = $('input:first-child', this.$el).datepicker('getUTCDate'),
            dto = $('input:last-child', this.$el).datepicker('getUTCDate'),
            fromDateCheck = _.isDate(dfrom) ? dfrom.valueOf() : NaN,
            toDateCheck = _.isDate(dto) ? dto.valueOf() : NaN;
        if( (!isNaN(fromDateCheck) && !isNaN(toDateCheck)) && (fromDateCheck <= toDateCheck) ) {
            return {
                'operator':this.getOperator(),
                'fromDate':fromDateCheck,
                'toDate':toDateCheck,
                'description':[
                    'is between',
                    moment.utc(dfrom).format('M/D/YYYY'),
                    'and',
                    moment.utc(dto).format('M/D/YYYY')
                ].join(' ')
            };
        } else {
            return false;
        }
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function DateBetweenFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {DateBetweenFilterWidget}
     */
    'set':function(filterValue) {
        $('input:first-child', this.$el).datepicker('setUTCDate', 
            moment.utc(filterValue.fromDate).toDate());
        $('input:last-child', this.$el).datepicker('setUTCDate', 
            moment.utc(filterValue.toDate).toDate());
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their 
     * default state and value.
     * @function DateBetweenFilterWidget#reset
     * @return {DateBetweenFilterWidget}
     */
    'reset':function() {
        $('input:first-child', this.$el).datepicker('update', null);
        $('input:last-child', this.$el).datepicker('update', null);
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function DateBetweenFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.DATEPICKER_BETWEEN_TEMPLATE, 
        {'variable':'config'}
    ),
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} DateBetweenFilterWidget
     * @class
     * @classdesc A widget for text data type that is equal to a value.
     * @version 1.0.8
     * @constructs DateBetweenFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.8';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof DateBetweenFilterWidget.prototype
         * @protected
         * @property {string} operator='between' - the type of filter matching 
         * that this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'fromAttributes':{
                    'class':'form-control date', 
                    'autocomplete':'off',
                    'size':'12',
                    'value':''
                },
                'toAttributes':{
                    'class':'form-control date', 
                    'autocomplete':'off',
                    'size':'12',
                    'value':''
                },
                'datepickerConfig':{
                    'autoclose':false,
                    'clearBtn':true,
                    'format':$.fn.ColumnFilters.DateFormats.en_us,
                    'minViewMode':$.fn.ColumnFilters.DatepickerViewModes.DAYS,
                    'startView':$.fn.ColumnFilters.DatepickerStartViewModes.MONTH,
                    'todayBtn':true,
                    'todayHighlight':true,
                    'weekStart':$.fn.ColumnFilters.DatepickerWeekStartDays.SUNDAY
                }
            },
            options, 
            {'operator':'between'}
        ));
        
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        $('div.input-daterange', this.$el).datepicker(this.model.get('datepickerConfig'));
        return this.$el;
    }
});


var DateListFilterWidget = Backbone.View.extend(
/** @lends DateListFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function DateListFilterWidget#show
     * @return {DateListFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function DateListFilterWidget#hide
     * @return {DateListFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function DateListFilterWidget#enable
     * @return {DateListFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function DateListFilterWidget#disable
     * @return {DateListFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function DateListFilterWidget#get
     * @return {object}
     */
    'get':function() {
        if(this.collection.length<1) {
            return false;
        }
        return {
            'operator':this.getOperator(),
            'value':this.collection.map(function(d){
                return moment.utc(d.get('date')).valueOf()
            }),
            'description':[
                'is one of these (',
                $.map(this.collection.models, function(m){
                    return moment.utc(m.get('date')).format('M/D/YYYY')
                }),
                ')'
            ].join('')
        }
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function DateListFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {DateListFilterWidget}
     */
    'set':function(filterValue) {
        this.collection.reset(
            _.map(filterValue.value, function(timestamp) {
                return {'date':moment.utc(timestamp).toDate()}
            })
        );
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function DateListFilterWidget#reset
     * @return {DateListFilterWidget}
     */
    'reset':function() {
        this.collection.reset();
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function DateListFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.DATE_LIST_TEMPLATE, 
        {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} namespaced.event - Event handler function
     */
    'events':{
        'click button.cf-fw-numberList-btn-add':function(e) {
            var d = $('div.date', this.$el).datepicker('getUTCDate');
            if(d && !isNaN(d.valueOf()) && this.collection.where({'date':d}).length<1) {
                this.collection.add({'date':d});
            }
        },
        'click button.close':function(e) {
            this.collection.remove($(e.currentTarget).data('cid'));
            return false;
        }
    },
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget form-inline',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} DateListFilterWidget
     * @class
     * @classdesc A widget for text data type that is equal to a value.
     * @version 1.0.11
     * @constructs DateListFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.11';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof DateListFilterWidget.prototype
         * @protected
         * @property {string} operator='' - the type of filter matching that this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'attributes':{
                    'class':'form-control date', 
                    'autocomplete':'off',
                    'size':'12'
                },
                'datepickerConfig':{
                    'autoclose':true,
                    'clearBtn':true,
                    'format':$.fn.ColumnFilters.DateFormats.en_us,
                    'minViewMode':$.fn.ColumnFilters.DatepickerViewModes.DAYS,
                    'startView':$.fn.ColumnFilters.DatepickerStartViewModes.MONTH,
                    'todayBtn':true,
                    'todayHighlight':true,
                    'weekStart':$.fn.ColumnFilters.DatepickerWeekStartDays.SUNDAY
                }
            },
            options, 
            {'operator':'list'}
        ));
        
        this.collection = new Backbone.Collection();
        this.collection.on('update', this.render, this);
        this.collection.on('reset', this.render, this);
        
        this.render();
    },
    
    'render':function(col, opt) {
        this.$el.empty().append(this.template($.extend(
            this.model.toJSON(),
            {'dates':this.collection}
        )));
        $('div.date', this.$el).datepicker(this.model.get('datepickerConfig'));
        return this.$el;
    }
});


var DateMonthFilterWidget = Backbone.View.extend(
/** @lends DateMonthFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function DateMonthFilterWidget#show
     * @return {DateMonthFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function DateMonthFilterWidget#hide
     * @return {DateMonthFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function DateMonthFilterWidget#enable
     * @return {DateMonthFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function DateMonthFilterWidget#disable
     * @return {DateMonthFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function DateMonthFilterWidget#get
     * @return {object}
     */
    'get':function() {
        return {
            'operator':this.getOperator(),
            'value':$('select', this.$el).val(),
            'description':[
                'is in',
                moment({'month':$('select', this.$el).val()*1}).format('MMMM')
            ].join(' ')
        };
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function DateMonthFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {DateMonthFilterWidget}
     */
    'set':function(filterValue) {
        if(filterValue.value>-1 && filterValue.value<12) {
            $('select', this.$el).val(filterValue.value);
        }
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their 
     * default state and value.
     * @function DateMonthFilterWidget#reset
     * @return {DateMonthFilterWidget}
     */
    'reset':function() {
        $('select', this.$el).val(0);
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function DateMonthFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template([
        '<div class="input-group">',
            '<select class="form-control input-sm">',
            '<% for(var i in config.months) { %>',
                '<option value="<%= ((i*1)) %>"><%= config.months[i] %></option>',
            '<% } %>',
            '</select>',
        '</div>'
        ].join(''), 
        {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} namespaced.event - Event handler function
     */
    'events':{
        
    },
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} DateMonthFilterWidget
     * @class
     * @classdesc A widget for text data type that is equal to a value.
     * @version 1.0.8
     * @constructs DateMonthFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.8';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof DateMonthFilterWidget.prototype
         * @protected
         * @property {string} operator='month' - the type of filter matching that 
         * this widget would perform
         * @property {string[]} months - array of months
         */
        this.model = new Backbone.Model($.extend(
            {
                'attributes':{
                    'class':'form-control', 
                    'autocomplete':'off'
                }
            },
            options, 
            {
                'operator':'month',
                'months':[
                    'January', 'February', 'March', 'April',
                    'May', 'June', 'July', 'August',
                    'September', 'October', 'November', 'December'
                ]
            }
        ));
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        return this.$el;
    }
});


var DateMonthYearFilterWidget = Backbone.View.extend(
/** @lends DateMonthYearFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function DateMonthYearFilterWidget#show
     * @return {DateMonthYearFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function DateMonthYearFilterWidget#hide
     * @return {DateMonthYearFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function DateMonthYearFilterWidget#enable
     * @return {DateMonthYearFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function DateMonthYearFilterWidget#disable
     * @return {DateMonthYearFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function DateMonthYearFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var year = $('div.date', this.$el).datepicker('getUTCDate');
        if(year) {
            return {
                'operator':this.getOperator(),
                'month':$('select', this.$el).val()*1,
                'year':moment.utc(year).year(),
                'start':moment.utc(year).valueOf(),
                'description':[
                    'is in',
                    moment.utc({'month':$('select', this.$el).val()*1}).format('MMMM'),
                    'of year',
                    moment.utc(year).format('YYYY')
                ].join(' ')
            };
        }
        return false;
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function DateMonthYearFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {DateMonthYearFilterWidget}
     */
    'set':function(filterValue) {
        if(filterValue.month && filterValue.year) {
            $('select', this.$el).val(filterValue.month);
            $('div.date', this.$el).datepicker('update', 
                moment({'year':filterValue.year}).toDate());
        }
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their 
     * default state and value.
     * @function DateMonthYearFilterWidget#reset
     * @return {DateMonthYearFilterWidget}
     */
    'reset':function() {
        $('select', this.$el).val(0);
        $('div.date', this.$el).datepicker('update', null);
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function DateMonthYearFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template([
        '<div class="form-group pull-left">',
            '<select class="form-control input-sm">',
            '<% for(var i in config.months) { %>',
                '<option value="<%= ((i*1)) %>"><%= config.months[i] %></option>',
            '<% } %>',
            '</select>',
        '</div>',
        '<div class="form-group pull-left">',
            '<div class="input-group date">',
                '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
                '<span class="input-group-addon">',
                    '<span class="glyphicon glyphicon-calendar"></span>',
                '</span>',
            '</div>',
        '</div>',
    ].join(''), {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} namespaced.event - Event handler function
     */
    'events':{
        
    },
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} DateMonthYearFilterWidget
     * @class
     * @classdesc A widget for text data type that is equal to a value.
     * @version 1.0.4
     * @constructs DateMonthYearFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.4';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof DateMonthYearFilterWidget.prototype
         * @protected
         * @property {string} operator='' - the type of filter matching that this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'attributes':{
                    'class':'form-control date', 
                    'autocomplete':'off',
                    'size':'12',
                    'value':''
                }
            },
            options, 
            {
                'operator':'monthYear',
                'datepickerConfig':{
                    'autoclose':true,
                    'clearBtn':true,
                    'format':$.fn.ColumnFilters.DateFormats.year,
                    'minViewMode':$.fn.ColumnFilters.DatepickerViewModes.YEARS,
                    'startView':$.fn.ColumnFilters.DatepickerStartViewModes.DECADE
                },
                'months':[
                    'January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August',
                     'September', 'October', 'November', 'December'
                ]
            }
        ));
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        $('div.date', this.$el).datepicker(this.model.get('datepickerConfig'));
        return this.$el;
    }
});


var DateYearFilterWidget = Backbone.View.extend(
/** @lends DateYearFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function DateYearFilterWidget#show
     * @return {DateYearFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function DateYearFilterWidget#hide
     * @return {DateYearFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function DateYearFilterWidget#enable
     * @return {DateYearFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function DateYearFilterWidget#disable
     * @return {DateYearFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function DateYearFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var d = $('div.date', this.$el).datepicker('getUTCDate');
        if(d && !isNaN(d.getTime())) {
            return {
                'operator':this.getOperator(),
                'value':moment.utc(d).year(),
                'start':moment.utc(d).valueOf(),
                'description':['year is',moment.utc(d).format('YYYY')].join(' ')
            }
        }
        return false;
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function DateYearFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {DateYearFilterWidget}
     */
    'set':function(filterValue) {
        if(_.isFinite(filterValue.value)) {
            $('div.date', this.$el).datepicker('setUTCDate', 
                new Date(filterValue.value, 1, 1));
        }
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function DateYearFilterWidget#reset
     * @return {DateYearFilterWidget}
     */
    'reset':function() {
        $('div.date', this.$el).datepicker('update', null);
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function DateYearFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.DATEPICKER_TEMPLATE, 
        {'variable':'config'}),
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} DateYearFilterWidget
     * @class
     * @classdesc A widget for text data type that is equal to a value.
     * @version 1.0.5
     * @constructs DateYearFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.5';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof DateYearFilterWidget.prototype
         * @protected
         * @property {string} operator='year' - the type of filter matching 
         * that this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'attributes':{
                    'class':'form-control date', 
                    'autocomplete':'off',
                    'size':'6',
                    'value':''
                }
            },
            options, 
            {
                'operator':'year',
                'datepickerConfig':{
                    'autoclose':true,
                    'clearBtn':true,
                    'format':$.fn.ColumnFilters.DateFormats.year,
                    'minViewMode':$.fn.ColumnFilters.DatepickerViewModes.YEARS,
                    'startView':$.fn.ColumnFilters.DatepickerStartViewModes.DECADE
                }
            }
        ));
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        $('div.date', this.$el).datepicker(this.model.get('datepickerConfig'));
        return this.$el;
    }
});


var BooleanEqualsFilterWidget = Backbone.View.extend(
/** @lends BooleanEqualsFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function BooleanEqualsFilterWidget#show
     * @return {BooleanEqualsFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function BooleanEqualsFilterWidget#hide
     * @return {BooleanEqualsFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function BooleanEqualsFilterWidget#enable
     * @return {BooleanEqualsFilterWidget}
     */
    'enable':function() {
       this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function BooleanEqualsFilterWidget#disable
     * @return {BooleanEqualsFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * 
     * @function BooleanEqualsFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var val = $('label.active input', this.$el).val()*1,
            cds = this.model.get('currentDatasource'),
            convertNumeric = cds.has('convertNumeric') ? 
                cds.get('convertNumeric') :
                this.model.get('defaults').convertNumeric;
        return {
            'operator':this.getOperator(),
            'column':cds.get('data'),
            'value':convertNumeric ? val : Boolean(val),
            'description':[
                'is',
                val ? 
                    (cds.has('trueLabel') ? 
                        cds.get('trueLabel') : 
                        this.model.get('defaults').trueLabel) : 
                    (cds.has('falseLabel') ? 
                        cds.get('falseLabel') : 
                        this.model.get('defaults').falseLabel)
            ].join(' ')
        }
    },
    
    /**
     * 
     * @function BooleanEqualsFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {BooleanEqualsFilterWidget}
     */
    'set':function(filterValue) {
        this.useDatasource(filterValue.column);
        $('label', this.$el).first().toggleClass('active', filterValue.value);
        $('label', this.$el).last().toggleClass('active', !filterValue.value);
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function BooleanEqualsFilterWidget#reset
     * @return {BooleanEqualsFilterWidget}
     */
    'reset':function() {
        this.model.trigger('change:currentDatasource');
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function BooleanEqualsFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    /**
     * Adds a single or multiple datasource objects to this View's collection.
     * @function BooleanEqualsFilterWidget#addDatasource
     * @param {object|object[]} ds - A column data object that includes a 
     * datasource property, or an array of datasource objects. 
     * @return {BooleanEqualsFilterWidget}
     */
    'addDatasource':function(ds) {
        if(_.isArray(ds)) {
            for(var i in ds) {
                this.collection.add(ds[i]);
            }
            
        } else if(_.isObject(ds)) {
            this.collection.add(ds);
        }
        
        if(this.model.get('currentDatasourceIndex')<0) {
            this.model.set('currentDatasourceIndex', 0);
            this.model.set('currentDatasource', 
                this.collection.at(this.model.get('currentDatasourceIndex')));
        }
        
        return this;
    },
    
    /**
     * Attempts to change the current datasource by comparing the passed table 
     * and column parameters.
     * @function BooleanEqualsFilterWidget#useDatasource
     * @param {string} column - the column/data property of the datasource
     * @return {boolean} - true when the datasource was changed
     */
    'useDatasource':function(column) {
        // and if column == currentDatasource.get('data')
        var currentDS = this.model.get('currentDatasource'), 
            newDSIndex;
        
        if(currentDS.get('data')===column) {
            return false;
        }
        
        // change datasource
        newDSIndex = _.findIndex(this.collection.toJSON(), function(c) { 
            return c.data===column
        });
        if(newDSIndex>-1) {
            this.model.set('currentDatasourceIndex', newDSIndex);
            this.model.set('currentDatasource', 
                this.collection.at(this.model.get('currentDatasourceIndex')
            ));
        }
        
        return true;
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template([
        '<div class="btn-group" data-toggle="buttons">',
            '<label class="btn btn-primary<% if(config.value) { %> active<% } %>">',
                '<input type="radio"<% if(config.value) { %> checked="checked"<% } %> value="1" /> <%= config.trueLabel %>',
            '</label>',
            '<label class="btn btn-primary<% if(!config.value) { %> active<% } %>">',
                '<input type="radio"<% if(!config.value) { %> checked="checked"<% } %> value="0" /> <%= config.falseLabel %>',
            '</label>',
        '</div>'
    ].join(''), {'variable':'config'}),
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} BooleanEqualsFilterWidget
     * @class
     * @classdesc A widget for boolean data type that is equal to a value.
     * @version 1.0.4
     * @constructs BooleanEqualsFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.4';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof BooleanEqualsFilterWidget.prototype
         * @protected
         * @property {string} operator='equals' - the type of filter matching 
         * this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'currentDatasource':null,
                'currentDatasourceIndex':-1
            },
            options, 
            {
                'operator':'equals',
                'defaults':{
                    'trueLabel':'Yes',
                    'falseLabel':'No',
                    'convertNumeric':false,
                    'value':true
                }
                
            }
        ));
        
        this.model.on('change:currentDatasource', 
            this.render, this);
        
        this.collection = new Backbone.Collection();
    },
    
    'render':function(mod, value, opts) {
        // set model values with values in currectDatasource
        var cds = this.model.get('currentDatasource');
        this.$el.empty().append(this.template($.extend(
            {
                'trueLabel':cds.has('trueLabel') ? 
                    cds.get('trueLabel') : 
                    this.model.get('defaults').trueLabel,
                'falseLabel':cds.has('falseLabel') ? 
                    cds.get('falseLabel') : 
                    this.model.get('defaults').falseLabel,
                'value':cds.has('value') ? 
                    cds.get('value') : 
                    this.model.get('defaults').value
            }
        )));
        return this.$el;
    }
});


var EnumEqualsFilterWidget = Backbone.View.extend(
/** @lends EnumEqualsFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function EnumEqualsFilterWidget#show
     * @return {EnumEqualsFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function EnumEqualsFilterWidget#hide
     * @return {EnumEqualsFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function EnumEqualsFilterWidget#enable
     * @return {EnumEqualsFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function EnumEqualsFilterWidget#disable
     * @return {EnumEqualsFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Returns a filter value with the value property populated with an array 
     * of values from the checked options in the current datasource list. Will 
     * return false if no options are checked. 
     * @function EnumEqualsFilterWidget#get
     * @return {object|false}
     */
    'get':function() {
        var checkedValues = $.map($('input:checked', this.$el), 
            function(e, i) {
                return {'code':e.value, 'name':$(e).data('label')}
            }
        );
        if(checkedValues.length) {
            return {
                'operator':this.getOperator(),
                'table':this.model.get('currentDatasource').get('referenceTable'),
                'column':this.model.get('currentDatasource').get('data'),
                'value':checkedValues,
                'description':['is one of these: (',_.pluck(checkedValues, 'name').join(', '),')'].join('')
            };
        }
        return false;
    },
    
    /**
     * 
     * @function EnumEqualsFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {EnumEqualsFilterWidget}
     */
    'set':function(filterValue) {
        // make sure the datasource is correct
        this.useDatasource(filterValue.table, filterValue.column);
        $('input', this.$el).each(function(i, e) {
            e.checked = _.contains(_.pluck(filterValue.value, 'code'), e.value);
        });
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function EnumEqualsFilterWidget#reset
     * @return {EnumEqualsFilterWidget}
     */
    'reset':function() {
        this.model.trigger('change:currentDatasource');
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function EnumEqualsFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    /**
     * Adds a single or multiple datasource objects to this View's collection.
     * @function EnumEqualsFilterWidget#addDatasource
     * @param {object|object[]} ds - A column data object that includes a 
     * datasource property, or an array of datasource objects. 
     * @return {EnumEqualsFilterWidget}
     */
    'addDatasource':function(ds) {
        if(_.isArray(ds)) {
            for(var i in ds) {
                this.collection.add(ds[i]);
            }
            
        } else if(_.isObject(ds)) {
            this.collection.add(ds);
        }
        
        if(this.model.get('currentDatasourceIndex')<0) {
            this.model.set('currentDatasourceIndex', 0);
            this.model.set('currentDatasource', 
                this.collection.at(this.model.get('currentDatasourceIndex')));
        }
        
        return this;
    },
    
    /**
     * Attempts to change the current datasource by comparing the passed table 
     * and column parameters.
     * @function EnumEqualsFilterWidget#useDatasource
     * @param {string} table - the table property of the datasource
     * @param {string} column - the column/data property of the datasource
     * @return {boolean} - true when the datasource was changed
     */
    'useDatasource':function(table, column) {
        // check if table == currentDatasource.get('referenceTable')
        // and if column == currentDatasource.get('data')
        var currentDS = this.model.get('currentDatasource'), 
            newDSIndex;
        
        if(currentDS.get('referenceTable')===table && currentDS.get('data')===column) {
            return false;
        }
        
        // change datasource
        newDSIndex = _.findIndex(this.collection.toJSON(), function(c) { 
            return c.referenceTable===table && c.data===column
        });
        if(newDSIndex>-1) {
            this.model.set('currentDatasourceIndex', newDSIndex);
            this.model.set('currentDatasource', this.collection.at(this.model.get('currentDatasourceIndex')));
        }
        return true;
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template([
        '<div class="dropdown">',
            '<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                'Select',    
                '<span class="caret"></span>',
            '</button>',
            '<ul class="dropdown-menu cf-enum-dropdown-list">',
            '<% var ds = config.datasources.at(config.currentDatasourceIndex); for(var i in ds.get("datasource")) { %>',
                '<li>',
                    '<div class="checkbox cf-fw-enum-list-item">',
                        '<label>',
                            '<input type="checkbox" value="<%= ds.get("datasource")[i][ds.get("valueKey")] %>" data-label="<%= ds.get("datasource")[i][ds.get("displayKey")] %>" />',
                            '<span class="text-capitalize"><%= ds.get("datasource")[i][ds.get("displayKey")] %></span>',
                        '</label>',
                    '</div>',
                '</li>',
            '<% } %>',
            '</ul>',
        '</div>'
    ].join(''), {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} namespaced.event - Event handler function
     */
    'events':{
        'change .dropdown-menu input':function(e) {
            e.stopPropagation();
            return false;
        },
        'click .dropdown-menu input, .dropdown-menu label':function(e) {
            e.stopPropagation();
        }
    },
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget',
    
    /**
     * A customized, extended Backbone.View instance. This is a filter widget 
     * that manages a selection set from a collection.
     * @typedef {Backbone-View} EnumEqualsFilterWidget
     * @class
     * @classdesc A widget for enum data type that is equal to a value.
     * @version 1.0.4
     * @constructs EnumEqualsFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.4';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof EnumEqualsFilterWidget.prototype
         * @protected
         * @property {string} operator='equals' - the type of filter matching 
         * this widget would perform
         * @property {object} currentDatasource - the current datasource object 
         * that will be used to populate the dropdown list.
         * @property {string} currentDatasource.data - the column in the table 
         * or the property name in the data set
         * @property {string} currentDatasource.displayKey - the name of the 
         * property in a datasource object that would be used as a label 
         * @property {string} currentDatasource.valueKey - the name of the 
         * property in a datasource object that would be used as the value
         * @property {string} currentDatasource.title - a descriptive title
         * @property {string} currentDatasource.table - the name of the data 
         * table or data set that this datasource object belongs to
         * @property {string} currentDatasource.datasource - the array of objects
         * @property {number} currentDatasourceIndex - the index of the object 
         * in the collection that represents the currentDatasource object 
         */
        this.model = new Backbone.Model($.extend(
            {
                'currentDatasource':null,
                'currentDatasourceIndex':-1
            },
            options, 
            {'operator':'equals'}
        ));
        
        this.model.on('change:currentDatasource', 
            this.render, this);
        
        this.collection = new Backbone.Collection();
    },
    
    'render':function(mod, value, opts) {
        this.$el.empty().append(this.template($.extend(
            this.model.toJSON(),
            {'datasources':this.collection}
        )));
        return this.$el;
    }
});


var BiglistEqualsFilterWidget = Backbone.View.extend(
/** @lends BiglistEqualsFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function BiglistEqualsFilterWidget#show
     * @return {BiglistEqualsFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function BiglistEqualsFilterWidget#hide
     * @return {BiglistEqualsFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function BiglistEqualsFilterWidget#enable
     * @return {BiglistEqualsFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function BiglistEqualsFilterWidget#disable
     * @return {BiglistEqualsFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * 
     * @function BiglistEqualsFilterWidget#get
     * @return {object}
     */
    'get':function() {
        if(this.model.get('selectedItem')) {
            var displayer = this.model.get('currentDatasource').get('displayKey');
            return {
                'operator':this.getOperator(),
                'table':this.model.get('currentDatasource').get('referenceTable'),
                'column':this.model.get('currentDatasource').get('data'),
                'value':this.model.get('selectedItem'),
                'description':[
                    'is',
                    typeof(displayer)==='string' ? 
                        this.model.get('selectedItem')[displayer] : 
                        displayer(this.model.get('selectedItem'))
                ].join(' ')
            };
        }
        return false;
    },
    
    /**
     * 
     * @function BiglistEqualsFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {BiglistEqualsFilterWidget}
     */
    'set':function(filterValue) {
        this.useDatasource(filterValue.table, filterValue.column);
        this.model.set('selectedItem', filterValue.value);
        var displayer = this.model.get('currentDatasource').get('displayKey');
        $('input.typeahead', this.$el).typeahead('val', 
            typeof(displayer)==='string' ? 
                filterValue.value[displayer] : 
                displayer(filterValue.value)
        );
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function BiglistEqualsFilterWidget#reset
     * @return {BiglistEqualsFilterWidget}
     */
    'reset':function() {
        this.model.trigger('change:currentDatasource');
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function BiglistEqualsFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    
    /**
     * Adds a single or multiple datasource objects to this View's collection.
     * @function BiglistEqualsFilterWidget#addDatasource
     * @param {object|object[]} ds - A column data object that includes a 
     * datasource property, or an array of datasource objects. 
     * @return {BiglistEqualsFilterWidget}
     */
    'addDatasource':function(ds) {
        if(_.isArray(ds)) {
            for(var i in ds) {
                this.collection.add(ds[i]);
            }
            
        } else if(_.isObject(ds)) {
            this.collection.add(ds);
        }
        
        if(this.model.get('currentDatasourceIndex')<0) {
            this.model.set('currentDatasourceIndex', 0);
            this.model.set('currentDatasource', 
                this.collection.at(this.model.get('currentDatasourceIndex')));
        }
        
        return this;
    },
    
    /**
     * Attempts to change the current datasource by comparing the passed table 
     * and column parameters.
     * @function BiglistEqualsFilterWidget#useDatasource
     * @param {string} table - the table property of the datasource
     * @param {string} column - the column/data property of the datasource
     * @return {boolean} - true when the datasource was changed
     */
    'useDatasource':function(table, column) {
        // check if table == currentDatasource.get('referenceTable')
        // and if column == currentDatasource.get('data')
        var currentDS = this.model.get('currentDatasource'), 
            newDSIndex;
        
        // even if the datasource remains the same, reset the selectedItem
        this.model.set('selectedItem', undefined);
        
        if(currentDS.get('referenceTable')===table && currentDS.get('data')===column) {
            return false;
        }
        
        // change datasource
        newDSIndex = _.findIndex(this.collection.toJSON(), function(c) { 
            return c.referenceTable===table && c.data===column
        });
        if(newDSIndex>-1) {
            this.model.set('currentDatasourceIndex', newDSIndex);
            this.model.set('currentDatasource', this.collection.at(this.model.get('currentDatasourceIndex')));
        }
        
        return true;
    },
    
    /**
     * Uses the displayer model value to return a string value of the passed item.
     * @function displayItem
     * @private
     * @param {object} item - the item from the typeahead suggestion or this view
     * @return {string} A string representation of the object parameter
     */
    'displayItem':function(item) {
        var displayer = this.model.get('currentDatasource').get('displayKey');
        return typeof(displayer)==='string' ? item[displayer] : displayer(item);
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template([
        '<input type="text" autocomplete="off" data-provide="typeahead" class="form-control typeahead" value="" />',
    ].join(''), {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} namespaced.event - Event handler function
     */
    'events':{
        'typeahead:select':function(e, suggestion) {
            // select is when the suggestion is selected either by mouse click or hitting "enter"
            this.model.set('selectedItem', suggestion);
        },
        'typeahead:autocomplete':function(e, suggestion) {
            // autocomplete is when a suggestion is chosen via a keystroke such as arrow key or tab
            this.model.set('selectedItem', suggestion);
        },
        'typeahead:change':function(e) {
            if(this.model.get('selectedItem')) {
                $('input', this.$el).typeahead('val', this.displayItem(this.model.get('selectedItem')));
            }
        },
        'typeahead:idle':function(e) {
            if(this.model.get('selectedItem')) {
                $('input.typeahead', this.$el).typeahead('val', this.displayItem(this.model.get('selectedItem')));
            }
        }
    },
    
    'tagName':'fieldset',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-widget',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} BiglistEqualsFilterWidget
     * @class
     * @classdesc A widget for biglist data type that is equal to a value.
     * @version 1.0.4
     * @constructs BiglistEqualsFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.4';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof BiglistEqualsFilterWidget.prototype
         * @protected
         * @property {string} operator='' - the type of filter matching that this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'currentDatasource':null,
                'currentDatasourceIndex':-1
            },
            options, 
            {
                'operator':'equals',
                'selectedItem':undefined
            }
        ));
        
        this.model.on('change:currentDatasource', 
            this.render, this);
        
        this.collection = new Backbone.Collection();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        var currentDS = this.model.get('currentDatasource');
        // assign typeahead to input
        $('input.typeahead', this.$el).typeahead(
            {'highlight':false, 'hint':false, 'minLength':3}, 
            {
                'name':currentDS.get('data'),
                'displayKey':currentDS.get('displayKey'),
                'source':currentDS.get('datasource').ttAdapter()
            }
        );
        
        return this.$el;
    }
});


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


/**
 * Enum for the datepicker <code>weekStart</code> configuration option. 
 * You can think of these as the inverse value of those integer values.
 * @readonly
 * @memberof $.fn.ColumnFilters
 * @enum {number}
 */
$.fn.ColumnFilters.DatepickerWeekStartDays = {
    /** The week starts on Sunday */
    'SUNDAY'    : 0,
    
    /** The week starts on Monday */
    'MONDAY'    : 1,
    
    /** The week starts on Tuesday */
    'TUESDAY'   : 2,
    
    /** The week starts on Wednesday */
    'WEDNESDAY' : 3,
    
    /** The week starts on Thursday */
    'THURSDAY'  : 4,
    
    /** The week starts on Friday */
    'FRIDAY'    : 5,
    
    /** The week starts on Saturday */
    'SATURDAY'  : 6
};


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


/**
 * These are the default values for the ColumnFilters plugin.
 * @memberof $.fn.ColumnFilters
 */
$.fn.ColumnFilters.defaults = {
     // Attributes applied to the container element created during construction.
    'wrapperAttributes':{
        
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
    'ajax':{}, // TODO do we use this?
    
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
                new TextEqualsFilterWidget(),
                new TextSearchFilterWidget()
            ]
        },
        {
            'type':'number',
            'widgets':[
                new NumberEqualsFilterWidget(),
                new NumberBetweenFilterWidget(),
                new NumberListFilterWidget()
            ]
        },
        {
            'type':'date',
            'widgets':[
                new DateEqualsFilterWidget(),
                new DateAfterFilterWidget(),
                new DateBeforeFilterWidget(),
                new DateBetweenFilterWidget(),
                new DateListFilterWidget(),
                new DateMonthFilterWidget(),
                new DateMonthYearFilterWidget(),
                new DateYearFilterWidget(),
            ]
        },
        {
            'type':'boolean',
            'widgets':[
                new BooleanEqualsFilterWidget()
            ]
        },
        {
            'type':'enum',
            'widgets':[
                new EnumEqualsFilterWidget()
            ]
        },
        {
            'type':'biglist',
            'widgets':[
                new BiglistEqualsFilterWidget()
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


    
    // any kind of extensions, helper classes, etc. to be attached to the
    // $.fn.ColumnFilters namespace
    
    // this will probably be included in a future release of Bloodhound
    $.fn.ColumnFilters.tokenizers = {
        // this is actually from a stackoverflow question/solution by kenji
        // http://stackoverflow.com/questions/22059933/twitter-typeahead-js-how-to-return-all-matched-elements-within-a-string
        'whitespace':function(datum) {
            var i, j, dset = Bloodhound.tokenizers.whitespace(datum.name);
            for(i in dset) {
                j = 0;
                while((j+1)<dset[i].length) {
                    dset.push(dset[i].substr(j++, dset[i].length));
                }
            }
            return dset;
        }
    };

    $.fn.ColumnFilters.VERSION = '1.0.2';
})(jQuery);
