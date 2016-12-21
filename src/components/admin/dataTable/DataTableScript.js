export default (tableDivId, sortArray = [], pageLength = 10, bFilter = true, innerScroll = false) => {

  if (!$.fn.dataTable) return;

  if (innerScroll) {
    var innerScrollTable = $('#' + tableDivId).dataTable({
      paging          : false, // Table pagination
      ordering        : true, // Column ordering
      info            : true, // Bottom left status text
      order           : sortArray,
      pageLength      : pageLength,
      bFilter         : bFilter,
      scrollY         : "500px",
      scrollCollapse  : true,
      bProcessing : true,
      bDeferRender : true,
      // Text translation options
      // Note the required keywords between underscores (e.g _MENU_)
      oLanguage: {
        sSearch: 'Search all columns:',
        sLengthMenu: '_MENU_ records per page',
        info: 'Showing page _PAGE_ of _PAGES_',
        zeroRecords: 'Nothing found - sorry',
        infoEmpty: 'No records available',
        infoFiltered: '(filtered from _MAX_ total records)'
      }
    });
  }
  else {
    var table = $('#' + tableDivId).dataTable({
      paging      : true, // Table pagination
      ordering    : true, // Column ordering
      info        : true, // Bottom left status text
      order       : sortArray,
      pageLength  : pageLength,
      bFilter     : bFilter,
      // Text translation options
      // Note the required keywords between underscores (e.g _MENU_)
      oLanguage: {
        sSearch: 'Search all columns:',
        sLengthMenu: '_MENU_ records per page',
        info: 'Showing page _PAGE_ of _PAGES_',
        zeroRecords: 'Nothing found - sorry',
        infoEmpty: 'No records available',
        infoFiltered: '(filtered from _MAX_ total records)'
      }
    });
  }
}