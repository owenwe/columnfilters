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

