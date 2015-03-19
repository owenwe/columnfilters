// Filter Widget Type Implementation Class for Number (Select)
var VFilterWidgetTypeDateSel = VFilterWidgetType.extend({
	'version':'1.0.4',
	'type':'select',
	'dp':null,
	'dpConfig':{
		'name':'dpsel',
		'autoclose':true,
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
	},
	
	'addBtn':null,
	'listEl':null,
	
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
				$.map(this.collection.models,function(md) {
					return moment(md.get('date')).format('M/D/YYYY');
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
				'value':this.collection.toJSON(),//this.collection.map(function(md){return md.get('timestamp');}),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	'setValue':function(filterValue) {
		//expecting what getValue would return
		this.collection.reset(filterValue.value);
	},
	'reset':function() {
		//reset datepicker and list
		this.collection.reset();
		this.dp.datepicker('update',null);
	},
	
	'addDate':function(dateModel) {
		$('span.badge',this.addBtn).html(this.collection.length);
		this.listEl.append(this.listTemplate(dateModel));
		if(this.collection.length===1) {
			$('button.dropdown-toggle',this.$el).removeClass('disabled');
		}
	},
	'removeDate':function(dateModel) {
		$('span.badge',this.addBtn).html(this.collection.length);
		$('li[data-cid="'+dateModel.cid+'"]',this.listEl).remove();
		if(this.collection.length<1) {
			$('button.dropdown-toggle',this.$el).addClass('disabled');
		}
	},
	'resetCollection':function(newCol) {
		$('span.badge',this.addBtn).empty();
		this.listEl.empty();
		if(newCol && newCol.length) {//is an actual collection
			newCol.each(function(dateModel) {
				this.addDate(dateModel);
			}, this);
			$('button.dropdown-toggle',this.$el).removeClass('disabled');
		} else {
			$('button.dropdown-toggle',this.$el).addClass('disabled');
		}
	},
	
	'events':{
		'click button.dpadd':function(e) {
			var d = this.dp.datepicker('getDate');
			
			// only add date if it isn't in the valueList array
			if(!isNaN(d.getTime()) && this.collection.where({'timestamp':d.getTime()}).length<1) {
				this.collection.add({'date':d, 'timestamp':d.getTime()});
			}
		},
		'click ul.cf-select-widget-list li button.close':function(e) {
			this.collection.remove($(e.currentTarget).data('cid'));
		}
	},
	
	'listTemplate':_.template([
			'<li class="list-group-item" data-cid="<%= dm.cid %>">',
				'<button class="close" data-cid="<%= dm.cid %>"><span class="glyphicon glyphicon-remove btn-sm"></span></button>',
				'<p class="list-group-item-heading"><%= moment(dm.get("date")).format("M/D/YYYY") %></p>',
			'</li>'
		].join(''),
		{'variable':'dm'}
	),
	'template':_.template([
			'<div class="row">',
				'<div class="col-lg-4 col-md-5 col-sm-10 col-xs-8">'+CFTEMPLATES.datepicker+'</div>',
				'<div class="col-lg-4 col-md-6 col-sm-12 col-xs-8">',
					'<div class="btn-group">',
						'<button type="button" class="btn btn-default dpadd">Add <span class="badge">0</span></button>',
						'<button type="button" class="btn btn-default dropdown-toggle disabled" data-toggle="dropdown" aria-expanded="false">',
							'<span class="caret"></span>',
							'<span class="sr-only">Toggle Dropdown</span>',
						'</button>',
						'<ul class="dropdown-menu list-group cf-select-widget-list" role="menu"></ul>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="row">',
				'<div class="col-xs-12">',
					'<span class="help-block">filtering the results by column values in this list</span>',
				'</div>',
			'</div>'
		].join(''),
		{variable:'datepicker'}
	),
	
	'initialize':function(options) {
		var Col = Backbone.Collection.extend({
			'model':Backbone.Model.extend({
				'defaults':{
					'date':null
				}
			})
		});
		this.collection = new Col();
		this.collection.on({
			'add':this.addDate,
			'reset':this.resetCollection,
			'remove':this.removeDate
		}, this);
		
		// add ui
		this.$el.html(this.template(this.dpConfig));
		
		// initialize datepicker
		$('.dpsel',this.$el).datepicker(this.dpConfig);
		
		// assign class variables
		this.dp = $('.dpsel',this.$el);
		this.addBtn = $('button.dpadd',this.$el);
		this.listEl = $('.dropdown-menu',this.$el);
	}
});
