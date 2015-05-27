// Filter Widget Type Implementation Class for Number (Equals)
var VFilterWidgetTypeNumberEq = VFilterWidgetType.extend({
	'version':'1.0.3',
	'type':'equals',
	
	'isValid':function() {
		return !isNaN(this.model.get('sb').spinbox('value')*1);
	},
	
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		
		this.trigger('notify', 'danger', 'Number Filter ('+this.type+') Error', 'A valid number must be given.');
		return false;
	},
	
	'getValueDescription':function() {
		if(this.isValid()) {
			return 'is equal to ' + this.model.get('sb').spinbox('value')*1;
		} else {
			return false;
		}
	},
	
	'getValue':function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'numberType':this.model.get('numberType'),
				'value':this.model.get('sb').spinbox('value')*1,
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	'setValue':function(filterValue) {
		this.model.get('sb').spinbox('value', filterValue.value);
	},
	
	'reset':function() {
		this.setValue(0);
	},
	
	'template':_.template([
		'<div class="spinbox digits-5<% if(_.has(spinbox,"name")) { %> <%= spinbox.name %><% } %>">',
			'<input type="text" class="form-control input-mini spinbox-input" />',
			'<div class="spinbox-buttons btn-group btn-group-vertical">',
				'<button class="btn btn-default spinbox-up btn-xs">',
					'<span class="glyphicon glyphicon-chevron-up"></span><span class="sr-only">Increase</span>',
				'</button>',
				'<button class="btn btn-default spinbox-down btn-xs">',
					'<span class="glyphicon glyphicon-chevron-down"></span><span class="sr-only">Decrease</span>',
				'</button>',
			'</div>',
		'</div>',
		'<span class="help-block">filtering the results by column values equal to this</span>'
	].join(''), {variable:'spinbox'}),
	
	'initialize':function(options) {
		this.$el.addClass('fuelux');
		
		this.model = new Backbone.Model({
			'sb':null,
			'sbOptions':{'min':-10, 'max':100, 'step':.25},
			'numberType':'integer'
		});
		
		console.log(options);
		
		// make this a spinner (FuelUX, JQueryUI)
		this.$el.html(this.template({}));
		$('.spinbox', this.$el).spinbox(this.model.get('sbOptions'));
		this.model.set('sb', $('.spinbox', this.$el));
	},
	
	'render':function() {
		return this;
	}
});
