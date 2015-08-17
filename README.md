# ColumnFilters
Javascript and HTML UI controls for managing search filters on DataTable columns

## Requirements
Resource | Minimum Version | Notes
--- | --- | --- 
jQuery | 2.1.x | 
Bootstrap | 3.3.2 | 
Backbone | 1.2.x | Will also need underscore.js, but if you get the version of Backbone that includes underscore then you will be fine.
DataTables | 1.10.7 | If you are going to use any of the plugins then those resources must be included as well. 
dataTables.bootstrap | 1.10.4 | Both js and css files. 
jquery.dataTables | 1.10.4 | 
bootstrap.datepicker | 1.4.0 | 
Moment.js | 2.9.0 | 
Fuelux | 3.0.2 | Only spinbox.js is needed. However, you will need the fuelux.min.css
Typeahead | 0.11.1 | The typeahead bundle will include all the resources for Typeahead that are needed.

## Building
There is an ant script in the root directory. If you have Ant installed, run 
the following command to generate the uncompressed and compressed `.js` and `.css` 
files in the `/dist` directory. This command will also generate the documentation 
in the `/docs` directory.

`ant dist`

## Installing
The compressed and uncompressed .js and .css files are in the `/dist` directory.


## Usage
$('div#cf-container').ColumnFilters({options...});

