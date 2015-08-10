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
    'className':'panel panel-default',
    
    /**
     * The main Backbone View used in this plugin.
     * @author Wes Owen wowen@ccctechcenter.org
     * @version 1.0.1
     * @typedef {Backbone-View} ColumnFilters
     * @class
     * @classdesc This view renders and controls the ColumnFilters jQuery plugin.
     * @constructs ColumnFilters
     * @extends Backbone-View
     * @param {object} options - configuration options for this View instance
     * @param {string} [options.url=null] - The url to the web service 
     * for the datatables server-side data.
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        
        // 
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
        
        // for now let's keep the filters in this view's collection
        this.collection = new Backbone.Collection(options.filters);
        // the add event will be caught here first
        this.collection.on('update', function(coll, opt) {
            // TODO 
            
        }, this);
        this.collection.on('reset', function(col, opt) {
            /*if(col) {
                this.collection.reset(col);
            } else {
                this.collection.reset();
            }*/
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
                    _.reject(options.columns, function(c){
                        return _.has(c,'cfexclude') && c.cfexclude
                    }),
                    function(c){
                        if(_.contains(['reference', 'object'], c.type)) {
                            // a table property is required for these types
                            _.extendOwn(c, {'referenceTable':c.table});
                        }
                        _.extendOwn(c, {'table':options.table});
                        return _.extendOwn(c, {
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
    },
    
    'render':function() {
        this.$el.empty();
        this.$el.append(
            this.get('columnControl').$el, 
            this.get('filtersContainer').$el, 
            this.get('filtersControl').$el
        );
        return this.$el;
    }
});


/**
 * The ColumnFilters jQuery plugin namespace. Access by using 
 * <code>$.fn.ColumnFilters</code>
 * @namespace $.fn.ColumnFilters
 */
$.fn.ColumnFilters = function(config) {
    
    if(this.length<1 || !this.is('div')) {
        console.error('ColumnFilters must be called on a <div> element');
        return;
    }
    
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
    protectedConfig.container = $('<div />').attr(
        $.fn.ColumnFilters.defaults.wrapperAttributes
    );
    this.replaceWith(protectedConfig.container);
    
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
                } else {
                    $.fn.ColumnFilters.defaults.dataTypeWidgets.push(config.dataTypeWidgets[i]);
                }
                $.extend($.fn.ColumnFilters.defaults.dataTypeWidgets,
                    config.dataTypeWidgets[i]);
            }
        }
    }
    
    $.fn.ColumnFilters.defaults = $.extend(true, 
        $.fn.ColumnFilters.defaults, 
        _.omit(config, ['dataTypeWidgets']),
        protectedConfig
    );
    thisCF = new ColumnFilters($.fn.ColumnFilters.defaults);
    $.fn.ColumnFilters.defaults.container.append(thisCF.render());
    
    // create and return a ColumnFilters object 
    return thisCF;
}

