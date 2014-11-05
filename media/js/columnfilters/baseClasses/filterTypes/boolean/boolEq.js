// Filter Widget Type Implementation Class for Number (Select)
var VFilterWidgetTypeBoolEq = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'equals',
	
	defaultConfig:{
		'value':true,
		'trueLabel':'Active',
		'falseLabel':'Inactive'
	},
	
	model:null,
	
	isValid:function() {
		return true;//this ui should alway return a value
	},
	validate:function() {
		return true;
	},
	getValueDescription:function() {
		return ('is '+(this.model.get('value')?this.model.get('trueLabel'):this.model.get('falseLabel')));
	},
	getValue:function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':this.model.get('value'),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		if(_.isBoolean(filterValue.value)) {
			this.model.set('value', filterValue.value);
			//also change UI
			$('.btn-group label',this.$el).first().toggleClass('active', this.model.get('value'));
			$('.btn-group label',this.$el).last().toggleClass('active', !this.model.get('value'));
		}
	},
	reset:function() {
		this.setValue({'value':true})
	},
	
	events:{
		'click .btn-group label':function(e) {
			this.model.set('value', $(e.currentTarget).hasClass('cf-fw-type-bool-true'));
		}
	},
	
	template:_.template([
		'<div class="btn-group" data-toggle="buttons">',
			'<label class="btn btn-primary cf-fw-type-bool-true<%= value?" active":"" %>">',
				'<input type="radio" name="cf-fw-type-bool" id="cf-fw-type-bool-true"<%= value?" checked":"" %>> <%= trueLabel %>',
			'</label>',
			'<label class="btn btn-primary<%= value?"":" active" %>">',
				'<input type="radio" name="cf-fw-type-bool" id="cf-fw-type-bool-false" <%= value?"":" checked" %>> <%= falseLabel %>',
			'</label>',
		'</div>'
		].join('')),
	
	initialize:function(options) {
		this.model = new Backbone.Model();
		//options that affect UI
		this.model.set('trueLabel', (_.has(options,'trueLabel') && _.isString(options.trueLabel)) ? options.trueLabel : this.defaultConfig.trueLabel);
		this.model.set('falseLabel',(_.has(options,'falseLabel') && _.isString(options.falseLabel))?options.falseLabel:this.defaultConfig.falseLabel);
		
		this.$el.html(this.template(this.defaultConfig));
		
		this.model.set('value',(_.has(options,'value') && _.isBoolean(options.value) && !options.value)?false:this.defaultConfig.value);
	},
	render:function() {
		return this;
	}
});