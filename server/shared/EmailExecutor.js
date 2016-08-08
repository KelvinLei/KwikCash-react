import config from '../config'
import _debug from 'debug'

const debug = _debug('app:server:shared:EmailExecutor')

const aws = require('aws-sdk');
const ses = new aws.SES({apiVersion: '2010-12-01'});

export const sendEmail = (subject, message) => {
  return new Promise((resolve, reject) => {
    debug("sending email");
    ses.sendEmail({
        Source: 'kelvin.j.lei@gmail.com',
        Destination: { ToAddresses: ['kelvin.j.lei@gmail.com'] },
        Message: {
          Subject: {
            Data: (config.env === 'development' || config.env ===  'test') ? `[Test] ${subject}` : subject,
          },
          Body: {
            Text: {
              Data: message
            }
          }
        }
      },
      (err, data) => {
        if (err) {
          debug("got email error" + err);
          reject(new Error("couldnt validate user"));
          return;
        }
        debug("email success");
        resolve({
          "success" : true
        })
      });
  })
}
