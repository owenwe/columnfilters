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

