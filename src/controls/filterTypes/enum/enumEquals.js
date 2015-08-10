var EnumEqualsFilterWidget = Backbone.View.extend(
/** @lends EnumEqualsFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function EnumEqualsFilterWidget#show
     * @return {EnumEqualsFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function EnumEqualsFilterWidget#hide
     * @return {EnumEqualsFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function EnumEqualsFilterWidget#enable
     * @return {EnumEqualsFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function EnumEqualsFilterWidget#disable
     * @return {EnumEqualsFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Returns a filter value with the value property populated with an array 
     * of values from the checked options in the current datasource list. Will 
     * return false if no options are checked. 
     * @function EnumEqualsFilterWidget#get
     * @return {object|false}
     */
    'get':function() {
        var checkedValues = $.map($('input:checked', this.$el), 
            function(e, i) {
                return {'code':e.value, 'name':$(e).data('label')}
            }
        );
        if(checkedValues.length) {
            return {
                'operator':this.getOperator(),
                'table':this.model.get('currentDatasource').get('referenceTable'),
                'column':this.model.get('currentDatasource').get('data'),
                'value':checkedValues,
                'description':['is one of these: (',_.pluck(checkedValues, 'name').join(', '),')'].join('')
            };
        }
        return false;
    },
    
    /**
     * 
     * @function EnumEqualsFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {EnumEqualsFilterWidget}
     */
    'set':function(filterValue) {
        // make sure the datasource is correct
        this.useDatasource(filterValue.table, filterValue.column);
        $('input', this.$el).each(function(i, e) {
            e.checked = _.contains(_.pluck(filterValue.value, 'code'), e.value);
        });
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function EnumEqualsFilterWidget#reset
     * @return {EnumEqualsFilterWidget}
     */
    'reset':function() {
        this.model.trigger('change:currentDatasource');
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function EnumEqualsFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    /**
     * Adds a single or multiple datasource objects to this View's collection.
     * @function EnumEqualsFilterWidget#addDatasource
     * @param {object|object[]} ds - A column data object that includes a 
     * datasource property, or an array of datasource objects. 
     * @return {EnumEqualsFilterWidget}
     */
    'addDatasource':function(ds) {
        if(_.isArray(ds)) {
            for(var i in ds) {
                this.collection.add(ds[i]);
            }
            
        } else if(_.isObject(ds)) {
            this.collection.add(ds);
        }
        
        if(this.model.get('currentDatasourceIndex')<0) {
            this.model.set('currentDatasourceIndex', 0);
            this.model.set('currentDatasource', 
                this.collection.at(this.model.get('currentDatasourceIndex')));
        }
        
        return this;
    },
    
    /**
     * Attempts to change the current datasource by comparing the passed table 
     * and column parameters.
     * @function EnumEqualsFilterWidget#useDatasource
     * @param {string} table - the table property of the datasource
     * @param {string} column - the column/data property of the datasource
     * @return {boolean} - true when the datasource was changed
     */
    'useDatasource':function(table, column) {
        // check if table == currentDatasource.get('referenceTable')
        // and if column == currentDatasource.get('data')
        var currentDS = this.model.get('currentDatasource'), 
            newDSIndex;
        
        if(currentDS.get('referenceTable')===table && currentDS.get('data')===column) {
            return false;
        }
        
        // change datasource
        newDSIndex = _.findIndex(this.collection.toJSON(), function(c) { 
            return c.referenceTable===table && c.data===column
        });
        if(newDSIndex>-1) {
            this.model.set('currentDatasourceIndex', newDSIndex);
            this.model.set('currentDatasource', this.collection.at(this.model.get('currentDatasourceIndex')));
        }
        return true;
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template([
        '<div class="dropdown">',
            '<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                'Select',    
                '<span class="caret"></span>',
            '</button>',
            '<ul class="dropdown-menu cf-enum-dropdown-list">',
            '<% var ds = config.datasources.at(config.currentDatasourceIndex); for(var i in ds.get("datasource")) { %>',
                '<li>',
                    '<div class="checkbox cf-fw-enum-list-item">',
                        '<label>',
                            '<input type="checkbox" value="<%= ds.get("datasource")[i][ds.get("valueKey")] %>" data-label="<%= ds.get("datasource")[i][ds.get("displayKey")] %>" />',
                            '<span class="text-capitalize"><%= ds.get("datasource")[i][ds.get("displayKey")] %></span>',
                        '</label>',
                    '</div>',
                '</li>',
            '<% } %>',
            '</ul>',
        '</div>'
    ].join(''), {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} namespaced.event - Event handler function
     */
    'events':{
        'change .dropdown-menu input':function(e) {
            e.stopPropagation();
            return false;
        },
        'click .dropdown-menu input, .dropdown-menu label':function(e) {
            e.stopPropagation();
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
     * A customized, extended Backbone.View instance. This is a filter widget 
     * that manages a selection set from a collection.
     * @typedef {Backbone-View} EnumEqualsFilterWidget
     * @class
     * @classdesc A widget for enum data type that is equal to a value.
     * @version 1.0.4
     * @constructs EnumEqualsFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.4';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof EnumEqualsFilterWidget.prototype
         * @protected
         * @property {string} operator='equals' - the type of filter matching 
         * this widget would perform
         * @property {object} currentDatasource - the current datasource object 
         * that will be used to populate the dropdown list.
         * @property {string} currentDatasource.data - the column in the table 
         * or the property name in the data set
         * @property {string} currentDatasource.displayKey - the name of the 
         * property in a datasource object that would be used as a label 
         * @property {string} currentDatasource.valueKey - the name of the 
         * property in a datasource object that would be used as the value
         * @property {string} currentDatasource.title - a descriptive title
         * @property {string} currentDatasource.table - the name of the data 
         * table or data set that this datasource object belongs to
         * @property {string} currentDatasource.datasource - the array of objects
         * @property {number} currentDatasourceIndex - the index of the object 
         * in the collection that represents the currentDatasource object 
         */
        this.model = new Backbone.Model($.extend(
            {
                'currentDatasource':null,
                'currentDatasourceIndex':-1
            },
            options, 
            {'operator':'equals'}
        ));
        
        this.model.on('change:currentDatasource', 
            this.render, this);
        
        this.collection = new Backbone.Collection();
    },
    
    'render':function(mod, value, opts) {
        this.$el.empty().append(this.template($.extend(
            this.model.toJSON(),
            {'datasources':this.collection}
        )));
        return this.$el;
    }
});

