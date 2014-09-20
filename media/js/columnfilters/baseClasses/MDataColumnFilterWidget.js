// Data Column Filter Widget Model Class
var MDataColumnFilterWidget = Backbone.Model.extend({
	
	defaults:{
		type:'text',
		visible:false,
		enabled:true
	},
	
	initialize:function() {
		//console.log('data column filter widget init');
	}
});
