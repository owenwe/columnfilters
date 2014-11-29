#!/bin/bash

if [ -r "columnfilters-embedable.js" ]; then 
	rm columnfilters-embedable.js
fi
if [ -r "columnfilters-embedable.css" ]; then
	rm columnfilters-embedable.css
fi
touch columnfilters-embedable.js
touch columnfilters-embedable.css

# creates a columnfilters-embedable.css file
cat media/css/bootstrap.min.css >> columnfilters-embedable.css && printf "\n\n" >> columnfilters-embedable.css
cat media/css/bootstrap-theme.min.css >> columnfilters-embedable.css && printf "\n\n" >> columnfilters-embedable.css
cat media/css/dataTables.bootstrap.css >> columnfilters-embedable.css && printf "\n\n" >> columnfilters-embedable.css
cat media/css/datepicker.css >> columnfilters-embedable.css && printf "\n\n" >> columnfilters-embedable.css
cat media/css/datepicker3.css >> columnfilters-embedable.css && printf "\n\n" >> columnfilters-embedable.css
cat media/css/fuelux.min.css >> columnfilters-embedable.css && printf "\n\n" >> columnfilters-embedable.css
cat media/css/columnfilters-0.0.1b.css >> columnfilters-embedable.css && printf "\n\n" >> columnfilters-embedable.css

# creates a columnfilters-embedable.js file
cat media/js/jquery-2.1.1.min.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/underscore-min.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/backbone-min.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/bootstrap.min.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/typeahead.bundle.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/jquery.dataTables.min.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/dataTables.bootstrap.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/bootstrap-datepicker.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/spinbox.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/baseTemplateClass.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/commonValueController.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/dataFiltersPanelContent.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/filterOptionListItem.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/dataFiltersControlBody.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/dataFiltersControlFooter.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/filterCategoryMenu.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/filterCategorySaveItem.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/saveFilterSetModalForm.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/datepickerType4.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/datepickerType3.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/dateBetweenFilterWidgetType.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/templates/numberSpinner1.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/MColumnFilter.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/CColumnFilters.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/MDataColumnFilter.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/CDataColumnFilters.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/MDataFilter.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/CDataFilters.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/FilterWidgetType.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/DataColumnFilterWidget.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/DataFilterFactory.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/DataFiltersContainer.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/CommonValueFilterControl.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/DataFilters.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/filterTypes/text/textEq.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/filterTypes/text/textSrch.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/filterTypes/number/numberEq.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/filterTypes/number/numberBtwn.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/filterTypes/number/numberSel.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/filterTypes/date/dateEq.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/filterTypes/date/dateBtwn.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/filterTypes/date/dateSel.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/filterTypes/date/dateCycle.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/filterTypes/boolean/boolEq.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/filterTypes/enum/enumIn.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js
cat media/js/columnfilters/baseClasses/filterTypes/biglist/biglistEq.js >> columnfilters-embedable.js && printf "\n\n" >> columnfilters-embedable.js