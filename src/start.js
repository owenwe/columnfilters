/**
 * ColumnFilters jQuery Plugin
 * @version 1.0.4
 * @author Wes Owen wowen@ccctechcenter.org
 */
(function($){
    'use strict';
    
    // seems like this would be included in the underscore object functions
    _.createKeyValueObject = function(key, value) {
        var r = {};
        r[key] = value;
        return r;
    };
    
    /**
     * A Backbone View extended from Backbone.View.
     * @see http://backbonejs.org/#View-constructor
     * @typedef {Class} Backbone-View
     * @property {Element} el - an element constructed from this instance's tagName, className, id, and attributes properties
     * @property {string} className=undefined - The value of this instance's el class attribute.
     * @property {string} tagName=div - The DOM Element to create for this instance's el.
     * @property {string} id=undefined] - The value of this instance's el id attribute. The id attribute is not created unless this has a value.
     * @property {object} events=undefined] - An object hash used to define event listener functions for the elements within this instance.
     * @property {object} attributes=undefined] - A hash of attributes that will be set as HTML DOM element attributes on the view's el.
     * @property {Backbone.Model} model=undefined - A model this view can access directly as an instance variable.
     * @property {Backbone.Collection} collection - A collection this view can access directly as an instance variable.
     * @property {function} initialize - A function that can be overridden to customize the constructor. Takes an "options" parameter.
     * @property {function} render - A function that can be overridden.
     */
    
    /**
     * An object used in an array and passed inside a configuration object for 
     * the FilterFactory constructor.
     * @typedef {object} DataTypeWidget
     * @property {string} type - the data type e.g. string, number, enum, ...
     * @property {FilterWidget[]} widgets - an array of FilterWidget instances
     */
    
    /**
     * A filter within a filter collection.
     * @typedef {object} Filter
     * @property {string} column - the name of the column or property
     * @property {string} type - the data type this filter applies to
     * @property {string} label - the title of the column this filter applies to
     * @property {string} table - the database or named data map the column of 
     * this filter applies to
     * @property {object} filterValue - an object that will contain the specific 
     * limiting values that represent this filter
     * @property {string} filterValue.operator - the type of comparison this 
     * filter will perform
     * @property {string} filterValue.description - a descriptive phrase explaining 
     * the relationship between the operator and value
     * @property {*} filterValue.value - this will vary depending on the filter 
     * type and operator
     */
    /**
     * Interface for classes that represent a Filter Widget.
     * @interface FilterWidget
     */
    /**
     * Displays this Backbone-View instance.
     * @function FilterWidget#show
     * @return {FilterWidget} This FilterWidget instance
     * 
     */
    /**
     * Hides this Backbone-View instance.
     * @function FilterWidget#hide
     * @return {FilterWidget} This FilterWidget instance
     */
    /**
     * Enables all the interactive controls in this Backbone-View instance.
     * @function FilterWidget#enable
     * @return {FilterWidget} This Backbone-View instance
     */
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function FilterWidget#disable
     * @return {FilterWidget} This Backbone-View instance
     */
    /**
     * Returns an object populated with the values from the interactive controls 
     * within this Backbone-View.
     * @function FilterWidget#get
     * @return {object} The return object will vary depending on the data type 
     * and operator, but there will always be value, description, and operator 
     * properties.
     */
    /**
     * Uses the passed object to populate any internal values and input controls.
     * @function FilterWidget#set
     * @param {object} filterValue - An object that has values for the input 
     * controls in this Backbone-View.
     * @return {FilterWidget} This Backbone-View instance
     */
    /**
     * Sets all the interactive controls within this View's instance to their 
     * default state and value. This function may also change internal values.
     * @function FilterWidget#reset
     * @return {FilterWidget} This Backbone-View instance
     */
    /**
     * Returns the operator value for this FilterWidget instance.
     * @function FilterWidget#getOperator
     * @return {string} The value of the internal operator property.
     */
    /**
     * An event triggered by an "enter" key press while one of the internal inputs
     * has focus.
     * @event FilterWidget#"cf.fw.submit"
     * @property {object} filterValue - the same value as the FilterWidget#get 
     * function would return.
     */
    
    