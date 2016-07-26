export default function(completePercentage, completePaymentsCount, pendingPaymentsCount) {

  var chart = AmCharts.makeChart( "chartdiv", {
    "type": "pie",
    "theme": "light",
    "titles": [ {
      "text": completePercentage + "% completed!",
      "size": 14
    } ],
    "dataProvider": [ {
      "status": "Complete",
      "count": completePaymentsCount
    }, {
      "status": "Pending",
      "count": pendingPaymentsCount
    }],
    "valueField": "count",
    "titleField": "status",
    "startEffect": "elastic",
    "startDuration": 2,
    "labelRadius": 15,
    "innerRadius": "50%",
    "depth3D": 8,
    "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
    "angle": 0,
    "export": {
      "enabled": true
    },
    // "labelsEnabled": false,
    "autoMargins": false,
    "marginTop": 0,
    "marginBottom": 0,
    "marginLeft": 0,
    "marginRight": 0,
    "pullOutRadius": 0
  } );
  $( '.chart-input' ).off().on( 'input change', function() {
    var property = jQuery( this ).data( 'property' );
    var target = chart;
    var value = Number( this.value );
    chart.startDuration = 0;

    if ( property == 'innerRadius' ) {
      value += "%";
    }

    target[ property ] = value;
    chart.validateNow();
  } );

}