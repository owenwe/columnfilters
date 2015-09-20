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
        },
        
        'cc.mode.change':function(e, mode) {
            // TODO 
        },
        
        // when the filter save control changes control mode
        'fsc.controlMode.change':function(e, mode) {
            switch(mode) {
                case $.fn.ColumnFilters.ControlModes.NORMAL:
                    this.get('columnControl').changeMode($.fn.ColumnFilters.ControlModes.NORMAL);
                    this.get('filtersContainer').enable();
                    break;
            }
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
     * @version 1.0.4
     * @constructs ColumnFilters
     * @extends Backbone-View
     * @param {object} options - configuration options for this View instance
     * @param {string} [options.url=null] - The url to the web service 
     * for the datatables server-side data.
     */
    'initialize':function(options) {
        this.version = '1.0.4';
        
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

