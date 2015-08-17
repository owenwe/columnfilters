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

