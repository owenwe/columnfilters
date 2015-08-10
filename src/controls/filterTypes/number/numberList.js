var NumberListFilterWidget = Backbone.View.extend(
/** @lends NumberListFilterWidget.prototype */
{
    /**
     * Displays this View instance.
     * @function NumberListFilterWidget#show
     * @return {NumberListFilterWidget}
     */
    'show':function() {
        this.$el.show();
        return this;
    },
    
    /**
     * Hides this View instance.
     * @function NumberListFilterWidget#hide
     * @return {NumberListFilterWidget}
     */
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    /**
     * Enables all the interactive controls in this View instance.
     * @function NumberListFilterWidget#enable
     * @return {NumberListFilterWidget}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function NumberListFilterWidget#disable
     * @return {NumberListFilterWidget}
     */
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    /**
     * Gets the value from this filter widget
     * @function NumberListFilterWidget#get
     * @return {object}
     */
    'get':function() {
        if(this.collection.length<1) {
            return false;
        }
        return {
            'operator':this.getOperator(),
            'value':this.collection.map(function(n){return n.get('number')}),
            'description':[
                'is one of these: (',
                $.map(this.collection.models, function(m){
                    return m.get('number')
                }),
                ')'
            ].join('')
        }
    },
    
    /**
     * Sets the values of this filter widget with the passed object.
     * @function NumberListFilterWidget#set
     * @param {object} filterValue - An object that has values for all the 
     * interactive controls within this View instance.
     * @return {NumberListFilterWidget}
     */
    'set':function(filterValue) {
        this.collection.reset(
            _.map(filterValue.value, function(n){
                return {'number':n}
            }
        ));
        return this;
    },
    
    /**
     * Sets all the interactive controls within this View's instance to their 
     * default state and value.
     * @function NumberListFilterWidget#reset
     * @return {NumberListFilterWidget}
     */
    'reset':function() {
        this.collection.reset();
        return this;
    },
    
    /**
     * Returns the operator for this filter widget instance.
     * @function NumberListFilterWidget#getOperator
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
    'template':_.template($.fn.ColumnFilters.NUMBER_LIST_TEMPLATE, {'variable':'config'}),
    
    /**
     * This View's events object. 
     * @readonly
     * @type {object}
     * 
     */
    'events':{
        'changed.fu.spinbox':function(e, val) {
            if(!_.isFinite(val)) {
                $('div.spinbox', this.$el).spinbox('value', 
                    this.model.get('spinboxConfig').min);
            }
        },
        'keyup input':function(e) {
            // 13 == enter
            if(e.keyCode===13) {
                return false;
            }
        },
        'click button.cf-fw-numberList-btn-add':function(e) {
            var n = $('div.spinbox', this.$el).spinbox('value');
            if(_.isFinite(n) && this.collection.where({'number':n}).length<1) {
                this.collection.add({'number':n});
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
    'className':'cf-filter-widget form-inline fuelux',
    
    /**
     * A customized extended Backbone.View instance
     * @typedef {Backbone-View} NumberListFilterWidget
     * @class
     * @classdesc A widget for a list of number data types.
     * @version 1.0.3
     * @constructs NumberListFilterWidget
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.3';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof NumberListFilterWidget.prototype
         * @protected
         * @property {string} operator='' - the type of filter matching that 
         * this widget would perform
         */
        this.model = new Backbone.Model($.extend(
            {
                'attributes':{
                    'class':'form-control spinbox-input', 
                    'autocomplete':'off',
                    'size':'4'
                },
                'spinboxConfig':{
                    'value':1,
                    'min':1,
                    'max':999,
                    'step':1,
                    'hold':true,
                    'speed':'medium',
                    'disabled':false,
                    'units':[]
                }
            },
            options, 
            {'operator':'list'}
        ));
        
        this.collection = new Backbone.Collection();
        this.collection.on('update', this.render, this);
        this.collection.on('reset', this.render, this);
        
        this.render(this.collection, {});
    },
    
    'render':function(col, opt) {
        this.$el.empty().append(this.template($.extend(
            this.model.toJSON(), 
            {'numbers':this.collection}
        )));
        return this.$el;
    }
});

