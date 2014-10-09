/*
<form class="form-horizontal" role="form">
  <div class="form-group">
    <label for="inputEmail3" class="col-sm-2 control-label">Email</label>
    <div class="col-sm-10">
      <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
    </div>
  </div>
  <div class="form-group">
    <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword3" placeholder="Password">
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <div class="checkbox">
        <label>
          <input type="checkbox"> Remember me
        </label>
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-default">Sign in</button>
    </div>
  </div>
</form>
*/
CFTEMPLATES.saveFilterSetModalForm = '<form class="form-horizontal" role="form">'+
	'<div class="form-group">'+
		'<label for="cfFilterSetSaveName" class="col-sm-2 control-label">Name</label>'+
		'<div class="col-sm-10">'+
			'<input type="text" class="form-control" id="cfFilterSetSaveName" placeholder="Name for this set of filters" autocomplete="off">'+
		'</div>'+
	'</div>'+
	'<div class="form-group">'+
		'<label for="cfFilterSetSaveDescription" class="col-sm-2 control-label">Description</label>'+
		'<div class="col-sm-10">'+
			'<textarea class="form-control" rows="3" id="cfFilterSetSaveDescription" autocomplete="off"></textarea>'+
		'</div>'+
	'</div>'+
'</form>';