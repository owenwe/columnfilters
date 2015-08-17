var FilterFactory = Backbone.View.extend(
/** @lends FilterFactory.prototype */
{
    /**
     * Displays this View instance.
     * @function FilterFactory#show
     * @return {FilterFactory}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function FilterFactory#hide
     * @return {FilterFactory}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Resets this control to its default state.
     * @function FilterFactory#reset
     * @return {FilterFactory}
     */
    'reset':function() {
        var aw, at, ai, ao, aoi, dtw = this.model.get('dataTypeWidgets');
        
        aw = this.getActiveWidget();
        if(aw) {
            aw.reset().hide();
        }
        
        this.model.set('activeType', dtw[0].type);
        at = this.model.get('activeType');
        this.model.set('activeIndex', 
            _.findIndex(dtw, 
                function(o){ return o.type===at }, 
                this));
        ai = this.model.get('activeIndex');
        this.model.set('activeOperator', dtw[0].widgets[0].getOperator());
        ao = this.model.get('activeOperator');
        this.model.set('activeOperatorIndex', 
            _.findIndex(dtw[ai].widgets, 
                function(o){ return o.getOperator()===ao }, 
                this));
        aoi = this.model.get('activeOperatorIndex');
        
        // re-render the operator select and reset the activeWidget
        $('select.cf-widget-operator-select', this.$el).replaceWith(
            _.template(
                $.fn.ColumnFilters.WIDGET_OPERATOR_SELECT_TEMPLATE, 
                {'variable':'config'}
            )(this.model.toJSON())
        );
        this.getActiveWidget().reset().show();
        return this;
    },
    
    /**
     * Prompts the enum filter widget(s) to set their datasource using the 
     * passed parameters.
     * @function FilterFactory#configureEnumWidget
     * @param {string} enumTable - the value of the table property
     * @param {string} enumColumn - the value of the column/data property
     * @return {FilterFactory}
     */
    'configureEnumWidget':function(enumTable, enumColumn) {
        var efw = this.getWidget('enum', 'equals');
        if(efw) {
            efw.useDatasource(enumTable, enumColumn);
        }
        return this;
    },
    
    /**
     * Prompts the biglist filter widget(s) to set their datasource using the 
     * passed parameters.
     * @function FilterFactory#configureBiglistWidget
     * @param {string} biglistTable - the value of the referenceTable property
     * @param {string} biglistColumn - the value of the column/data property
     * @return {FilterFactory}
     */
    'configureBiglistWidget':function(biglistTable, biglistColumn) {
        var bfw = this.getWidget('biglist', 'equals');
        if(bfw) {
            bfw.useDatasource(biglistTable, biglistColumn);
        }
        return this;
    },
    
    /**
     * Prompts the boolean filter widget(s) to set their datasource using the 
     * passed parameter.
     * @function FilterFactory#configureBooleanWidget
     * @param {string} booleanColumn - the value of the column/data property
     * @return {FilterFactory}
     */
    'configureBooleanWidget':function(booleanColumn) {
        var bfw = this.getWidget('boolean', 'equals');
        if(bfw) {
            bfw.useDatasource(booleanColumn);
        }
        return this;
    },
    
    /**
     * Prompts the number filter widget(s) to set their datasource using the
     * passed parameter.
     * @function FilterFactory#configureNumberWidget
     * @param {string} numberColumn - the value of the column/data property
     * @param {string} operator - the operator for the type
     * @return {FilterFactory}
     */
    'configureNumberWidget':function(numberColumn, operator) {
        var i, widgets = [],
        numberDT = _.findWhere(this.model.get('dataTypeWidgets'), {'type':'number'});;
        if(numberDT) {
            for(i in numberDT.widgets) {
                numberDT.widgets[i].useDatasource(numberColumn);
            }
        }
        return this;
    },
    
    /**
     * A function to get a filter widget by type and operator.
     * @function FilterFactory#getWidget
     * @return {FilterWidget|false} A filter widget where the type and operator 
     * match the passed parameters.
     */
    'getWidget':function(type, operator) {
        var i, tw, fw, isFound = false, dtw = this.model.get('dataTypeWidgets');
        tw = _.findWhere(dtw, {'type':type});
        if(tw) {
            for(i in tw.widgets) {
                fw = tw.widgets[i];
                if(fw.getOperator()===operator) {
                    isFound = true;
                    break;
                }
            }
            return isFound ? fw : false;
        } else {
            return false;
        }
    },
    
    
    /**
     * Returns the actively displayed widget or false if there isn't one.
     * @function FilterFactory#getActiveWidget
     * @return {Backbone-View|false}
     */
    'getActiveWidget':function() {
        var ai = this.model.get('activeIndex'),
            oi = this.model.get('activeOperatorIndex'),
            aw = false;
        if(ai>-1 && oi>-1) {
            aw = this.model.get('dataTypeWidgets')[ai].widgets[oi];
        } else if(ai>-1) {
            aw = this.model.get('dataTypeWidgets')[ai].widgets[0];
        }
        return aw;
    },
    
    /**
     * Displays the filter widget for the passed type and optional operator or 
     * returns the type of the displayed widget if no parameters are passed.
     * @function FilterFactory#activeType
     * @param {string} [type=undefined] - A value that would match the 'type' 
     * property in one of the objects in the model.dataTypeWidgets array.
     * @param {string} [operator=undefined] - A value that would match a value 
     * returned from a widget Backbone-View's .getOperator() method.
     * @return {string|FilterWidget|false}
     */
    'activeType':function(type, operator) {
        var dtw = this.model.get('dataTypeWidgets'),
            at, ai = -1, ao, aoi = -1, aw;
        
        // if the activeType is the same then just check for the operator
        if(type===this.model.get('activeType')) {
            // hide current active widget
            aw = this.getActiveWidget();
            if(aw) {
                aw.hide();
            }
            
            // set model variable for new active widget
            ai = this.model.get('activeIndex');
            if(operator) {
                this.model.set('activeOperator', operator);
                ao = this.model.get('activeOperator');
                this.model.set('activeOperatorIndex', 
                    _.findIndex(dtw[ai].widgets, 
                        function(o){ return o.getOperator()===ao }, 
                        this)
                );
                
                // set option in operator select to operator
                $('select.cf-widget-operator-select', this.$el).val(ao);
            }
            
            // show new active widget
            aw = this.getActiveWidget();
            if(aw) {
                aw.show();
            }
            return aw;
        }
        
        // activeType is not the same as passed type
        if(type) {
            if(_.contains(_.pluck(dtw, 'type'), type)) {
                // hide current active widget
                aw = this.getActiveWidget();
                if(aw) {
                    aw.hide();
                }
                
                this.model.set('activeType', type);
                at = this.model.get('activeType');
                this.model.set('activeIndex', 
                    _.findIndex(dtw, function(o){ return o.type===at }, this)
                );
                ai = this.model.get('activeIndex');
                if(operator && 
                    _.contains(_.invoke(dtw[ai].widgets, 'getOperator'), operator)) {
                    this.model.set('activeOperator', operator);
                    ao = this.model.get('activeOperator');
                    this.model.set('activeOperatorIndex', 
                        _.findIndex(dtw[ai].widgets, 
                            function(o){ return o.getOperator()===ao }, 
                            this)
                    );
                    aoi = this.model.get('activeOperatorIndex');
                } else {
                    this.model.set('activeOperator', dtw[0].widgets[0].getOperator());
                    ao = this.model.get('activeOperator');
                    this.model.set('activeOperatorIndex', 
                        _.findIndex(dtw[ai].widgets, 
                            function(o){ return o.getOperator()===ao }, 
                            this)
                    );
                }
            }
            if(ai>-1) {
                // re-render the operator select
                $('select.cf-widget-operator-select', this.$el).replaceWith(
                    _.template(
                        $.fn.ColumnFilters.WIDGET_OPERATOR_SELECT_TEMPLATE, 
                        {'variable':'config'}
                    )(this.model.toJSON())
                );
                
                aw = this.getActiveWidget();
                if(aw) {
                    aw.show();
                }
                return aw;
            } else {
                return false;
            }
        } else {
            // type is empty or not in the data type widgets
            return this.model.get('activeType');
        }
    },
    
    /**
     * Applies the values from the filter parameter into the widget that matches 
     * the filter's type and operator properties.
     * @function FilterFactory#loadFilter
     * @param {Filter} filter - A {@link ColumnFilters."#Filter"}.
     * @return {FilterFactory} This FilterFactory instance
     */
    'loadFilter':function(filter) {
        //console.log(['get the filter widget ', filter.get('type'), ', ', filter.get('filterValue').operator].join(''));
        var aw = this.activeType(filter.get('type'), filter.get('filterValue').operator);
        if(aw) {
            aw.set(filter.get('filterValue'));
        }
        return this;
    },
    
    /**
     * A function that returns the version of not just this object, but all the 
     * complex objects that this object manages.
     * @function FilterFactory#versions
     * @return {object} A JSON object where the keys represent the class or 
     * object and the values are the versions.
     */
    'versions':function() {
        var wtypes = _.keys(_.groupBy(this.model.get('dataTypeWidgets'), 'type')),
            wtv = {},
            i, j, curT, tempA;
        for (i in wtypes) {
            curT = _.findWhere(this.model.get('dataTypeWidgets'), {'type':wtypes[i]});
            tempA = [];
            for(j in curT.widgets) {
                tempA.push(_.createKeyValueObject(curT.widgets[j].getOperator(), curT.widgets[j].version));
            }
            $.extend(wtv, _.createKeyValueObject(wtypes[i], tempA));
        }
        
        return {
            'FilterFactory':this.version,
            'Data Type Widgets':wtv
        };
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.FILTER_FACTORY_VIEW_TEMPLATE, 
        {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} namespaced.event - Event handler function
     */
    'events':{
        'change select.cf-widget-operator-select':function(e) {
            // hide widget for the current activeOperator
            var aw = this.getActiveWidget();
            if(aw) {
                aw.hide();
            }
            
            // set the new values for activeOperator, activeOperatorIndex
            this.model.set('activeOperator', $(e.currentTarget).val());
            this.model.set('activeOperatorIndex', 
                $('option:selected', $(e.currentTarget)).data('index')*1);
            
            // show the widget for the new activeOperator
            this.getActiveWidget().show();
            
            // check if the active widget is a number type
            if(this.activeType()==='number') {
                this.configureNumberWidget(
                    this.getActiveWidget().model.get('currentDatasource').get('data'), 
                    this.getActiveWidget().getOperator()
                );
            }
        }
    },
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'cf-filter-factory',
    
    /**
     * The FilterFactory manages all the types of filters.
     * @typedef {Backbone-View} FilterFactory
     * @class
     * @classdesc An instance of FilterFactory will contain controls for text, number, 
     * date, enum, reference, and boolean value types. However, an instance can be 
     * configured to have a custom set of value type controls.
     * @version 1.0.2
     * @constructs FilterFactory
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     * @param {DataTypeWidget[]} options.dataTypeWidgets - An array of DataTypeWidgets.
     * @param {object[]} [options.enumColumns=[]] - An array of enum type columns.
     * @param {object[]} [options.biglistColumns=[]] - An array of biglist type columns.
     * @param {object[]} [options.booleanColumns=[]] - An array of boolean type columns.
     * @param {object[]} [options.numberColumns=[]] - An array of number type columns.
     */
    'initialize':function(options) {
        this.version = '1.0.2';
        //console.log(options);
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof FilterFactory.prototype
         * @protected
         * @property {string} activeType - the currently visible widget data type
         * @property {string} activeOperator - the currently visible widget type operator
         */
        this.model = new Backbone.Model($.extend(
            {
                'enumColumns':[],
                'biglistColumns':[],
                'booleanColumns':[],
                'numberColumns':[]
            },
            options
        ));
        
        var i, at, ai, ao, dtw = this.model.get('dataTypeWidgets');
        
        // check if activeType was passed with the config options
        if(!this.model.get('activeType')) {
            this.model.set('activeType', dtw[0].type);
        }
        
        // set activeIndex, activeOperator, and activeOperatorIndex
        at = this.model.get('activeType');
        this.model.set('activeIndex', _.findIndex(dtw, function(o){ 
            return o.type===at
            }, 
            this));
        ai = this.model.get('activeIndex');
        
        if(!this.model.get('activeOperator')) {
            ai = this.model.get('activeIndex');
            this.model.set('activeOperator', dtw[ai].widgets[0].getOperator());
            ao = this.model.get('activeOperator');
            this.model.set('activeOperatorIndex', 
                _.findIndex(dtw[ai].widgets, 
                    function(o){ return o.getOperator()===ao }, 
                    this));
        } else {
            ao = this.model.get('activeOperator');
            this.model.set('activeOperatorIndex', _.findIndex(dtw[ai].widgets, 
                function(o){ return o.getOperator()===ao }, 
                this));
        }
        
        // process enumColumns
        at = _.findWhere(dtw, {'type':'enum'});
        if(at && this.model.get('enumColumns').length) {
            for(i in at.widgets) {
                at.widgets[i].addDatasource(this.model.get('enumColumns'));
            }
        }
        
        // process biglistColumns
        at = _.findWhere(dtw, {'type':'biglist'});
        if(at && this.model.get('biglistColumns').length) {
            for(i in at.widgets) {
                at.widgets[i].addDatasource(this.model.get('biglistColumns'));
            }
        }
        
        // process booleanColumns
        at = _.findWhere(dtw, {'type':'boolean'});
        if(at && this.model.get('booleanColumns').length) {
            for(i in at.widgets) {
                at.widgets[i].addDatasource(this.model.get('booleanColumns'));
            }
        }
        
        // process numberColumns
        at = _.findWhere(dtw, {'type':'number'});
        if(at && this.model.get('numberColumns').length) {
            for(i in at.widgets) {
                at.widgets[i].addDatasource(this.model.get('numberColumns'));
            }
        }
    },
    
    /**
     * This is the View's private render method. It should only be called once 
     * to build the elements of this view.
     * @function {Dom Element} FilterFactory#render
     * @protected
     * @readonly
     */
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        
        var aw, i, j;
        
        // add all the widgets
        for(i in this.model.get('dataTypeWidgets')) {
            for(j in this.model.get('dataTypeWidgets')[i].widgets) {
                aw = this.model.get('dataTypeWidgets')[i].widgets[j];
                //console.log(aw);
                aw.hide();
                $('div.cf-data-type-control-container', this.$el).append(
                    aw.$el
                );
            }
        }
        
        // show the active widget (if there is one)
        aw = this.getActiveWidget();
        if(aw) {
            aw.show();
        }
        
        return this.$el;
    }
});

