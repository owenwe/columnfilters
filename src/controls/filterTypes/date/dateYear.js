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

