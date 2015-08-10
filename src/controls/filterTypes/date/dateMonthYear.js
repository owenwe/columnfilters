var DateMonthYearFilterWidget = Backbone.View.extend(
/** @lends DateMonthYearFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function DateMonthYearFilterWidget#show
     * @return {DateMonthYearFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function DateMonthYearFilterWidget#hide
     * @return {DateMonthYearFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function DateMonthYearFilterWidget#enable
     * @return {DateMonthYearFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function DateMonthYearFilterWidget#disable
     * @return {DateMonthYearFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function DateMonthYearFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var year = $('div.date', this.$el).datepicker('getUTCDate');
        if(year) {
            return {
                'operator':this.getOperator(),
                'month':$('select', this.$el).val()*1,
                'year':moment.utc(year).year(),
                'start':moment.utc(year).valueOf(),
                'description':[
                    'is in',
                    moment.utc({'month':$('select', this.$el).val()*1}).format('MMMM'),
                    'of year',
                    moment.utc(year).format('YYYY')
                ].join(' ')
            };
        }
        return false;
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function DateMonthYearFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {DateMonthYearFilterWidget}
     */
    'set':function(filterValue) {
        if(filterValue.month && filterValue.year) {
            $('select', this.$el).val(filterValue.month);
            $('div.date', this.$el).datepicker('update', 
                moment({'year':filterValue.year}).toDate());
        }
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their 
     * default state and value.
     * @function DateMonthYearFilterWidget#reset
     * @return {DateMonthYearFilterWidget}
     */
    'reset':function() {
        $('select', this.$el).val(0);
        $('div.date', this.$el).datepicker('update', null);
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function DateMonthYearFilterWidget#getOperator
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
        '<div class="form-group pull-left">',
            '<select class="form-control input-sm">',
            '<% for(var i in config.months) { %>',
                '<option value="<%= ((i*1)) %>"><%= config.months[i] %></option>',
            '<% } %>',
            '</select>',
        '</div>',
        '<div class="form-group pull-left">',
            '<div class="input-group date">',
                '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
                '<span class="input-group-addon">',
                    '<span class="glyphicon glyphicon-calendar"></span>',
                '</span>',
            '</div>',
        '</div>',
    ].join(''), {'variable':'config'}),
    
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
     * @typedef {Backbone-View} DateMonthYearFilterWidget
     * @class
     * @classdesc A widget for text data type that is equal to a value.
     * @version 1.0.4
     * @constructs DateMonthYearFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.4';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof DateMonthYearFilterWidget.prototype
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
                }
            },
            options, 
            {
                'operator':'monthYear',
                'datepickerConfig':{
                    'autoclose':true,
                    'clearBtn':true,
                    'format':$.fn.ColumnFilters.DateFormats.year,
                    'minViewMode':$.fn.ColumnFilters.DatepickerViewModes.YEARS,
                    'startView':$.fn.ColumnFilters.DatepickerStartViewModes.DECADE
                },
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
        $('div.date', this.$el).datepicker(this.model.get('datepickerConfig'));
        return this.$el;
    }
});

