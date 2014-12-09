// Filter Widget Type Implementation Class for Date (Equals)
var VFilterWidgetTypeDateCycle = VFilterWidgetType.extend({
	'version':'1.0.2',
	'type':'cycle',
	
	//aren't these available somewhere else like JQuery or Backbone or something?
	'months':['January','February','March','April','May','June','July','August','September','October','November','December'],
	
	'dp':null,
	'dpConfig':{
		'autoclose':true,
		'minViewMode':1,
		'startView':1,
		'name':'dpcy',
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.month_year
	},
	'cycle':[
		{'label':'1st-15th', 'value':1},
		{'label':'16th-End Of Month', 'value':2}
	],
	
	
	'isValid':function() {
		var d = this.dp.datepicker('getDate');
		return !isNaN(d.getTime());
	},
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		
		this.trigger('notify', 'danger', 'Date Filter ('+this.type+') Error', 'A month and year must be selected.');
		return false;
	},
	'getValueDescription':function() {
		if(this.isValid()) {
			var d = this.dp.datepicker('getDate');
			return [
				'for the ', _.findWhere(this.cycle, {'value':$('div.btn-group label.active input',this.$el).val()*1}).label, ' billing cycle of ',
				this.months[d.getMonth()], ', ', d.getFullYear()
			].join('');
		} else {
			return false;
		}
	},
	'getValue':function() {
		if(this.validate()) {
			// pass along the cycle map object for server-side processing
			return {
				'type':this.type,
				'monthYear':{'date':this.dp.datepicker('getDate'), 'timestamp':this.dp.datepicker('getDate').getTime()},
				'cycle':$('div.btn-group label.active input',this.$el).val()*1,
				'cycleMap':this.cycle,
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	'setValue':function(filterValue) {
		if(_.has(filterValue,'monthYear') && _.isDate(filterValue.monthYear.date)) {
			this.dp.datepicker('setUTCDate',filterValue.monthYear.date);
		} else {
			this.dp.datepicker('update',null);
		}
		if(_.has(filterValue,'cycle')) {
			// here it is
			$('div.btn-group label',this.$el).each(function(i,e){
				var lbl = $(e),
					inpt = $('input',$(e));
				lbl.removeClass('active');
				inpt.removeAttr('checked');
				if((inpt.val()*1)==filterValue.cycle){
					lbl.addClass('active');
					inpt.attr('checked','checked');
				}
			});
		}
	},
	'reset':function() {
		this.setValue({'cycle':1});
	},
	
	
	'template':_.template(
		'<div class="btn-group" data-toggle="buttons"></div>'+CFTEMPLATES.datepicker,
		{variable:'datepicker'}
	),
	'initialize':function(options) {
		if(options && options.hasOwnProperty('cycle')) {
			// cycle is expected to be an array of date range objects within 1 month
			// [{label:<str>,value:<?>},...]
			this.cycle = options.cycle;
		}
		this.$el.html(this.template(this.dpConfig));
		$('.dpcy',this.$el).datepicker(this.dpConfig);
		this.dp = $('.dpcy',this.$el);
		
		//populate buttons
		for(var i in this.cycle) {
			$('div.btn-group',this.$el).append(
				$(document.createElement('label')).addClass('btn btn-primary').append(
					$(document.createElement('input')).attr({'type':'radio','id':_.uniqueId('cf-dpcy_'),'value':this.cycle[i].value}),
					this.cycle[i].label
				)
			);
		}
		$('div.btn-group label.btn:first-child',this.$el).addClass('active');
		$('div.btn-group label.btn:first-child input',this.$el).first().attr('checked','checked');
	}
});
