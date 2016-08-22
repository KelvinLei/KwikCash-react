import _debug from 'debug'

const debug = _debug('app:server:api:metrics-proxy')

const aws = require('aws-sdk');
const cloudWatch = new aws.CloudWatch({apiVersion: '2010-08-01'});

const NAME_SPACE_METRICS = 'KwikcashMetrics'

export const emitCounterMetrics = ({metricsName, user, dimensions}) => {
  return new Promise((resolve, reject) => {
    debug("emitting counter metrics");

    dimensions.push({
      Name: 'userId',
      Value: user.id.toString()
    })

    const params = {
      MetricData: [ /* required */
        {
          MetricName: metricsName, /* required */
          Dimensions: dimensions,
          Timestamp: new Date(),
          Unit: 'Count',
          Value: 1
        },
      ],
      Namespace: NAME_SPACE_METRICS /* required */
    }

    cloudWatch.putMetricData(params, function(err, data) {
      if (err) {
        debug("Got an error on emitting counter metrics" + err);
        reject(new Error("Got an error on emitting counter metrics. Possibly couldnt validate user"));
        return;
      } // an error occurred
      else {
        debug("Emitting counter metrics success" + data);
        resolve({
          "success" : true
        })
      }
    });
  })
}
