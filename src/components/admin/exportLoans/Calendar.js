import Pikaday from 'pikaday/pikaday.js'

export default () => {


  // DATETIMEPICKER
  // -----------------------------------

  // $('#datetimepicker1').datetimepicker();
  //
  // $('#datetimepicker').datetimepicker({
  //   icons: {
  //     time: 'fa fa-clock-o',
  //     date: 'fa fa-calendar',
  //     up: 'fa fa-chevron-up',
  //     down: 'fa fa-chevron-down',
  //     previous: 'fa fa-chevron-left',
  //     next: 'fa fa-chevron-right',
  //     today: 'fa fa-crosshairs',
  //     clear: 'fa fa-trash'
  //   }
  // });

  // var d = $('#datepicker').pikaday({
  //   firstDay: 1,
  //   minDate: new Date(2000, 0, 1),
  //   maxDate: new Date(2020, 12, 31),
  //   yearRange: [2000,2020]
  // });
  // chain a few methods for the first datepicker, jQuery style!
  // d.pikaday('show').pikaday('nextMonth');

  var startDate,
    endDate,
    updateStartDate = function() {
      startPicker.setStartRange(startDate);
      endPicker.setStartRange(startDate);
      endPicker.setMinDate(startDate);
    },
    updateEndDate = function() {
      startPicker.setEndRange(endDate);
      startPicker.setMaxDate(endDate);
      endPicker.setEndRange(endDate);
    },
    startPicker = new Pikaday({
      field: document.getElementById('fundStartDate'),
      maxDate: new Date(),
      onSelect: function() {
        startDate = this.getDate();
        updateStartDate();
      }
    }),
    endPicker = new Pikaday({
      field: document.getElementById('fundEndDate'),
      maxDate: new Date(),
      onSelect: function() {
        endDate = this.getDate();
        updateEndDate();
      }
    }),
    _startDate = startPicker.getDate(),
    _endDate = endPicker.getDate();

  if (_startDate) {
    startDate = _startDate;
    updateStartDate();
  }

  if (_endDate) {
    endDate = _endDate;
    updateEndDate();
  }
}
