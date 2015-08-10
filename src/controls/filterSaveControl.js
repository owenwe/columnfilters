var FilterSaveControl = Backbone.View.extend(
/** @lends FilterSaveControl.prototype */
{
    'enable':function() {
        this.changeMode($.fn.ColumnFilters.ControlModes.NORMAL);
        return this;
    },
    
    'disable':function() {
        this.changeMode($.fn.ColumnFilters.ControlModes.DISABLED);
        return this;
    },
    
    /**
     * Makes sure there are no duplicates and then adds a menu item to the 
     * "save to" category dropup menu
     * @function FilterSaveControl#addCategory
     * @param {string} categoryName - the name of the category
     * @return {FilterSaveControl}
     */
    'addCategory':function(categoryName) {
        // if a category menu with the same name doesn't already exist
        if(this.categories.where({'name':categoryName}).length<1) {
            // add category to the categories collection
            this.categories.add({'name':categoryName});
        }
        return this;
    },
    
    /**
     * Resets the filters collection with the filters retrieved from a filterSet 
     * model in the collection using the passed filterSetId.
     * @function FilterSaveControl#loadFilters
     * @param {string} filterSetId - the id of the filterSet in the collection
     * @return {FilterSaveControl}
     */
    'loadFilters':function(filterSetId) {
        var fs = this.collection.get(filterSetId);
        this.filters.reset(fs.get('filters'));
        return this;
    },
    
    /**
     * 
     * @function FilterSaveControl#changeMode
     * @param {number} newMode - An enum value from ControlModes, if the value 
     * passed is the same as the current controlMode value, nothing will happen.
     * @return {FilterSaveControl}
     */
    'changeMode':function(newMode) {
        if(_.isFinite(newMode) && this.model.get('controlMode')!==_.identity(newMode*1)) {
            this.model.set('controlMode', newMode*1);
        }
        return this;
    },
    
    // private function -- not sure if we need now
    'modeChangeHandler':function(m, v, options) {
        this.filters.trigger('update');
    },
    
    
    /**
     * The event listener object for the FilterSaveControl View.
     * @protected 
     * @readonly
     * @namespace events
     * @memberof FilterSaveControl
     */
    'events':{
        /**
         * Click event for a save filterset list item.
         * @event FilterSaveControl.events#"li.cf-save-filter-list-item ul.dropdown-menu li":click
         */
        /**
         * Click event handler for when a filterset list item is clicked.
         * @function FilterSaveControl.events#"li.cf-save-filter-list-item ul.dropdown-menu li":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"li.cf-save-filter-list-item ul.dropdown-menu li":click
         */
        'click li.cf-save-filter-list-item ul.dropdown-menu li':function(e) {
            // are we saving to a new category or an existing one ?
            var catIndex = $(e.currentTarget).data('category-index'),
                isNewCategory = Boolean(catIndex === 0);
            
            if(isNewCategory) {
                // set the modal header title and action button label
                $('h4.modal-title', this.$el).html('Create New Category');
                $('div.modal-footer button:last-child', this.$el).html('Create');
                
                // render form inside modal body
                $('div.modal-body', this.$el).empty().append(
                    _.template($.fn.ColumnFilters.NEW_CATEGORY_FORM)({}));
            } else {
                // set the modal header title and action button label
                $('h4.modal-title', this.$el).html('Save to Filter Set');
                $('div.modal-footer button:last-child', this.$el).html('Save');
                // render form inside modal body
                $('div.modal-body', this.$el).empty().append(
                    _.template($.fn.ColumnFilters.NEW_FILTER_SET_FORM, 
                        {'variable':'config'})({
                            'category':this.categories.get(catIndex).get('name')
                        }
                    )
                );
            }
            
            $('div.modal', this.$el).modal('show');
        },
        
        /**
         * Click event for the clear filters button.
         * @event FilterSaveControl.events#"div.cf-fsc-clear-filterset-button button":click
         */
        /**
         * Click event handler for when the clear filters button is clicked.
         * @function FilterSaveControl.events#"div.cf-fsc-clear-filterset-button button":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"div.cf-fsc-clear-filterset-button button":click
         */
        'click div.cf-fsc-clear-filterset-button button':function(e) {
            this.filters.reset();
        },
        
        /**
         * Click event for the modal action button.
         * @event FilterSaveControl.events#"div.modal-footer button:last-child":click
         */
        /**
         * Click event handler when the modal action button is clicked.
         * @function FilterSaveControl.events#"div.modal-footer button:last-child":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"div.modal-footer button:last-child":click
         */
        'click div.modal-footer button:last-child':function(e) {
            var saveType = $('div.modal-body form', this.$el).data('save-type'),
                name, desc, category;
            
            switch(saveType) {
                case 'filterset':
                    // validate name, description is optional
                    name = $.trim($('div.modal-body form input', this.$el).val());
                    desc = $.trim($('div.modal-body form textarea', this.$el).val());
                    category = $('div.modal-body form', this.$el).data('category');
                    if(name.length) {
                        this.disable();
                        this.collection.create({
                            'category':category,
                            'table':this.model.get('table'),
                            'name':name,
                            'description':desc.length ? desc : null,
                            'filters':this.filters.clone().toJSON()
                        });
                    }
                    
                    break;
                case 'category':
                    // creating a new category
                    name = $.trim($('div.modal-body form input', this.$el).val());
                    if(name.length) {
                        this.addCategory(name);
                    }
                    break;
            }
        },
        
        /**
         * Click event for the remove filter set button.
         * @event FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-remove-button":click
         */
        /**
         * Click event handler for the remove filter set button.
         * @function FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-remove-button":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-remove-button":click
         */
        'click ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-remove-button':function(e) {
            if(confirm('Are you sure you want to remove this Filter Set?')) {
                var m = this.collection.get($(e.currentTarget).data('id'));
                this.disable();
                m.destroy({
                    'sucess':function(model, resp) {
                        console.log('model destroy success');
                    }
                });
                this.collection.remove($(e.currentTarget).data('id'));
                
            }
        },
        
        /**
         * Click event for the edit filter set button.
         * @event FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-edit-button":click
         */
        /**
         * Click event handler for the edit filter set button.
         * @function FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-edit-button":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-edit-button":click
         */
        'click ul.cf-fsc-filter-set-menu li button.cf-fsc-filter-set-edit-button':function(e) {
            this.loadFilters($(e.currentTarget).data('id'));
            this.model.set('editingFilterSet', this.collection.get($(e.currentTarget).data('id')));
            // change edit mode
            this.changeMode($.fn.ColumnFilters.ControlModes.EDIT);
        },
        
        /**
         * Click event for the filter set link.
         * @event FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li h4 a":click
         */
        /**
         * Click event handler for the filter set link.
         * @function FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li h4 a":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"ul.cf-fsc-filter-set-menu li h4 a":click
         */
        'click ul.cf-fsc-filter-set-menu li h4 a':function(e) {
            this.loadFilters($(e.currentTarget).data('id'));
        },
        
        /**
         * Click event for the cancel editing filter set button.
         * @event FilterSaveControl.events#"div.cf-fsc-save-filterset-buttongroup button:first-child":click
         */
        /**
         * Click event handler for the cancel editing filter set button.
         * @function FilterSaveControl.events#"div.cf-fsc-save-filterset-buttongroup button:first-child":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"div.cf-fsc-save-filterset-buttongroup button:first-child":click
         */
        'click div.cf-fsc-save-filterset-buttongroup button:first-child':function(e) {
            this.changeMode($.fn.ColumnFilters.ControlModes.NORMAL);
        },
        
        /**
         * Click event for the done editing filter set button.
         * @event FilterSaveControl.events#"div.cf-fsc-save-filterset-buttongroup button:first-child":click
         */
        /**
         * Click event handler for the done editing filter set button.
         * @function FilterSaveControl.events#"div.cf-fsc-save-filterset-buttongroup button:first-child":click
         * @param {object} e - the click event object
         * @listens FilterSaveControl.events#"div.cf-fsc-save-filterset-buttongroup button:first-child":click
         */
        'click div.cf-fsc-save-filterset-buttongroup button:last-child':function(e) {
            if(this.filters.length) {
                // put the filters from this.filters.collection into the 
                // editingFilterSet.filters and do an update()
                this.disable();
                this.model.get('editingFilterSet').save({'filters':this.filters.toJSON()});
                this.changeMode($.fn.ColumnFilters.ControlModes.NORMAL);
            }
        }
    },
    
    /**
     * The value of this property changes the type of DOM Element created as this View's container.
     * @readonly
     * @type {string}
     */
    'tagName':'nav',
    
    /**
     * This Backbone View's class values.
     * @readonly
     * @type {string}
     * @default
     */
    'className':'navbar navbar-default cf-filter-save-control',
    
    /**
     * This View controls the saving and managing of filters, filter categories, and filter groups.
     * @typedef {Backbone-View} FilterSaveControl
     * @class
     * @classdesc The FilterSaveControl manages how filters are applied to columns.
     * @version 1.0.1
     * @constructs FilterSaveControl
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof FilterSaveControl.prototype
         * @property {*} propety1name - 
         */
        this.model = new Backbone.Model($.extend(
            {
                'mode':$.fn.ColumnFilters.Modes.DEFAULT,
                'url':undefined,
                'table':undefined
            },
            _.omit(options, ['filters','categories']),
            {
                'controlMode':$.fn.ColumnFilters.ControlModes.NORMAL,
                'editingFilterSet':null
            }
        ));
        
        this.model.on('change:controlMode', this.modeChangeHandler, this);
        
        this.filters = options.filters;
        if(_.contains(
                [$.fn.ColumnFilters.Modes.CATEGORY_SETS,
                 $.fn.ColumnFilters.Modes.CATEGORIES_NO_TYPES], 
            this.model.get('mode'))) {
            
            this.categories = new Backbone.Collection(options.categories, {
                'model':Backbone.Model.extend({
                    'defaults':{'name':undefined}
                })
            });
            // TODO implement a way to add existing filterSets
            this.collection = new Backbone.Collection([], {
                'model':Backbone.Model.extend({
                    'defaults':{
                        'category'    :null,
                        'table'       :null,
                        'name'        :null,
                        'description' :null,
                        'filters'     :null
                    }
                })
            });
            
            this.filters.on('update reset', this.render, this);
            this.categories.on('update reset', this.render, this);
            this.collection.on('update reset', this.render, this);
            
            if(options.url) {
                this.collection.url = options.url;
                
                // after the xhr response
                this.collection.on('sync', function(col, resp, opts) {

                    this.enable();
                }, this);
                // when the request is sent
                this.collection.on('request', function(col, xhr, opts) {
                    this.disable();
                }, this);
                // an error in the xhr happened
                this.collection.on('error', function(col, resp, opts) {
                    console.log('collection.sync.error');
                    console.log(resp);
                    console.log(opts);
                }, this);
                
                // initialize the filterSet collection
                this.collection.fetch({
                    'remove':false, 
                    'data':{'table':options.table},
                    'success':function(col, resp, opts) {
                        // add categories from the fetched filterSets
                        // to the categories collection
                        var i, 
                            existingCategories = this.categories.pluck('name'),
                            fetchedCategories = _.keys(_.groupBy(col.toJSON(), 'category'));
                        for(i in fetchedCategories) {
                            if(!_.contains(existingCategories, fetchedCategories[i])) {
                                existingCategories.push(fetchedCategories[i]);
                            }
                        }
                        this.categories.reset(_.map(existingCategories, 
                            function(c) {
                                return {'name':c}
                            }
                        ));
                    },
                    'context':this
                });
            }
        }
    },
    
    'render':function(col, opts) {
        if(_.contains(
                    [$.fn.ColumnFilters.Modes.CATEGORY_SETS,
                     $.fn.ColumnFilters.Modes.CATEGORIES_NO_TYPES], 
                this.model.get('mode'))) {
            
            var templateData = $.extend(this.model.toJSON(),
                {
                    'filters':_.map(this.filters.models, function(m) {
                        return $.extend(m.toJSON(), {'cid':m.cid})
                    }),
                    'categories':_.map(this.categories.models, function(m) {
                        return $.extend(m.toJSON(), {'cid':m.cid})
                    }),
                    'filtersets':_.groupBy(
                        _.map(this.collection.models, function(m) {
                            return $.extend(m.toJSON(), {
                                'cid':m.cid
                            })
                        }), 'category')
                }
            );
            
            this.$el.empty().append(
                _.template($.fn.ColumnFilters.FILTER_SAVE_CONTROL_VIEW_TEMPLATE, 
                    {'variable':'config'})(templateData)
            );
            $('div.modal', this.$el).modal({
                'backdrop':'static',
                'keyboard':false,
                'show':false
            });
        } else {
            this.$el.empty();
        }
    }
});

