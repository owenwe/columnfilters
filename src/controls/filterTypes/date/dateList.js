var DateListFilterWidget = Backbone.View.extend(
/** @lends DateListFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function DateListFilterWidget#show
     * @return {DateListFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function DateListFilterWidget#hide
     * @return {DateListFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function DateListFilterWidget#enable
     * @return {DateListFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function DateListFilterWidget#disable
     * @return {DateListFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function DateListFilterWidget#get
     * @return {object}
     */
    'get':function() {
        if(this.collection.length<1) {
            return false;
        }
        return {
            'operator':this.getOperator(),
            'value':this.collection.map(function(d){
                return moment.utc(d.get('date')).valueOf()
            }),
            'description':[
                'is one of these (',
                $.map(this.collection.models, function(m){
                    return moment.utc(m.get('date')).format('M/D/YYYY')
                }),
                ')'
            ].join('')
        }
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function DateListFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {DateListFilterWidget}
     */
    'set':function(filterValue) {
        this.collection.reset(
            _.map(filterValue.value, function(timestamp) {
                return {'date':moment.utc(timestamp).toDate()}
            })
        );
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function DateListFilterWidget#reset
     * @return {DateListFilterWidget}
     */
    'reset':function() {
        this.collection.reset();
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function DateListFilterWidget#getOperator
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
    'template':_.template($.fn.ColumnFilters.DATE_LIST_TEMPLATE, 
        {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} namespaced.event - Event handler function
     */
    'events':{
        'click button.cf-fw-numberList-btn-add':function(e) {
            var d = $('div.date', this.$el).datepicker('getUTCDate');
            if(d && !isNaN(d.getTime()) && this.collection.where({'date':d}).length<1) {
                this.collection.add({'date':d});
            }
        },
        'click button.close':function(e) {
            this.collection.remove($(e.currentTarget).data('cid'));
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
    'className':'cf-filter-widget form-inline',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} DateListFilterWidget
     * @class
     * @classdesc A widget for text data type that is equal to a value.
     * @version 1.0.11
     * @constructs DateListFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.11';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof DateListFilterWidget.prototype
         * @protected
         * @property {string} operator='' - the type of filter matching that this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'attributes':{
                    'class':'form-control date', 
                    'autocomplete':'off',
                    'size':'12'
                },
                'datepickerConfig':{
                    'autoclose':true,
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
            {'operator':'list'}
        ));
        
        this.collection = new Backbone.Collection();
        this.collection.on('update', this.render, this);
        this.collection.on('reset', this.render, this);
        
        this.render();
    },
    
    'render':function(col, opt) {
        this.$el.empty().append(this.template($.extend(
            this.model.toJSON(),
            {'dates':this.collection}
        )));
        $('div.date', this.$el).datepicker(this.model.get('datepickerConfig'));
        return this.$el;
    }
});

