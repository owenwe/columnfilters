#!/bin/sh

rm columnfilters-0.0.1b.js
touch columnfilters-0.0.1b.js

# templates
cat media/js/columnfilters/templates/baseTemplateClass.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/templates/commonValueController.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/templates/dataFiltersPanelContent.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/templates/filterOptionListItem.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/templates/dataFiltersControlBody.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/templates/dataFiltersControlFooter.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/templates/filterCategoryMenu.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/templates/filterCategorySaveItem.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/templates/saveFilterSetModalForm.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/templates/datepickerType4.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/templates/datepickerType3.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/templates/dateBetweenFilterWidgetType.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/templates/numberSpinner1.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js

# base model/collections
cat media/js/columnfilters/baseClasses/MColumnFilter.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/CColumnFilters.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/MDataColumnFilter.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/CDataColumnFilters.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/MDataFilter.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/CDataFilters.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js

# base views
cat media/js/columnfilters/baseClasses/FilterWidgetType.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/DataColumnFilterWidget.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/DataFilterFactory.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/DataFiltersContainer.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/CommonValueFilterControl.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/DataFilters.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js

# filter widgets
cat media/js/columnfilters/baseClasses/filterTypes/text/textEq.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/filterTypes/text/textSrch.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js

cat media/js/columnfilters/baseClasses/filterTypes/number/numberEq.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/filterTypes/number/numberBtwn.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/filterTypes/number/numberSel.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js

cat media/js/columnfilters/baseClasses/filterTypes/date/dateEq.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/filterTypes/date/dateBtwn.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/filterTypes/date/dateSel.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js
cat media/js/columnfilters/baseClasses/filterTypes/date/dateCycle.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js

cat media/js/columnfilters/baseClasses/filterTypes/boolean/boolEq.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js

cat media/js/columnfilters/baseClasses/filterTypes/enum/enumIn.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js

cat media/js/columnfilters/baseClasses/filterTypes/biglist/biglistEq.js >> columnfilters-0.0.1b.js && printf "\n\n" >> columnfilters-0.0.1b.js