// Filter Widget Type Implementation Class for Number (Equals)
var VFilterWidgetTypeNumberEq = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'equals',
	sb:null,
	sbOptions:{
		//value:<number>
		//min:<number>
		//max:<number>
		//step:<number>
		//hold:<boolean>
		//speed:<string> "fast","medium","slow"
		//disabled:<boolean>
		//units:<array> array of strings that are allowed to be entered in the input with the number
		min:-10, max:100, step:.25
	},
	
	
	isValid:function() {
		return !isNaN(this.sb.spinbox('value')*1);
	},
	validate:function() {
		if(this.isValid()) {
			return true;
		}
	},
	getValueDescription:function() {
		if(this.isValid()) {
			return 'is equal to ' + this.sb.spinbox('value')*1;
		} else {
			return false;
		}
	},
	getValue:function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':this.sb.spinbox('value')*1,
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		this.sb.spinbox('value',filterValue.value);
	},
	reset:function() {
		this.setValue(0);
	},
	
	template:_.template(
		CFTEMPLATES.numberSpinner1+
		'<span class="help-block">filtering the results by column values equal to this</span>',
		{variable:'spinbox'}
	),
	initialize:function(options) {
		this.$el.addClass('fuelux');
		// make this a spinner (FuelUX, JQueryUI)
		this.$el.html(this.template({}));
		$('.spinbox',this.$el).spinbox(this.sbOptions);
		this.sb = $('.spinbox',this.$el);
	},
	render:function() {
		return this;
	}
});
