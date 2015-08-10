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
                'value':d.getTime(),
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

