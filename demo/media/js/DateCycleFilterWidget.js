var DateCycleFilterWidget = Backbone.View.extend(
{
    'show':function() {
        this.$el.show();
        return this;
    },
    
    'hide':function() {
        this.$el.hide();
        return this;
    },
    
    'enable':function() {
        this.$el.removeAttr('disabled');
        return this;
    },
    
    'disable':function() {
        this.$el.attr('disabled','disabled');
        return this;
    },
    
    'get':function() {
        var d = $('div.date', this.$el).datepicker('getUTCDate'),
            cycle = $('label.active input', this.$el).val()*1;
        if(d) {
            return {
                'operator':this.getOperator(),
                'monthYear':{
                    'date':d,
                    'timestamp':moment.utc(d).valueOf()
                },
                'cycle':cycle,
                'cycleMap':this.model.get('cycle'),
                'description':[
                    'for the',
                    _.findWhere(this.model.get('cycle'), {'value':cycle}).label,
                    'billing cycle of',
                    this.model.get('months')[d.getMonth()+1]
                ].join(' ')
            };
        }
        return false;
    },
    
    'set':function(filterValue) {
        $('div.date', this.$el).datepicker('setUTCDate', filterValue.monthYear.date);
        $('label', this.$el).first().toggleClass('active', filterValue.cycle===1);
        $('label', this.$el).last().toggleClass('active', filterValue.cycle===2);
        return this;
    },
    
    'reset':function() {
        $('div.date', this.$el).datepicker('update', null);
        $('label', this.$el).first().toggleClass('active', true);
        $('label', this.$el).last().toggleClass('active', false);
        return this;
    },
    
    'getOperator':function() {
        return this.model.get('operator');
    },
    
    'template':_.template([
        '<div class="form-group pull-left">',
            '<div class="btn-group" data-toggle="buttons">',
            '<% for(var i in config.cycle) { %>',
                '<label class="btn btn-xs btn-primary<% if(i==0) { %> active<% } %>">',
                    '<input type="radio" value="<%= config.cycle[i].value %>" <% if(i==0) { %> checked="checked"<% } %> /> ',
                    '<%= config.cycle[i].label %>',
                '</label>',
            '<% } %>',
            '</div>',
        '</div>',
        '<div class="form-group pull-left">',
            '<div class="input-group date">',
                '<input type="text" <%= _.map(_.omit(config.attributes, "type"), function(val,key){ return [key,\'="\',val,\'"\'].join("") }).join(" ") %> />',
                '<span class="input-group-addon">',
                    '<span class="glyphicon glyphicon-calendar"></span>',
                '</span>',
            '</div>',
        '</div>'
    ].join(''), {'variable':'config'}),
    
    'tagName':'fieldset',
    
    'className':'cf-filter-widget',
    
    'initialize':function(options) {
        this.version = '1.0.5';
        this.model = new Backbone.Model($.extend(
            {
                'attributes':{
                    'class':'form-control date', 
                    'autocomplete':'off',
                    'size':'18',
                    'value':''
                }
            },
            options, 
            {
                'operator':'cycle',
                'months':[
                      'January','February','March',
                      'April','May','June',
                      'July','August','September',
                      'October','November','December'
                  ],
                  'cycle':[
                       {'label':'1st-15th', 'value':1},
                       {'label':'16th-End Of Month', 'value':2}
                   ],
                   'datepickerConfig':{
                       'autoclose':true,
                       'clearBtn':true,
                       'format':$.fn.ColumnFilters.DateFormats.month_year,
                       'minViewMode':$.fn.ColumnFilters.DatepickerViewModes.MONTHS,
                       'startView':$.fn.ColumnFilters.DatepickerStartViewModes.YEAR
                   }
            }
        ));
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        $('div.date', this.$el).datepicker(this.model.get('datepickerConfig'));
        return this.$el;
    }
});

