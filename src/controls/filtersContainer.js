var ColumnFiltersContainer = Backbone.View.extend(
/** @lends ColumnFiltersContainer.prototype */
{
    /**
     * Enables all the interactive controls in this View instance.
     * @function ColumnFiltersContainer#enable
     * @return {ColumnFiltersContainer}
     */
    'enable':function() {
        this.$el.removeAttr('disabled');
        $([
           'ul.nav li', 
           'div.tab-pane a.list-group-item', 
           'ul.nav li a.list-group-item'
          ].join(','), this.$el).removeClass('disabled');
        $('div.tab-pane a p button', this.$el).show();
        return this;
    },
    
    /**
     * Sets all the interactive controls in this View instance to a disabled state.
     * @function ColumnFiltersContainer#disable
     * @return {ColumnFiltersContainer}
     */
    'disable':function() {
        this.$el.attr('disabled', 'disabled');
        $([
           'ul.nav li', 
           'div.tab-pane a.list-group-item', 
           'ul.nav li a.list-group-item'
          ].join(','), this.$el).addClass('disabled');
        $('div.tab-pane a p button', this.$el).hide();
        return this;
    },
    
    'activeColumnIndex':function(column) {
        this.model.set('activeColumnIndex', 
            _.indexOf(
                this.collection.models, 
                this.collection.findWhere({
                    'column':column
                })
            )
        );
        return this.model.get('activeColumnIndex');
    },
    
    /**
     * The underscore template used in the render function.
     * @readonly
     * @protected
     * @type {Underscore-template}
     */
    'template':_.template($.fn.ColumnFilters.FILTERS_CONTAINER_VIEW_TEMPLATE, 
        {'variable':'config'}),
    
    'events':{
        'shown.bs.tab':function(e) {
            this.model.set('activeColumnIndex', $(e.target).data('column'));
        },
        'mouseover div.tab-pane a':function(e) {
            $('button', $(e.currentTarget)).removeClass('hidden');
        },
        'mouseleave div.tab-pane a':function(e) {
            $('button', $(e.currentTarget)).addClass('hidden');
        },
        'click button.cf-filter-remove-button':function(e) {
            this.$el.trigger('fc.filter-remove.click', [$(e.currentTarget).parent().parent().data('filter')]);
            
        },
        'click button.cf-filter-edit-button':function(e) {
            this.$el.trigger('fc.filter-edit.click', [$(e.currentTarget).parent().parent().data('filter')]);
        }
    },
    
    'tagName':'fieldset',
    
    'className':'panel-body cf-data-filters-container',
    
    /**
     * The ColumnFiltersContainer displays and facilitates 
     * the adding, editing and removing of column filters.
     * @typedef {Backbone-View} ColumnFiltersContainer
     * @class
     * @classdesc An instance of ColumnFiltersContainer will display added column 
     * filters in a per column tab navigation view. Each display representation 
     * of a column filter has edit and remove controls that trigger events when 
     * clicked. Those events area captured in the parent ColumnFilters view. 
     * @version 1.0.1
     * @constructs ColumnFiltersContainer
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     * @param {Backbone-Collection} [options.filters=[]] - collection of the 
     * filters from the parent ColumnFilters view.
     * @param {string} [options.activeColumn=undefined] - The value of the named 
     * column tab that should be active. If this is undefined and 
     * options.filters is populated, it will be set to the first filter.
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        /**
         * This view instance's model data.
         * @name model
         * @type {Backbone-Model}
         * @memberof ColumnFiltersContainer.prototype
         * @protected
         * @property {number} activeColumnIndex=-1 - the index of the li in 
         * the tab nav ul that is active
         */
        this.model = new Backbone.Model($.extend(
            _.omit(options, 'filters')
        ));
        this.collection = options.filters;
        this.collection.on('update reset', function(col, opt) {
            // is the activeColumnIndex within range
            if(this.collection.length) {
                if(this.model.get('activeColumnIndex') >= this.collection.length) {
                    this.model.set('activeColumnIndex', 0);
                }
            }
            this.render();
        }, this);
        
        this.render();
    },
    
    'render':function() {
        var templateData, columnNames, foundFilter, groupedFilters, f;
        
        if(this.model.get('activeColumnIndex')<0 && this.collection.length) {
            // set to the first column
            this.model.set('activeColumnIndex', 0);
        }
        
        templateData = {
            'filters':this.collection,
            'groupedFilters':_.groupBy(
                _.map(this.collection.models, function(m) {
                    return $.extend(m.toJSON(), {
                        'cid':m.cid
                    })
                }), 'column'),
                'activeColumnIndex':this.model.get('activeColumnIndex')
        };
        
        this.$el.empty().append(this.template(templateData));
        if(this.collection.length) {
            f = $([
                'ul.nav li a[data-column="', 
                this.model.get('activeColumnIndex'),
                '"]'
            ].join(''), this.$el);
            
            // this is a bit controversial so I will leave it to the end user 
            // to decide if they want it or not -- default is off
            //if(f.length) {
            //    f[0].scrollIntoView({'block':'start','behavior':'smooth'});
            //}
        }
        return this.$el;
    }
});

