// Filter Widget Type Implementation Class for Number (Select)
var VFilterWidgetTypeNumberSel = VFilterWidgetType.extend({
	'version':'1.0.2',
	'type':'select',
	
	'collectionInterface':Backbone.Collection.extend({
		'model':Backbone.Model.extend({
			'defaults':{
				'number':null
			}
		})
	}),
	
	/*
	Name		type	default value	description
	value 		number 	1 				Sets the initial spinbox value
	min 		number 	1 				Sets the minimum spinbox value
	max 		number 	999 			Sets the maximum spinbox value
	step 		number 	1 				Sets the increment by which the value in the spinbox will change each time the spinbox buttons are pressed
	hold 		boolean true 			If true, the spinbox will react to its buttons being pressed and held down
	speed 		string 	"medium" 		Assigns spinbox speed when buttons are held down. Options include "fast","medium","slow".
	disabled 	boolean false 			Creates a disables spinbox.
	units 		array 	[] 				Units that will be allowed to appear and be typed into the spinbox input along with the numeric value. 
										For example, setting units to a value of ['px', 'en', 'xx'] would allow px, en, and xx units to appear 
										within the spinbox input
	Events		changed.fu.spinbox
	Methods		
				destroy		Removes all functionality, jQuery data, and the markup from the DOM. Returns string of control markup.
				value		Sets or returns the spinner value
	*/
	'sb':null,
	'sbOptions':{min:-100, max:100, step:.25},
	
	'addBtn':null,
	'listEl':null,
	
	'isValid':function() {
		return this.collection.length>0;
	},
	
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		
		this.trigger('notify', 'danger', 'Number Filter ('+this.type+') Error', 'One or more numbers must be selected.');
		return false;
	},
	
	'getValueDescription':function() {
		return this.isValid() ? ['is one of these: (',$.map(this.collection.models,function(md){return md.get('number');}),')'].join(''):false;
	},
	
	'getValue':function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':this.collection.map(function(mn){return mn.get('number');}),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	'setValue':function(filterValue) {
		//expecting what getValue would return
		this.collection.reset(_.map(filterValue.value, function(number){ return {'number':number}; }));
	},
	
	'reset':function() {
		this.sb.spinbox('value',0);
		this.collection.reset();
	},
	
	'addNumber':function(numberModel) {
		$('span.badge',this.addBtn).html(this.collection.length);
		this.listEl.append(this.listTemplate(numberModel));
		if(this.collection.length===1) {
			$('button.dropdown-toggle',this.$el).removeClass('disabled');
		}
	},
	'removeNumber':function(numberModel) {
		$('span.badge',this.addBtn).html(this.collection.length);
		$('li[data-cid="'+numberModel.cid+'"]',this.listEl).remove();
		if(this.collection.length<1) {
			$('button.dropdown-toggle',this.$el).addClass('disabled');
		}
	},
	'resetCollection':function(newCol) {
		$('span.badge',this.addBtn).empty();
		this.listEl.empty();
		if(newCol && newCol.length) {//is an actual collection
			newCol.each(function(numberModel) {
				this.addNumber(numberModel);
			}, this);
			$('button.dropdown-toggle',this.$el).removeClass('disabled');
		} else {
			$('button.dropdown-toggle',this.$el).addClass('disabled');
		}
	},
	
	'events':{
		'click button.sbadd':function(e) {
			var n = this.sb.spinbox('value')*1;
			
			// only add number if it isn't in the collection
			if(this.collection.where({'number':n}).length<1) {
				this.collection.add({'number':n});
			}
		},
		'click ul.cf-select-widget-list li button.close':function(e) {
			this.collection.remove($(e.currentTarget).data('cid'));
		}
	},
	
	'className':'fuelux',
	'listTemplate':_.template([
			'<li class="list-group-item" data-cid="<%= nm.cid %>">',
				'<button class="close" data-cid="<%= nm.cid %>"><span class="glyphicon glyphicon-remove btn-sm"></span></button>',
				'<p class="list-group-item-heading"><%= nm.get("number") %></p>',
			'</li>'
		].join(''),
		{'variable':'nm'}
	),
	'template':_.template([
		'<div class="row">',
			'<div class="col-lg-4 col-md-5 col-sm-10 col-xs-8">',CFTEMPLATES.numberSpinner1,'</div>',
			'<div class="col-lg-4 col-md-6 col-sm-12 col-xs-8">',
				'<div class="btn-group">',
					'<button type="button" class="btn btn-default sbadd">Add <span class="badge">0</span></button>',
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
		{variable:'spinbox'}
	),
	
	'initialize':function(options) {
		
		this.collection = new this.collectionInterface();
		this.collection.on({
			'add':this.addNumber,
			'reset':this.resetCollection,
			'remove':this.removeNumber
		}, this);
		
		// add ui
		this.$el.html(this.template({name:'sb'}));
		
		// initialize spinbox
		$('.spinbox',this.$el).spinbox( _.has(options,'config')?options.config : this.sbOptions);
		
		// assign class variables
		this.sb = $('.spinbox.sb',this.$el);
		this.addBtn = $('button.sbadd',this.$el);
		this.listEl = $('.dropdown-menu',this.$el);
	}
});
