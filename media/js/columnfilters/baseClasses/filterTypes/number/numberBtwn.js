// Filter Widget Type Implementation Class for Number (Between)
var VFilterWidgetTypeNumberBtwn = VFilterWidgetType.extend({
	type:'between',
	sbFrom:null,
	sbTo:null,
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
	validate:function() {
		
	},
	getValue:function() {
		return retVal = {
			'type':this.type,
			from:$.trim(this.sbFrom.spinbox('value'))*1,
			to:$.trim(this.sbTo.spinbox('value'))*1
		};
	},
	setValue:function(data) {
		//data is expected to be an object with from/to keys
		if(_.has(data,'from') && _.isNumber(data.from)) {
			this.sbFrom.spinbox('value',data.from);
		}
		if(_.has(data,'to') && _.isNumber(data.to)) {
			this.sbFrom.spinbox('value',data.to);
		}
	},
	reset:function() {
		//$('input',this.$el)[0].reset();
	},
	
	
	events:{
		'changed.fu.spinbox div.spinbox.sbFrom':function(e) {
			//console.log('spinbox from changed');
			// TODO
		},
		'changed.fu.spinbox div.spinbox.sbTo':function(e) {
			//console.log('spinbox to changed');
			
		}
	},
	template:_.template(
		'<div class="row"><div class="col-xs-4">'+_.template(CFTEMPLATES.numberSpinner1,{variable:'spinbox'})({name:'sbFrom'})+'</div>'+
		'<div class="col-xs-2"><span class="btn btn-default disabled"><span class="glyphicon glyphicon-resize-horizontal"></span> to</span></div>'+
		'<div class="col-xs-6">'+_.template(CFTEMPLATES.numberSpinner1,{variable:'spinbox'})({name:'sbTo'})+'</div>'+
		'<span class="help-block">filtering the results by column values between these numbers</span>'
	),
	initialize:function(options) {
		this.$el.addClass('fuelux');
		this.$el.html(this.template);
		$('.spinbox',this.$el).spinbox(this.sbOptions);
		this.sbFrom = $('.spinbox.sbFrom',this.$el);
		this.sbTo = $('.spinbox.sbTo',this.$el);
	},
	render:function() {
		return this;
	}
});
