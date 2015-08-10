var BooleanEqualsFilterWidget = Backbone.View.extend(
/** @lends BooleanEqualsFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function BooleanEqualsFilterWidget#show
     * @return {BooleanEqualsFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function BooleanEqualsFilterWidget#hide
     * @return {BooleanEqualsFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function BooleanEqualsFilterWidget#enable
     * @return {BooleanEqualsFilterWidget}
     */
    'enable':function() {
       this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function BooleanEqualsFilterWidget#disable
     * @return {BooleanEqualsFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * 
     * @function BooleanEqualsFilterWidget#get
     * @return {object}
     */
    'get':function() {
        var val = $('label.active input', this.$el).val()*1,
            cds = this.model.get('currentDatasource'),
            convertNumeric = cds.has('convertNumeric') ? 
                cds.get('convertNumeric') :
                this.model.get('defaults').convertNumeric;
        return {
            'operator':this.getOperator(),
            'column':cds.get('data'),
            'value':convertNumeric ? val : Boolean(val),
            'description':[
                'is',
                val ? 
                    (cds.has('trueLabel') ? 
                        cds.get('trueLabel') : 
                        this.model.get('defaults').trueLabel) : 
                    (cds.has('falseLabel') ? 
                        cds.get('falseLabel') : 
                        this.model.get('defaults').falseLabel)
            ].join(' ')
        }
    },
    
    /**
     * 
     * @function BooleanEqualsFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {BooleanEqualsFilterWidget}
     */
    'set':function(filterValue) {
        this.useDatasource(filterValue.column);
        $('label', this.$el).first().toggleClass('active', filterValue.value);
        $('label', this.$el).last().toggleClass('active', !filterValue.value);
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their default state and value.
     * @function BooleanEqualsFilterWidget#reset
     * @return {BooleanEqualsFilterWidget}
     */
    'reset':function() {
        this.model.trigger('change:currentDatasource');
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function BooleanEqualsFilterWidget#getOperator
     * @return {string}
     */
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    /**
     * Adds a single or multiple datasource objects to this View's collection.
     * @function BooleanEqualsFilterWidget#addDatasource
     * @param {object|object[]} ds - A column data object that includes a 
     * datasource property, or an array of datasource objects. 
     * @return {BooleanEqualsFilterWidget}
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
     * @function BooleanEqualsFilterWidget#useDatasource
     * @param {string} column - the column/data property of the datasource
     * @return {boolean} - true when the datasource was changed
     */
    'useDatasource':function(column) {
        // and if column == currentDatasource.get('data')
        var currentDS = this.model.get('currentDatasource'), 
            newDSIndex;
        
        if(currentDS.get('data')===column) {
            return false;
        }
        
        // change datasource
        newDSIndex = _.findIndex(this.collection.toJSON(), function(c) { 
            return c.data===column
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
        '<div class="btn-group" data-toggle="buttons">',
            '<label class="btn btn-primary<% if(config.value) { %> active<% } %>">',
                '<input type="radio"<% if(config.value) { %> checked="checked"<% } %> value="1" /> <%= config.trueLabel %>',
            '</label>',
            '<label class="btn btn-primary<% if(!config.value) { %> active<% } %>">',
                '<input type="radio"<% if(!config.value) { %> checked="checked"<% } %> value="0" /> <%= config.falseLabel %>',
            '</label>',
        '</div>'
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
     * @typedef {Backbone-View} BooleanEqualsFilterWidget
     * @class
     * @classdesc A widget for boolean data type that is equal to a value.
     * @version 1.0.4
     * @constructs BooleanEqualsFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.4';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof BooleanEqualsFilterWidget.prototype
         * @protected
         * @property {string} operator='equals' - the type of filter matching 
         * this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'currentDatasource':null,
                'currentDatasourceIndex':-1
            },
            options, 
            {
                'operator':'equals',
                'defaults':{
                    'trueLabel':'Yes',
                    'falseLabel':'No',
                    'convertNumeric':false,
                    'value':true
                }
                
            }
        ));
        
        this.model.on('change:currentDatasource', 
            this.render, this);
        
        this.collection = new Backbone.Collection();
    },
    
    'render':function(mod, value, opts) {
        // set model values with values in currectDatasource
        var cds = this.model.get('currentDatasource');
        this.$el.empty().append(this.template($.extend(
            {
                'trueLabel':cds.has('trueLabel') ? 
                    cds.get('trueLabel') : 
                    this.model.get('defaults').trueLabel,
                'falseLabel':cds.has('falseLabel') ? 
                    cds.get('falseLabel') : 
                    this.model.get('defaults').falseLabel,
                'value':cds.has('value') ? 
                    cds.get('value') : 
                    this.model.get('defaults').value
            }
        )));
        return this.$el;
    }
});

