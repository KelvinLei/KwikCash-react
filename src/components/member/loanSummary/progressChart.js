export default function(completePercentage) {

  var chart = AmCharts.makeChart( "chartdiv", {
    "type": "pie",
    "theme": "light",
    "titles": [ {
      "text": completePercentage + " completed!",
      "size": 14
    } ],
    "dataProvider": [ {
      "status": "Complete",
      "count": 5
    }, {
      "status": "Pending",
      "count": 15
    }],
    "valueField": "count",
    "titleField": "status",
    "startEffect": "elastic",
    "startDuration": 2,
    "labelRadius": 15,
    "innerRadius": "50%",
    "depth3D": 10,
    "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
    "angle": 15,
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