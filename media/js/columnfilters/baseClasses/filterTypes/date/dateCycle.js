// Filter Widget Type Implementation Class for Date (Equals)
var VFilterWidgetTypeDateCycle = VFilterWidgetType.extend({
	'version':'1.0.4',
	'type':'cycle',
	
	'isValid':function() {
		var d = this.model.get('dp').datepicker('getUTCDate');
		return d && !isNaN(d.getTime());
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
			var d = this.model.get('dp').datepicker('getUTCDate');
			return [
				'for the ',
				 _.findWhere(this.model.get('cycle'), {'value':$('div.btn-group label.active input', this.$el).val()*1}).label, 
				 ' billing cycle of ',
				this.model.get('months')[d.getMonth()+1], 
				', ', 
				d.getFullYear()
			].join('');
		} else {
			return false;
		}
	},
	
	/**
	 * Returns:
	 * {
		 type:'cycle',
		 monthYear:{ date:<ISO 8601 string>, timestamp:<timestamp> },
		 cycle:<int>,
		 cycleMap:<array>,
		 description:<string>
	 * }
	 */
	'getValue':function() {
		if(this.validate()) {
			// pass along the cycle map object for server-side processing
			// the date will always be the first day of the month
			var d = moment.utc(this.model.get('dp').datepicker('getUTCDate')),
				cycle = $('div.btn-group label.active input', this.$el).val()*1;
			return {
				'type':this.type,
				'monthYear':{
					'date':this.model.get('dp').datepicker('getUTCDate'), 
					'timestamp':moment.utc(this.model.get('dp').datepicker('getUTCDate')).valueOf()
				},
				'cycle':cycle,
				'cycleMap':this.model.get('cycle'),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	'setValue':function(filterValue) {
		if(_.has(filterValue,'monthYear') && _.isDate(filterValue.monthYear.date)) {
			this.model.get('dp').datepicker('setUTCDate', filterValue.monthYear.date);
		} else {
			this.model.get('dp').datepicker('update', null);
		}
		if(_.has(filterValue,'cycle')) {
			$('div.btn-group label', this.$el).each(function(i, e) {
				var lbl = $(e),
					inpt = $('input',$(e));
				lbl.removeClass('active');
				inpt.removeAttr('checked');
				if((inpt.val()*1)==filterValue.cycle) {
					lbl.addClass('active');
					inpt.attr('checked','checked');
					
				}
			});
		}
	},
	
	'reset':function() {
		this.setValue({'cycle':1});
	},
	
	'template':_.template([
		'<div class="row">',
			'<div class="col-lg-6 col-md-7 col-sm-12 col-xs-12">',
				'<div class="btn-group" data-toggle="buttons">',
					'<% for(var i in config.cycle) { %>',
						'<label class="btn btn-xs btn-primary<% if(i==0) { %> active<% } %>">',
							'<input type="radio" value="<%= config.cycle[i].value %>" <% if(i==0) { %> checked="checked"<% } %> /> ',
							'<%= config.cycle[i].label %>',
						'</label>',
					'<% } %>',
				'</div>',
			'</div>',
			'<div class="col-lg-6 col-md-5 col-sm-12 col-xs-12">',
				'<div class="input-group">',
					'<input type="text" class="form-control date" value="" />',
					'<span class="input-group-addon">',
						'<span class="glyphicon glyphicon-calendar"></span>',
					'</span>',
				'</div>',
			'</div>',
		'</div>'
	].join(''), {variable:'config'}),
	
	'initialize':function(options) {
		this.model = new Backbone.Model({
			'months':[
				'January','February','March',
				'April','May','June',
				'July','August','September',
				'October','November','December'
			],
			// cycle is expected to be an array of date range objects within 1 month
			'cycle':[
				{'label':'1st-15th', 'value':1},
				{'label':'16th-End Of Month', 'value':2}
			],
			'dp':null,
			'dpConfig':{
				'autoclose':true,
				'minViewMode':1,
				'startView':1,
				'name':'dpcy',
				'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.month_year
			}
		});
		
		if(options) {
			console.log(options);
			for(var i in options) {
				this.model.set(i, options[i]);
			}
		}
		
		this.$el.html(this.template(this.model.toJSON()));
		$('input.date', this.$el).datepicker(this.model.get('dpConfig'));
		this.model.set('dp', $('input.date', this.$el));
	}
});
