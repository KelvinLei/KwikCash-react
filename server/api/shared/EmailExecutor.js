import config from '../../config'
import _debug from 'debug'

const debug = _debug('app:server:shared:EmailExecutor')

const aws = require('aws-sdk');
const ses = new aws.SES({apiVersion: '2010-12-01'});

export const sendEmail = ({
  subject,
  message,
  messageType,
  destinations,
}) => {
  return new Promise((resolve, reject) => {
    debug("sending email");
    // const sendToAnddress = ['kelvin.j.lei@gmail.com']

    const body = messageType == 'Text' ?
    {
      Text: {
        Data: message
      }
    }
      :
    {
      Html: {
        Data: message
      }
    }

    ses.sendEmail({
        Source: 'info@kwikcashonline.com',
        Destination: { ToAddresses: destinations },
        Message: {
          Subject: {
            Data: (config.env === 'development' || config.env ===  'test') ? `[Test] ${subject}` : subject,
          },
          Body: body
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
