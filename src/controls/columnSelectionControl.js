var ColumnSelectionControl = Backbone.View.extend(
/** @lends ColumnSelectionControl.prototype */
{
    /**
     * Enables user interface controls
     * @function ColumnSelectionControl#enable
     * @return ColumnSelectionControl
     */
    'enable':function() {
        // elements to disable: 
        $('fieldset.cf-filter-select-tools', this.$el).removeAttr('disabled', 'disabled');
        return this;
    },
    
    /**
     * Disabled user interface controls
     * @function ColumnSelectionControl#disable
     * @return ColumnSelectionControl
     */
    'disable':function() {
        $('fieldset.cf-filter-select-tools', this.$el).attr('disabled', 'disabled');
        return this;
    },
    
    /**
     * Displays the appropriate controls for the type of selection and sets the 
     * "activeColumn" model property if there are selected options.
     * @function ColumnSelectionControl#displayColumnSelectControl
     * @param {string} selectionType - the type of selection column/common
     * @return ColumnSelectionControl
     */
    'displayColumnSelectControl':function(selectionType) {
        var selections, selection, selectedType;
        this.model.set('filterSelectionType', selectionType);
        switch(this.model.get('filterSelectionType')) {
            // 
            case $.fn.ColumnFilters.FilterSelectionTypes.DEFAULT:
                $('div.cf-filter-type-select-common', this.$el).hide();
                $('div.cf-filter-type-select-column', this.$el).show();
                this.model.set('activeColumn', _.findWhere(
                    this.model.get('columns'), {
                        'data':$('div.cf-filter-type-select-column select', this.$el).val()
                    }
                ));
                if(this.model.get('activeColumn')) {
                    this.showFilterType(this.model.get('activeColumn').type);
                }
                break;
            // 
            case $.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE:
                $('div.cf-filter-type-select-column', this.$el).hide();
                $('div.cf-filter-type-select-common', this.$el).show();
                // selections is an array of column.data values
                selections = $('div.cf-filter-type-select-common select', this.$el).val();
                if(selections && selections.length) {
                    selection = _.findWhere(this.model.get('columns'), {'data':selections[0]});
                    if(selection) {
                        this.showFilterType(selection.type);
                        // also set active Column
                        this.model.set(
                            'activeColumn', 
                            _.filter(this.model.get('columns'), function(c){
                                return _.contains(selections, c.data)
                            }, this));
                    } else {
                        // disable the add button
                        $('button.cf-add-column-filter-button', this.$el).attr('disabled', 'disabled');
                    }
                } else {
                    // disable the add button and hide the filter factory
                    $('button.cf-add-column-filter-button', this.$el).attr('disabled', 'disabled');
                    this.model.get('filterFactory').reset().hide();//.reset()
                }
                break;
            // 
            case 'reference':
                $('div.cf-filter-type-select-common', this.$el).hide();
                $('div.cf-filter-type-select-column', this.$el).hide();
                break;
        }
        return this;
    },
    
    /**
     * Uses the parameters to enable/disable the options in the common value 
     * select form element.
     * @function ColumnSelectionControl#enableColumnsByType
     * @param {string[]} columnData - an array of values that will match the 
     * .data property in the list of columns
     * @param {string} type - the type value of the option(s) selected
     * @return ColumnSelectionControl
     */
    'enableColumnsByType':function(columnData, type) {
        if(columnData) {
            $('button.cf-add-column-filter-button', this.$el).removeAttr('disabled');
            var selectedColumns = _.filter(this.model.get('commonColumns'), 
                function(c) {
                    return _.contains(columnData, c.data)
                }, this);
            $('option', $('div.cf-filter-type-select-common select', this.$el)).each(function(i, e) {
                if($(e).data('type')!==type) {
                    $(e).attr('disabled', 'disabled').addClass('disabled');
                } else {
                    // same type, but not the same table (for enum and biglist)
                    if(_.contains(['biglist','enum'], $(e).data('type'))) {
                        // does this option have the same table value as the currently selected options?
                        if(_.contains(_.pluck(selectedColumns, 'table'), $(e).data('table'))) {
                            $(e).removeAttr('disabled').removeClass('disabled');
                        } else {
                            $(e).attr('disabled', 'disabled').addClass('disabled');
                        }
                    } else {
                        $(e).removeAttr('disabled').removeClass('disabled');
                    }
                }
            });
            // set activeColumn
            this.model.set(
                'activeColumn', 
                _.filter(this.model.get('columns'), function(c){
                    return _.contains(columnData, c.data)
                }, this)
            );
            this.showFilterType(type);
        } else {
            $('option', $('div.cf-filter-type-select-common select', this.$el)).removeAttr('disabled').removeClass('disabled');
            $('button.cf-add-column-filter-button', this.$el).attr('disabled', 'disabled');
            this.model.set('activeColumn', null);
            this.model.get('filterFactory').reset().hide();
        }
        return this;
    },
    
    /**
     * Prompts the filter factory to display the filter tool for the supplied type
     * @function ColumnSelectionControl#showFilterType
     * @param {string} type - the data type from the columns array
     * @param {string} [operator=undefined] - the filter type operator to display
     * @return ColumnSelectionControl
     */
    'showFilterType':function(type, operator) {
        var at = this.model.get('filterFactory').activeType(),
            aw = this.model.get('filterFactory').activeType(type, operator);
        if(aw) {
            $('button.cf-add-column-filter-button', this.$el).removeAttr('disabled');
            // inform filterFactory about special filter types
            switch(type) {
                case 'number':
                    this.model.get('filterFactory').configureNumberWidget(
                        this.model.get('activeColumn').data,
                        operator
                    );
                    break;
                case 'boolean':
                    this.model.get('filterFactory').configureBooleanWidget(
                        this.model.get('activeColumn').data
                    );
                    break;
                case 'enum':
                    this.model.get('filterFactory').configureEnumWidget(
                        this.model.get('activeColumn').referenceTable,
                        this.model.get('activeColumn').data
                    );
                    break;
                case 'biglist':
                    this.model.get('filterFactory').configureBiglistWidget(
                        this.model.get('activeColumn').referenceTable,
                        this.model.get('activeColumn').data
                    );
                    break;
            }
            this.model.get('filterFactory').show();
        } else {
            this.model.get('filterFactory').hide();
        }
        return this;
    },
    
    /**
     * Returns the column name(s) of the currently active column(s) in one of 
     * the select elements, or false if an option is not selected.
     * @function ColumnSelectionControl#activeColumn
     * @return {string|string[]|false}
     * @todo add a parameter to implement the ability to set the activeColumn 
     * and the interactive controls
     */
    'activeColumn':function() {
        var ac = this.model.get('activeColumn');
        if(ac) {
            switch(this.model.get('filterSelectionType')) {
                case $.fn.ColumnFilters.FilterSelectionTypes.DEFAULT:
                    return ac.data;
                    break;
                case $.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE:
                    return _.pluck(ac, 'data');
                    break;
            }
        } else {
            return false;
        }
    },
    
    /**
     * Returns the column title(s) of the currently active column(s) in one of 
     * the select elements, or false if an option is not selected. 
     * @function ColumnSelectionControl#activeLabel
     * @return {string|string[]|false}
     */
    'activeLabel':function() {
        var ac = this.model.get('activeColumn');
        if(ac) {
            switch(this.model.get('filterSelectionType')) {
                case $.fn.ColumnFilters.FilterSelectionTypes.DEFAULT:
                    return ac.title;
                    break;
                case $.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE:
                    return _.pluck(ac, 'title');
                    break;
            }
        } else {
            return false;
        }
    },
    
    /**
     * Applies the values from the passed filter into the filter factory control.
     * This is only for the column type control (for now).
     * @function ColumnSelectionControl#loadFilter
     * @param {Filter} filter
     * @return ColumnSelectionControl
     * @todo implement a way to handle common type control filters
     */
    'loadFilter':function(filter) {
        var foundModel = _.findWhere(
            this.model.get('columns'), {'data':filter.get('column')}
        );
        if(foundModel) {
            this.model.set('activeColumn', foundModel);
            $('div.cf-filter-type-select-column select', this.$el).val(foundModel.data);
            this.showFilterType(
                filter.get('type'), 
                filter.get('filterValue').operator
            ).model.get('filterFactory').loadFilter(filter);
            this.model.set('cachedFilter', filter);
        }
    },
    
    /**
     * Changes the mode of this instance.
     * @function ColumnSelectionControl#changeMode
     * @param {number} newMode - An enum value from ControlModes, if the value 
     * passed is the same as the current mode value nothing will happen.
     * @return {ColumnSelectionControl}
     */
    'changeMode':function(newMode) {
        if(_.isFinite(newMode) && this.model.get('mode')!==_.identity(newMode*1)) {
            this.model.set('mode', newMode*1);
        }
        return this;
    },
    
    'modeChangeHandler':function(m, v, options) {
        switch(this.model.get('mode')) {
            case $.fn.ColumnFilters.ControlModes.NORMAL:
                // enable stuff
                this.enable();
                $([
                   'div.cf-filter-type-select select',
                   'div.cf-filter-type-select-column select',
                   'div.cf-filter-type-select-common select',
                   'button.cf-add-column-filter-button'
               ].join(', '), this.$el).removeAttr('disabled');
                $('button.cf-add-column-filter-button', this.$el).show();
                $('div.cf-column-control-action-controls div.btn-group', this.$el).hide();
                break;
            case $.fn.ColumnFilters.ControlModes.EDIT:
                // disable everything but the operator select and widget
                $([
                   'div.cf-filter-type-select select',
                   'div.cf-filter-type-select-column select',
                   'div.cf-filter-type-select-common select',
                   'button.cf-add-column-filter-button'
               ].join(', '), this.$el).attr('disabled', 'disabled');
                $('button.cf-add-column-filter-button', this.$el).hide();
                $('div.cf-column-control-action-controls div.btn-group', this.$el).show();
                break;
            case $.fn.ColumnFilters.ControlModes.DISABLED:
                // disable everything
                this.disable();
                break;
        }
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @protected
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.COLUMN_SELECTION_CONTROL_VIEW_TEMPLATE, {'variable':'config'}),
    
     
    /**
     * 
     * @protected
     * @readonly
     * @namespace events
     * @memberof ColumnSelectionControl
     */
    'events':{
        /**
         * Change event for the filter type select
         * @event ColumnSelectionControl.events#"div.cf-filter-type-select select":change
         */
        /**
         * Handles when the filter type select triggers a change
         * @function ColumnSelectionControl.events#"div.cf-filter-type-select select":change
         * @param {object} e - the event object
         * @listens ColumnSelectionControl.events#"div.cf-filter-type-select select":change
         */
        'change div.cf-filter-type-select select':function(e) {
            this.displayColumnSelectControl($(e.currentTarget).val()*1);
        },
        
        /**
         * Change event for the common column select
         * @event ColumnSelectionControl.events#"div.cf-filter-type-select-common select":change
         * 
         */
        /**
         * Change event for the common columns select
         * @function ColumnSelectionControl.events#"div.cf-filter-type-select-common select":change
         * @param {object} e - the event object
         * @listens ColumnSelectionControl.events#"div.cf-filter-type-select-common select":change
         */
        'change div.cf-filter-type-select-common select':function(e) {
            this.enableColumnsByType(
                $(e.currentTarget).val(), 
                $(':selected', $(e.currentTarget)).data('type'));
        },
        
        /**
         * Change event for the column select
         * @event ColumnSelectionControl.events#"div.cf-filter-type-select-column select":change
         */
        /**
         * Change event handler for the column select
         * @function ColumnSelectionControl.events#"div.cf-filter-type-select-column select":change
         * @param {object} e - the event object
         * @listens ColumnSelectionControl.events#"div.cf-filter-type-select-column select":change
         */
        'change div.cf-filter-type-select-column select':function(e) {
            this.model.set('activeColumn', 
                _.findWhere(this.model.get('columns'), 
                    {'data':$(e.currentTarget).val()}));
            
            var act = this.model.get('activeColumn').type,
                at = this.model.get('filterFactory').activeType(),
                o = act===at ? 
                    this.model.get('filterFactory').getActiveWidget().getOperator() : 
                    undefined;
            this.showFilterType(this.model.get('activeColumn').type, o);
        },
        
        /**
         * Event handler when a widget triggers its cf.fw.submit submit event
         * @function ColumnSelectionControl.events#"cf.fw.submit"
         * @param {FilterWidget#"cf.fw.submit"} e - a cf.fw.submit event object
         * @param {FilterWidget#"cf.fw.submit"} filterValue - an object generated from the  FilterWidget's .get() function
         * @listens FilterWidget#"cf.fw.submit"
         * @fires ColumnSelectionControl.events#"cc.filter.add"
         */
        'cf.fw.submit':function(e, filterValue) {
            var activeWidget = this.model.get('filterFactory').getActiveWidget();
            if(activeWidget) {
                switch(this.model.get('mode')) {
                    case $.fn.ColumnFilters.ControlModes.EDIT:
                        this.model.get('cachedFilter').set({
                            'column':this.model.get('activeColumn').data,
                            'label':this.model.get('activeColumn').title,
                            'table':this.model.get('activeColumn').table,
                            'type':this.model.get('activeColumn').type,
                            'filterValue':filterValue
                        });
                        this.$el.trigger('cc.filter.save', [this.model.get('cachedFilter')]);
                        break;
                    case $.fn.ColumnFilters.ControlModes.NORMAL:
                        /**
                         * An event triggered from a filter widget acting as a proxy for 
                         * the add or save button.
                         * @event ColumnSelectionControl.events#"cc.filter.add"
                         * @property {Filter} filter - a filter with populated values
                         */
                        this.$el.trigger('cc.filter.add', [{
                            'column':this.activeColumn(),
                            'label':this.activeLabel(),
                            'table':this.model.get('activeColumn').table,
                            'type':this.model.get('activeColumn').type,
                            'filterValue':filterValue
                        }]);
                        break;
                }
            }
        },
        
        /**
         * Click event for the add filter button
         * @event ColumnSelectionControl.events#"button.cf-add-column-filter-button":click
         */
        /**
         * Click event handler for the add column filter button.
         * @function ColumnSelectionControl.events#"button.cf-add-column-filter-button":click
         * @param {object} e - the event object
         * @listens ColumnSelectionControl.events#"button.cf-add-column-filter-button":click
         * @fires ColumnSelectionControl.events#"cc.filter.add"
         */
        'click button.cf-add-column-filter-button':function(e) {
            // get value from active filter widget
            var activeWidget = this.model.get('filterFactory').getActiveWidget(),
                filterValue = activeWidget ? activeWidget.get() : false;
            if(activeWidget && filterValue) {
                switch(this.model.get('filterSelectionType')) {
                    case $.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE:
                        // .column and .label will be different
                        this.$el.trigger('cc.filter.add', [
                            {
                                'column':this.activeColumn(),
                                'label':this.activeLabel().join(', '),
                                'table':this.model.get('activeColumn')[0].table,
                                'type':this.model.get('activeColumn')[0].type,
                                'filterValue':filterValue
                           }
                        ]);
                        break;
                    case $.fn.ColumnFilters.FilterSelectionTypes.DEFAULT:
                        this.$el.trigger('cc.filter.add', [
                            {
                                'column':this.activeColumn(),
                                'label':this.activeLabel(),
                                'table':this.model.get('activeColumn').table,
                                'type':this.model.get('activeColumn').type,
                                'filterValue':filterValue
                            }
                        ]);
                        break;
                }
            }
        },
        
        /**
         * Click event from the save button.
         * @event ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-success":click
         */
        /**
         * Click event handler for the save filter button (when in edit mode).
         * @function ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-success":change
         * @param {object} e - the event object
         * @listens ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-success":change
         * @fires ColumnSelectionControl.events#"cc.filter.save"
         * @todo also put this functionality into the cf.fw.submit event handler
         */
        'click div.cf-column-control-action-controls div.btn-group button.btn-success':function(e) {
            var activeWidget = this.model.get('filterFactory').getActiveWidget(),
                filterValue = activeWidget ? activeWidget.get() : false;
                if(activeWidget && filterValue) {
                    /**
                     * An event signifying that an edited filter should be saved.
                     * @event ColumnSelectionControl.events#"cc.filter.save"
                     * @property {Filter} filter - a filter with populated values
                     */
                    this.model.get('cachedFilter').set({
                        'column':this.activeColumn(),
                        'label':this.activeLabel(),
                        'table':this.model.get('activeColumn').table,
                        'type':this.model.get('activeColumn').type,
                        'filterValue':filterValue
                    });
                    this.$el.trigger('cc.filter.save', [this.model.get('cachedFilter')]);
                }
        },
        
        /**
         * Click event from the edit filter cancel button.
         * @event ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-default":click
         */
        /**
         * Click event handler for the cancel edit filter button.
         * @function ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-default":click
         * @param {object} e - the event object
         * @listens ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-default":click
         * @fires ColumnSelectionControl.events#"cc.filter-cancel.click"
         */
        'click div.cf-column-control-action-controls div.btn-group button.btn-default':function(e) {
            /**
             * An event signifying that this mode's edit mode should be canceled.
             * @event ColumnSelectionControl.events#"fc.filter-cancel.click"
             */
            this.$el.trigger('cc.filter-cancel.click');
        }
    },
    
    /**
     * The element this View will exist as in the document.
     * @protected
     * @type {string}
     * @default
     */
    'tagName':'nav',
    
    /**
     * This View's class values.
     * @protected
     * @type {string}
     * @default
     */
    'className':'navbar navbar-default cf-column-select-control',
    
    /**
     * A customized extended Backbone-View instance
     * @class
     * @classdesc A ColumnSelectionControl manages how columns are set up for 
     * the filter factory to apply its filter.
     * @version 1.0.2
     * @extends Backbone-View
     * @constructs ColumnSelectionControl
     * 
     * @fires ColumnSelectionControl.events#"button.cf-add-column-filter-button":click
     * @fires ColumnSelectionControl.events#"div.cf-filter-type-select select":change
     * @fires ColumnSelectionControl.events#"div.cf-filter-type-select-common select":change
     * @fires ColumnSelectionControl.events#"div.cf-filter-type-select-column select":change
     * @fires ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-success":click
     * @fires ColumnSelectionControl.events#"div.cf-column-control-action-controls div.btn-group button.btn-default":click
     * 
     * @param {object} options - A configuration object passed with the constructor
     * see the {@link Backbone-View} type definition for common properties.
     * @param {Array.<Object>} options.columns - an array of column objects 
     * with "data" and "title" attributes.
     * @param {string} [options.filterSelectionType=FilterSelectionTypes.DEFAULT] - the initial 
     * type of column selection to display
     * @param {string} [options.defaultSelectedColumnValue=null] - the value of 
     * the 'data' property in the 'columns' array that will be selected in the 
     * column value select
     * @param {string[]} [options.defaultSelectedCommonValues=[]] - the values  
     * of the 'data' property in the 'columns' array that will be selected in  
     * the common value select
     * @param {object} options.filterFactoryConfig - a configuration object for 
     * the filter factory control
     * @param {number} mode [options.mode=ControlModes.NORMAL] - The default 
     * mode to set this control into
     */
    'initialize':function(options) {
        this.version = '1.0.2';
        //console.log(options);
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof ColumnSelectionControl.prototype
         * @property {FilterFactory} filterFactory - A View for managing the 
         * filter values for column(s)
         * @property {string|string[]} activeColumn - the column(s) that 
         * are actively selected in one of the select controls
         * @property {Filter} cachedFilter - A Filter passed to loadFilter when 
         * in edit mode
         */
        this.model = new Backbone.Model(
            $.extend(_.omit(options, 'filterFactoryConfig'), {
                'activeColumn':null,
                'cachedFilter':null
        }));
        
        this.model.on('change:mode', this.modeChangeHandler, this);
        
        var i, j, w, w2,
            commonColumns = [], 
            datasourcedGroup,
            // group columns by type
            groupedCol = _.groupBy(
                _.reject(this.model.get('columns'), function(c) {
                    _.has(c, 'cfexclude') && c.cfexclude
                }), 
                'type'
            ),
            currentWidget, dataTypeWidgets, widgetsCollection = []
        ;
        
        // pick out the data-backed columns where the datasources don't match
        for(i in groupedCol) {
            if(groupedCol[i].length>1) {
                if(_.contains(['biglist','enum'], i)) {
                    datasourcedGroup = _.groupBy(groupedCol[i], function(c2) {
                        return c2.table
                    });
                    for(j in datasourcedGroup) {
                        if(datasourcedGroup[j].length>1) {
                            $.merge(commonColumns, datasourcedGroup[j]);
                        }
                    }
                } else {
                    $.merge(commonColumns, groupedCol[i]);
                }
            }
        }
        this.model.set('commonColumns', commonColumns);
        
        // set activeType and activeOperator
        switch(this.model.get('filterSelectionType')) {
            case $.fn.ColumnFilters.FilterSelectionTypes.DEFAULT:
                if(!this.model.get('defaultSelectedColumnValue')) {
                    // set defaultSelectedColumnValue to the 1st column data type
                    w = this.model.get('columns')[0];
                } else {
                    w = _.findWhere(this.model.get('columns'), {
                        'data':this.model.get('defaultSelectedColumnValue')
                    })
                }
                options.filterFactoryConfig.activeType = w.type;
                this.model.set('activeColumn', w);
                break;
        }
        
        // pass number columns to the filterFactory for processing
        // pass boolean columns to the filterFactory for processing
        // pass enum columns to the filterFactory for processing
        // pass reference columns to the filterFactory for processing
        // create the filter factory
        this.model.set('filterFactory', new FilterFactory($.extend(
            options.filterFactoryConfig,
            {
                'numberColumns':_.filter(options.columns, function(c) {
                    return c.type==='number'
                }),
                'booleanColumns':_.filter(options.columns, function(c) {
                    return c.type==='boolean'
                }),
                'enumColumns':_.filter(options.columns, function(c) {
                    return c.type==='enum'
                }),
                'biglistColumns':_.filter(options.columns, function(c) {
                    return c.type==='biglist'
                })
            }
        )));
        this.model.get('filterFactory').hide().$el.addClass('form-group nav navbar-nav');
        
        this.render();
    },
    
    // this view does not get re-rendered
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        $('div.cf-filter-factory-placeholder', this.$el).replaceWith(this.model.get('filterFactory').render());
        
        if(this.model.get('defaultSelectedCommonValues').length) {
            // check if there are common columns to be selected by default
            var filteredColumns = _.filter(
                    this.model.get('commonColumns'), 
                    function(o) {
                        return _.contains(this.model.get('defaultSelectedCommonValues'), o.data)
                    },
                    this
                ),
                countedColumnTypes = _.countBy(filteredColumns, function(o){ return o.type}),
                commonColumnsTypes = _.toArray(countedColumnTypes);
            
            // if there are common columns to populate the select then apply 
            // default selected common columns
            if(commonColumnsTypes.length===1) {
                $('div.cf-filter-type-select-common select', this.$el).val(this.model.get('defaultSelectedCommonValues'));
                this.enableColumnsByType(filteredColumns[0].type);
                this.displayColumnSelectControl($.fn.ColumnFilters.FilterSelectionTypes.COMMON_VALUE);
            }
            
        } else if(this.model.get('defaultSelectedColumnValue')) {
            $('div.cf-filter-type-select-column select', this.$el).val(this.model.get('defaultSelectedColumnValue'));
            this.displayColumnSelectControl($.fn.ColumnFilters.FilterSelectionTypes.DEFAULT);
            
        } else {
            this.displayColumnSelectControl(this.model.get('filterSelectionType'));
        }
        
        // set the state according to the mode
        this.modeChangeHandler(this.model, this.model.get('mode'), {});
        
        return this.$el;
    }
});

