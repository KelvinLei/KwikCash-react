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

  // fund date range
  var fundStartDate,
    fundEndDate,
    updateFundStartDate = function() {
      fundStartPicker.setStartRange(fundStartDate);
      fundEndPicker.setStartRange(fundStartDate);
      fundEndPicker.setMinDate(fundStartDate);
    },
    updateFundEndDate = function() {
      fundStartPicker.setEndRange(fundEndDate);
      fundStartPicker.setMaxDate(fundEndDate);
      fundEndPicker.setEndRange(fundEndDate);
    },
    fundStartPicker = new Pikaday({
      field: document.getElementById('fundStartDate'),
      maxDate: new Date(),
      onSelect: function() {
        fundStartDate = this.getDate();
        updateFundStartDate();
      }
    }),
    fundEndPicker = new Pikaday({
      field: document.getElementById('fundEndDate'),
      maxDate: new Date(),
      onSelect: function() {
        fundEndDate = this.getDate();
        updateFundEndDate();
      }
    }),
    _fundStartDate = fundStartPicker.getDate(),
    _fundEndDate = fundEndPicker.getDate();

  if (_fundStartDate) {
    fundStartDate = _fundStartDate;
    updateFundStartDate();
  }

  if (_fundEndDate) {
    fundEndDate = _fundEndDate;
    updateFundEndDate();
  }

  // payoff date range
  var payoffStartDate,
    payoffEndDate,
    updatePayoffStartDate = function() {
      payoffStartPicker.setStartRange(payoffStartDate);
      payoffEndPicker.setStartRange(payoffStartDate);
      payoffEndPicker.setMinDate(payoffStartDate);
    },
    updatePayoffEndDate = function() {
      payoffStartPicker.setEndRange(payoffEndDate);
      payoffStartPicker.setMaxDate(payoffEndDate);
      payoffEndPicker.setEndRange(payoffEndDate);
    },
    payoffStartPicker = new Pikaday({
      field: document.getElementById('payoffStartDate'),
      maxDate: new Date(),
      onSelect: function() {
        payoffStartDate = this.getDate();
        updatePayoffStartDate();
      }
    }),
    payoffEndPicker = new Pikaday({
      field: document.getElementById('payoffEndDate'),
      maxDate: new Date(),
      onSelect: function() {
        payoffEndDate = this.getDate();
        updatePayoffEndDate();
      }
    }),
    _payoffStartDate = payoffStartPicker.getDate(),
    _payoffEndDate = payoffEndPicker.getDate();

  if (_payoffStartDate) {
    payoffStartDate = _payoffStartDate;
    updatePayoffStartDate();
  }

  if (_payoffEndDate) {
    payoffEndDate = _payoffEndDate;
    updatePayoffEndDate();
  }
}
