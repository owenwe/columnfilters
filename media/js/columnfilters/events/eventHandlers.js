// Event Functions

// event function for when a widget type is selected
function evtFunc_FilterWidgetTypeSelected(e) {
	var visWidgetType = $('div.cf-widget-type:visible', e.data.selectedType.$el.parent());
	if(e.data.selectedType.type!=visWidgetType.attr('title')) {
		//change filter widget type selector label
		$('span.cf-widget-type-selector-btn-title', e.data.selectedType.$el.parent().parent()).html(e.data.selectedType.type);
		//hide current widget type
		visWidgetType.hide();
		//show widget type for e.data.selectedType.type
		e.data.selectedType.$el.show();
	}
}
