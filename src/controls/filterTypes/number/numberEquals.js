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
        var value = $('div.spinbox', this.$el).spinbox('value');
        if(_.isFinite(value)) {
            return {
                'operator':this.getOperator(), 
                'value':value,
                'description':['is equal to', value].join(' ')
            };
        } else {
            // TODO tigger/handle error notification
            return false;
        }
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function NumberEqualsFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {NumberEqualsFilterWidget}
     */
    'set':function(filterValue) {
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
        $('div.spinbox', this.$el).spinbox('value', 
            this.model.get('spinboxConfig').min);
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
     * @version 1.0.4
     * @constructs NumberEqualsFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     * @param {object} [options.attributes={class:"form-control input-mini spinbox-input", autocomplete:"off", placeholder:"is equal to value", size:"6"}] - 
     * The attributes that will applied to the input element in this control.
     * @param {object} [options.spinboxConfig={}] - The configuration object 
     * for the fuelux spinbox. See the fuelux spinbox documentation for the
     * default values.
     */
    'initialize':function(options) {
        this.version = '1.0.4';
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
            },
            options, 
            {'operator':'equals'}
        ));
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        return this.$el;
    }
});

