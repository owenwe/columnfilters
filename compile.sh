#!/bin/sh
cfpath=/d/projects/workspace/columnfilters

rm "$cfpath/columnfilters.js"
touch "$cfpath/columnfilters.js"

# templates
cat "$cfpath/media/js/columnfilters/templates/baseTemplateClass.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/templates/commonValueController.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/templates/dataFiltersPanelContent.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/templates/filterOptionListItem.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/templates/dataFiltersControlFooter.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/templates/numberSpinner1.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"

# base model/collections
cat "$cfpath/media/js/columnfilters/baseClasses/MDataFilter.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/CDataFilters.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/MFilterSet.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/CDataFilterSets.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"

# base views
cat "$cfpath/media/js/columnfilters/baseClasses/FilterWidgetType.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/DataColumnFilterWidget.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/DataFilterFactory.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/DataFiltersContainer.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/CommonValueFilterControl.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/DataFilters.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/DataFiltersControlBar.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"

# filter widgets
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/text/textEq.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/text/textSrch.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/number/numberEq.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/number/numberBtwn.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/number/numberSel.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/date/dateEq.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/date/dateBefore.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/date/dateAfter.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/date/dateBtwn.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/date/dateSel.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/date/dateCycle.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/date/dateM.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/date/dateMY.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/date/dateYear.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/boolean/boolEq.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/enum/enumIn.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
cat "$cfpath/media/js/columnfilters/baseClasses/filterTypes/biglist/biglistEq.js" >> "$cfpath/columnfilters.js" && printf "\n\n" >> "$cfpath/columnfilters.js"
