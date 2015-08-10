var BiglistEqualsFilterWidget = Backbone.View.extend(
/** @lends BiglistEqualsFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function BiglistEqualsFilterWidget#show
     * @return {BiglistEqualsFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function BiglistEqualsFilterWidget#hide
     * @return {BiglistEqualsFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function BiglistEqualsFilterWidget#enable
     * @return {BiglistEqualsFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function BiglistEqualsFilterWidget#disable
     * @return {BiglistEqualsFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * 
     * @function BiglistEqualsFilterWidget#get
     * @return {object}
     */
    'get':function() {
        if(this.model.get('selectedItem')) {
            var displayer = this.model.get('currentDatasource').get('displayKey');
            return {
                'operator':this.getOperator(),
                'table':this.model.get('currentDatasource').get('referenceTable'),
                'column':this.model.get('currentDatasource').get('data'),
                'value':this.model.get('selectedItem'),
                'description':[
                    'is',
                    typeof(displayer)==='string' ? 
                        this.model.get('selectedItem')[displayer] : 
                        displayer(this.model.get('selectedItem'))
                ].join(' ')
            };
        }
        return false;
    },
    
    /**
     * 
     * @function BiglistEqualsFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {BiglistEqualsFilterWidget}
     */
    'set':function(filterValue) {
        this.useDatasource(filterValue.table, filterValue.column);
        this.model.set('selectedItem', filterValue.value);
        var displayer = this.model.get('currentDatasource').get('displayKey');
        $('input.typeahead', this.$el).typeahead('val', 
            typeof(displayer)==='string' ? 
                filterValue.value[displayer] : 
                displayer(filterValue.value)
        );
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function BiglistEqualsFilterWidget#reset
     * @return {BiglistEqualsFilterWidget}
     */
    'reset':function() {
        this.model.trigger('change:currentDatasource');
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function BiglistEqualsFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    
    /**
     * Adds a single or multiple datasource objects to this View's collection.
     * @function BiglistEqualsFilterWidget#addDatasource
     * @param {object|object[]} ds - A column data object that includes a 
     * datasource property, or an array of datasource objects. 
     * @return {BiglistEqualsFilterWidget}
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
     * @function BiglistEqualsFilterWidget#useDatasource
     * @param {string} table - the table property of the datasource
     * @param {string} column - the column/data property of the datasource
     * @return {boolean} - true when the datasource was changed
     */
    'useDatasource':function(table, column) {
        // check if table == currentDatasource.get('referenceTable')
        // and if column == currentDatasource.get('data')
        var currentDS = this.model.get('currentDatasource'), 
            newDSIndex;
        
        // even if the datasource remains the same, reset the selectedItem
        this.model.set('selectedItem', undefined);
        
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
     * Uses the displayer model value to return a string value of the passed item.
     * @function displayItem
     * @private
     * @param {object} item - the item from the typeahead suggestion or this view
     * @return {string} A string representation of the object parameter
     */
    'displayItem':function(item) {
        var displayer = this.model.get('currentDatasource').get('displayKey');
        return typeof(displayer)==='string' ? item[displayer] : displayer(item);
    },
    
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @type {Underscore-template}
     */
    'template':_.template([
        '<input type="text" autocomplete="off" data-provide="typeahead" class="form-control typeahead" value="" />',
    ].join(''), {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * @property {function} namespaced.event - Event handler function
     */
    'events':{
        'typeahead:select':function(e, suggestion) {
            // select is when the suggestion is selected either by mouse click or hitting "enter"
            this.model.set('selectedItem', suggestion);
        },
        'typeahead:autocomplete':function(e, suggestion) {
            // autocomplete is when a suggestion is chosen via a keystroke such as arrow key or tab
            this.model.set('selectedItem', suggestion);
        },
        'typeahead:change':function(e) {
            if(this.model.get('selectedItem')) {
                $('input', this.$el).typeahead('val', this.displayItem(this.model.get('selectedItem')));
            }
        },
        'typeahead:idle':function(e) {
            if(this.model.get('selectedItem')) {
                $('input.typeahead', this.$el).typeahead('val', this.displayItem(this.model.get('selectedItem')));
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
     * @typedef {Backbone-View} BiglistEqualsFilterWidget
     * @class
     * @classdesc A widget for biglist data type that is equal to a value.
     * @version 1.0.4
     * @constructs BiglistEqualsFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.4';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof BiglistEqualsFilterWidget.prototype
         * @protected
         * @property {string} operator='' - the type of filter matching that this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'currentDatasource':null,
                'currentDatasourceIndex':-1
            },
            options, 
            {
                'operator':'equals',
                'selectedItem':undefined
            }
        ));
        
        this.model.on('change:currentDatasource', 
            this.render, this);
        
        this.collection = new Backbone.Collection();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        var currentDS = this.model.get('currentDatasource');
        // assign typeahead to input
        $('input.typeahead', this.$el).typeahead(
            {'highlight':false, 'hint':false, 'minLength':3}, 
            {
                'name':currentDS.get('data'),
                'displayKey':currentDS.get('displayKey'),
                'source':currentDS.get('datasource').ttAdapter()
            }
        );
        
        return this.$el;
    }
});

