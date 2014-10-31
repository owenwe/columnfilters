// View for the Common Value Filter Selection Control
var VCommonValueFilterControl = Backbone.View.extend({
	
	selectedColumns:[],
	selectedCount:0,
	
	hide:function() {
		this.$el.hide();
	},
	show:function() {
		this.$el.show();
	},
	disable:function() {
		$('button.dropdown-toggle',this.$el).addClass('disabled');
	},
	enable:function() {
		$('button.dropdown-toggle',this.$el).removeClass('disabled');
	},
	
	getSelectedColumnData:function() {
		return this.selectedCount ? {
			'label':_.map(this.selectedColumns, function(c) { return c.attributes.label[0].toUpperCase()+c.attributes.label.substring(1); }).join(','), 
			'type':this.selectedColumns[0].attributes.type, 
			'name':_.map(this.selectedColumns, function(c) { return c.attributes.name; })  
		} : false;
	},
	
	
	tagName:'div',
	className:'btn-group cf-common-value-dropdown',
	events:{
		'mouseover ul.dropdown-menu li.cf-cvdd-active':function(e) {
			$(e.currentTarget).addClass('cf-common-value-list-item-hover');
		},
		'mouseleave ul.dropdown-menu li.cf-cvdd-active':function(e) {
			$(e.currentTarget).removeClass('cf-common-value-list-item-hover');
		},
		'click ul.dropdown-menu li.disabled':function(e) {
			return false;
		},
		'click ul.dropdown-menu li.cf-cvdd-active button':function(e) {
			//if it wasn't selected, then make it selected
			//if it was selected, then de-select it
			var col = this.collection.findWhere({'type':$(e.currentTarget).data('type'),'name':$(e.currentTarget).data('name')}),
				newSelectedStatus = !col.get('selected'),
				//enables = this.collection.where({'type':col.get('type')}),
				disables = this.collection.difference(this.collection.where({'type':col.get('type')}));
			col.set('selected',newSelectedStatus);
			console.log(col);//wondering if enum type should be excluded if their enum values are different
			
			this.selectedColumns = this.collection.where({'type':col.get('type'),'selected':true});
			this.selectedCount = this.selectedColumns.length;
			
			// toggle check visibility
			$('span',$(e.currentTarget)).toggleClass('hidden', !newSelectedStatus);
			
			if(newSelectedStatus) {//was not selected, now is
				
				// every model in the collection NOT of this type should be disabled
				for(var i in disables) {
					var elToDisable = $('ul.dropdown-menu li button[data-name="'+disables[i].get('name')+'"]',this.$el);
					elToDisable.attr('disabled','disabled');
					elToDisable.parent().removeClass('cf-cvdd-active').addClass('disabled');
				}
			} else {//de-selecting
				//de-select and remove from display list (trigger event for parent to handle)
				
				if(this.selectedCount<1) {
					//nothing selected, need to enable the other columns
					for(var i in disables) {
						var elToEnable = $('ul.dropdown-menu li button[data-name="'+disables[i].get('name')+'"]',this.$el);
						elToEnable.removeAttr('disabled');
						elToEnable.parent().addClass('cf-cvdd-active').removeClass('disabled');
					}
				}
				
			}
			
			this.trigger('columnClick', {
				'label':_.map(this.selectedColumns, function(c) { return c.attributes.label[0].toUpperCase()+c.attributes.label.substring(1); }).join(','), 
				'type':col.attributes.type, 
				'name':_.map(this.selectedColumns, function(c) { return c.attributes.name; })  
			});
			return false;
		}
	},
	
	template:_.template(CFTEMPLATES.commonValueController,{variable:'data'}),
	
	initialize:function(options) {
		/*
		 * columns is required in the options
		 * parse the columns array and pull out any columns that are:
		 *   - the only one of its type
		 *   - a single-value filter type
		*/
		var colTypes = _.countBy(options.columns, function(c) {return c.type;}),
			nonUniques = _.filter(options.columns, function(c) { return ( colTypes[c.type]>1 && c.type!='enum'); });
		
		this.collection = new Backbone.Collection( nonUniques );
		this.$el.append(this.template({'columns':nonUniques}));
	},
	render:function() {
		return this;
	}
});
