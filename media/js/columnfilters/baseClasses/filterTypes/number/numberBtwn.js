// Filter Widget Type Implementation Class for Number (Between)
var VFilterWidgetTypeNumberBtwn = VFilterWidgetType.extend({
	'version':'1.0.2',
	'type':'between',
	'sbFrom':null,
	'sbTo':null,
	'sbOptions':{
		//value:<number>
		//min:<number>
		//max:<number>
		//step:<number>
		//hold:<boolean>
		//speed:<string> "fast","medium","slow"
		//disabled:<boolean>
		//units:<array> array of strings that are allowed to be entered in the input with the number
		'min':-10, 'max':100, 'step':.25
	},
	
	
	'isValid':function() {
		var fromNum = this.sbFrom.spinbox('value')*1,
			toNum = this.sbTo.spinbox('value')*1,
			fromNumCheck = !isNaN(fromNum),
			toNumCheck = !isNaN(toNum),
			isNotEqualCheck = (fromNum!==toNum);
		return (fromNumCheck && toNumCheck && isNotEqualCheck);
	},
	
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		
		this.trigger('notify', 'danger', 'Number Filter ('+this.type+') Error', 'A from and to number must be given.');
		return false;
	},
	
	'getValueDescription':function() {
		if(this.isValid()) {
			return 'is between ' + this.sbFrom.spinbox('value') + ' and ' + this.sbTo.spinbox('value');
		} else {
			return false;
		}
	},
	
	'getValue':function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'from':this.sbFrom.spinbox('value')*1,
				'to':this.sbTo.spinbox('value')*1,
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	'setValue':function(filterValue) {
		//data is expected to be an object with from/to keys
		if(_.has(filterValue,'from') && _.isNumber(filterValue.from)) {
			this.sbFrom.spinbox('value',filterValue.from);
		}
		if(_.has(filterValue,'to') && _.isNumber(filterValue.to)) {
			this.sbTo.spinbox('value',filterValue.to);
		}
	},
	
	'reset':function() {
		this.setValue({'from':0,'to':0});
	},
	
	
	'events':{
		'changed.fu.spinbox div.spinbox.sbFrom':function(e) {
			//console.log('spinbox from changed');
			// TODO
		},
		'changed.fu.spinbox div.spinbox.sbTo':function(e) {
			//console.log('spinbox to changed');
			
		}
	},
	
	'template':_.template(
		'<div class="row"><div class="col-xs-4">'+_.template(CFTEMPLATES.numberSpinner1,{variable:'spinbox'})({name:'sbFrom'})+'</div>'+
		'<div class="col-xs-2"><span class="btn btn-default disabled"><span class="glyphicon glyphicon-resize-horizontal"></span> to</span></div>'+
		'<div class="col-xs-6">'+_.template(CFTEMPLATES.numberSpinner1,{variable:'spinbox'})({name:'sbTo'})+'</div>'+
		'<span class="help-block">filtering the results by column values between these numbers</span>'
	),
	
	'initialize':function(options) {
		this.$el.addClass('fuelux');
		this.$el.html(this.template);
		$('.spinbox',this.$el).spinbox(this.sbOptions);
		this.sbFrom = $('.spinbox.sbFrom',this.$el);
		this.sbTo = $('.spinbox.sbTo',this.$el);
	},
	
	'render':function() {
		return this;
	}
});
