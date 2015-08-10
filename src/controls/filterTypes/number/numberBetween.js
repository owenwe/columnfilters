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
            to   = $('div.cf-fw-to-date', this.$el).spinbox('value');
        if(_.isFinite(from) && _.isFinite(to)) {
            return {
                'operator':this.getOperator(),
                'from':from,
                'to':to,
                'description':['is between', from, 'and', to].join(' ')
            };
        } else {
            return false;
        }
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function NumberBetweenFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {NumberBetweenFilterWidget}
     */
    'set':function(filterValue) {
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
        $('div.cf-fw-from-date', this.$el).spinbox('value', 
            this.model.get('fromSpinboxConfig').min);
        $('div.cf-fw-to-date', this.$el).spinbox('value', 
            this.model.get('toSpinboxConfig').min);
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
     * @version 1.0.3
     * @constructs NumberBetweenFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.3';
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
                'fromAttributes':{
                    'class':'form-control spinbox-input', 
                    'autocomplete':'off',
                    'placeholder':'from',
                    'size':'4'
                },
                'toAttributes':{
                    'class':'form-control spinbox-input', 
                    'autocomplete':'off',
                    'placeholder':'to',
                    'size':'4'
                },
                'fromSpinboxConfig':{
                    'value':1,
                    'min':1,
                    'max':999,
                    'step':1,
                    'hold':true,
                    'speed':'medium',
                    'disabled':false,
                    'units':[]
                },
                'toSpinboxConfig':{
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
            {'operator':'between'}
        ));
        
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        return this.$el;
    }
});

