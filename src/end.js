    
    // any kind of extensions, helper classes, etc. to be attached to the
    // $.fn.ColumnFilters namespace
    
    // this will probably be included in a future release of Bloodhound
    $.fn.ColumnFilters.tokenizers = {
        // this is actually from a stackoverflow question/solution by kenji
        // http://stackoverflow.com/questions/22059933/twitter-typeahead-js-how-to-return-all-matched-elements-within-a-string
        'whitespace':function(datum) {
            var i, j, dset = Bloodhound.tokenizers.whitespace(datum.name);
            for(i in dset) {
                j = 0;
                while((j+1)<dset[i].length) {
                    dset.push(dset[i].substr(j++, dset[i].length));
                }
            }
            return dset;
        }
    };

    $.fn.ColumnFilters.VERSION = '1.0.1';
})(jQuery);