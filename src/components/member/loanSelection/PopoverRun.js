export default () => {

  // reapply
  $(function () {
    $('[data-toggle="reapplyPopover"]').popover('show')
  })
  $(window).resize(function() {
    // your positioning code here
    $('[data-toggle="reapplyPopover"]').popover('show')
  });

  // refinance
  $(function () {
    $('[data-toggle="refiPopover"]').popover('show')
  })
  $(window).resize(function() {
    // your positioning code here
    $('[data-toggle="refiPopover"]').popover('show')
  });
}