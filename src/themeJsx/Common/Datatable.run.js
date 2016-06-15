export default () => {

  if (!$.fn.dataTable) return;

  //
  // Zero configuration
  //

  $('#paymentPlantTable').dataTable({
    'paging': true, // Table pagination
    'ordering': true, // Column ordering
    'info': true, // Bottom left status text
    // bFilter: false, // remove search bar as search bar conflicts with payment status tab
    
    // Text translation options
    // Note the required keywords between underscores (e.g _MENU_)
    oLanguage: {
      sLengthMenu: '_MENU_ records per page',
      info: 'Showing page _PAGE_ of _PAGES_',
      zeroRecords: 'Nothing found - sorry',
      infoEmpty: 'No records available',
      infoFiltered: '(filtered from _MAX_ total records)'
    }
  });


}