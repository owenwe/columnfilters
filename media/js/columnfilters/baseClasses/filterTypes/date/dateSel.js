// Filter Widget Type Implementation Class for Date (Select)
var VFilterWidgetTypeDateSel = VFilterWidgetType.extend({
	'version':'1.0.10',
	'type':'select',
	
	'isValid':function() {
		return this.collection.length>0;
	},
	
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		this.trigger('notify', 'danger', 'Date Filter ('+this.type+') Error', 'One or more dates must be selected.');
		return false;
	},
	
	'getValueDescription':function() {
		if(this.isValid()) {
			return [
				'is one of these: (',
				$.map(this.collection.models, function(md) {
					return moment.utc(md.get('date')).format('M/D/YYYY');
				}),
				')'
			].join('');
		} else {
			return false;
		}
	},
	
	'getValue':function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':this.collection.toJSON(),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	'setValue':function(filterValue) {
		this.collection.reset(filterValue.value);
	},
	
	'reset':function() {
		//reset datepicker and list
		this.collection.reset();
		this.model.get('dp').datepicker('update',null);
	},
	
	'events':{
		'click button.dpadd':function(e) {
			var d = this.model.get('dp').datepicker('getUTCDate');
			
			// only add date if it isn't in the valueList array
			if(d && !isNaN(d.getTime()) && this.collection.where({'timestamp':d.getTime()}).length<1) {
				this.collection.add({'date':d, 'timestamp':d.getTime()});
			}
		},
		
		'click ul.cf-select-widget-list li button.close':function(e) {
			this.collection.remove($(e.currentTarget).data('cid'));
		}
	},
	
	'template':_.template([
		'<div class="row">',
			'<div class="col-lg-4 col-md-5 col-sm-10 col-xs-8">',
				'<div class="input-group">',
					'<input type="text" class="form-control date" value="" />',
					'<span class="input-group-addon">',
						'<span class="glyphicon glyphicon-calendar"></span>',
					'</span>',
				'</div>',
			,'</div>',
			'<div class="col-lg-4 col-md-6 col-sm-12 col-xs-8">',
				'<div class="btn-group">',
					'<button type="button" class="btn btn-default dpadd">Add <span class="badge"><%= collection.length %></span></button>',
					'<button type="button" class="btn btn-default dropdown-toggle<% if(collection.length<1) { %>disabled<% } %>"<% if(collection.length<1) { %> disabled="disabled"<% } %> data-toggle="dropdown" aria-expanded="false">',
						'<span class="caret"></span>',
						'<span class="sr-only">Toggle Dropdown</span>',
					'</button>',
					'<ul class="dropdown-menu list-group cf-select-widget-list" role="menu">',
						'<% collection.each(function(m, i) { %>',
						'<li class="list-group-item" data-cid="<%= m.cid %>">',
							'<button class="close" data-cid="<%= m.cid %>"><span class="glyphicon glyphicon-remove btn-sm"></span></button>',
							'<p class="list-group-item-heading"><%= moment.utc(m.get("date")).format("M/D/YYYY") %></p>',
						'</li>',
						'<% }) %>',
					'</ul>',
				'</div>',
			'</div>',
		'</div>',
		'<div class="row">',
			'<div class="col-xs-12">',
				'<span class="help-block">filtering the results by column values in this list</span>',
			'</div>',
		'</div>'
	].join(''), {'variable':'collection'}),
	
	'initialize':function(options) {
		this.model = new Backbone.Model({
			'dp':null,
			'dpConfig':{
				'name':'dpsel',
				'autoclose':true,
				'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
			},
			'addBtn':null,
			'listEl':null
		});
		
		this.collection = new Backbone.Collection();
		this.collection.on('add', this.render, this);
		this.collection.on('reset', this.render, this);
		this.collection.on('remove', this.render, this);
		
		this.render(null, this.collection);
	},
	
	'render':function(m, col) {
		this.$el.empty().append(this.template(this.collection));
		// initialize datepicker
		$('input.date', this.$el).datepicker(this.model.get('dpConfig'));
		this.model.set('dp', $('input.date', this.$el));
	}
});
