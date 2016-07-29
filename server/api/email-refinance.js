import _debug from 'debug'

const debug = _debug('app:server:email-refinance')

const aws = require('aws-sdk');
const ses = new aws.SES({apiVersion: '2010-12-01'});

//todo- correct data in email
export function sendRefinanceEmail() {
  return new Promise((resolve, reject) => {
    debug("sending email");
    ses.sendEmail({
       Source: 'aamirnshah@gmail.com',
       Destination: { ToAddresses: ['aamirnshah@gmail.com'] },
       Message: {
           Subject: {
              Data: 'A Message To You Rudy'
           },
           Body: {
               Text: {
                   Data: 'Stop your messing around',
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
