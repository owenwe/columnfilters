// View for the Common Value Filter Selection Control
var VCommonValueFilterControl = Backbone.View.extend({
	
	hide:function() {
		this.$el.hide();
	},
	show:function() {
		this.$el.show();
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
				var remainingSelected = this.collection.where({'type':col.get('type'),'selected':true});
				if(remainingSelected.length<1) {
					//nothing selected, need to enable the other columns
					for(var i in disables) {
						var elToEnable = $('ul.dropdown-menu li button[data-name="'+disables[i].get('name')+'"]',this.$el);
						elToEnable.removeAttr('disabled');
						elToEnable.parent().addClass('cf-cvdd-active').removeClass('disabled');
					}
				}
				
			}
			return false;
		}
	},
	
	template:_.template($('#commonValueController').html(),{variable:'data'}),
	
	initialize:function(options) {
		this.collection = new Backbone.Collection(options.columns);
		this.$el.append(this.template({'columns':options.columns}));
	},
	render:function() {
		return this;
	}
});
