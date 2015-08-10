var DateBetweenFilterWidget = Backbone.View.extend(
/** @lends DateBetweenFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function DateBetweenFilterWidget#show
     * @return {DateBetweenFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function DateBetweenFilterWidget#hide
     * @return {DateBetweenFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function DateBetweenFilterWidget#enable
     * @return {DateBetweenFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function DateBetweenFilterWidget#disable
     * @return {DateBetweenFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function DateBetweenFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var dfrom = $('input:first-child', this.$el).datepicker('getUTCDate'),
            dto = $('input:last-child', this.$el).datepicker('getUTCDate'),
            fromDateCheck = _.isDate(dfrom) ? dfrom.getTime() : NaN,
            toDateCheck = _.isDate(dto) ? dto.getTime() : NaN;
        if( (!isNaN(fromDateCheck) && !isNaN(toDateCheck)) && (fromDateCheck <= toDateCheck) ) {
            return {
                'operator':this.getOperator(),
                'fromDate':fromDateCheck,
                'toDate':toDateCheck,
                'description':[
                    'is between',
                    moment.utc(dfrom).format('M/D/YYYY'),
                    'and',
                    moment.utc(dto).format('M/D/YYYY')
                ].join(' ')
            };
        } else {
            return false;
        }
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function DateBetweenFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {DateBetweenFilterWidget}
     */
    'set':function(filterValue) {
        $('input:first-child', this.$el).datepicker('setUTCDate', 
            moment.utc(filterValue.fromDate).toDate());
        $('input:last-child', this.$el).datepicker('setUTCDate', 
            moment.utc(filterValue.toDate).toDate());
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their 
     * default state and value.
     * @function DateBetweenFilterWidget#reset
     * @return {DateBetweenFilterWidget}
     */
    'reset':function() {
        $('input:first-child', this.$el).datepicker('update', null);
        $('input:last-child', this.$el).datepicker('update', null);
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function DateBetweenFilterWidget#getOperator
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
    'template':_.template($.fn.ColumnFilters.DATEPICKER_BETWEEN_TEMPLATE, 
        {'variable':'config'}
    ),
    
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
     * @typedef {Backbone-View} DateBetweenFilterWidget
     * @class
     * @classdesc A widget for text data type that is equal to a value.
     * @version 1.0.8
     * @constructs DateBetweenFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.8';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof DateBetweenFilterWidget.prototype
         * @protected
         * @property {string} operator='between' - the type of filter matching 
         * that this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'fromAttributes':{
                    'class':'form-control date', 
                    'autocomplete':'off',
                    'size':'12',
                    'value':''
                },
                'toAttributes':{
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
            {'operator':'between'}
        ));
        
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        $('div.input-daterange', this.$el).datepicker(this.model.get('datepickerConfig'));
        return this.$el;
    }
});

