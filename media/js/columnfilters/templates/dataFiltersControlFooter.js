// controller.filterCategories
CFTEMPLATES.dataFiltersControlFooter = '<nav class="navbar navbar-default cf-datafilters-controller-footer" role="navigation">'+
	'	<div class="container-fluid">'+
	'		<div class="collapse navbar-collapse">'+	
	'<% if(controller.filterCategories.length){ print(\'<ul class=\"nav navbar-nav navbar-right\"><li class=\"btn btn-xs cf-delete-filter-list disabled\" title=\"delete\"><a href=\"#\" class=\" btn btn-xs\"><span class=\"glyphicon glyphicon-remove\"></span> </a></li><li class=\"dropup btn btn-xs cf-save-filter-list disabled\" title=\"save\"><a href=\"#\" class=\"dropdown-toggle btn btn-xs\" data-toggle=\"dropdown\"><span class=\"glyphicon glyphicon-floppy-disk\"></span><span class=\"caret\"></span></a><ul class=\"dropdown-menu\" role=\"menu\"></ul></li></ul>\'); } %>'+
	'		</div>'+
	'	</div>'+
'</nav>'+
'<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'+
	'<div class="modal-dialog modal-lg">'+
		'<div class="modal-content">'+
			'<div class="modal-header">'+
				'<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Cancel</span></button>'+
				'<h4 class="modal-title" id="cf-modal-title">Modal title</h4>'+
			'</div>'+
			'<div class="modal-body"></div>'+
			'<div class="modal-footer">'+
				'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
				'<button type="button" class="btn btn-primary">Save</button>'+
			'</div>'+
		'</div>'+
	'</div>'+
'</div>';