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

