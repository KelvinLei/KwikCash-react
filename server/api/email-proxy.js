import _debug from 'debug'
import { sendEmail } from '../shared/EmailExecutor'

//todo- correct data in email
export const sendRefinanceEmail = () => {
  const subject = 'A Message To You Rudy'
  const message = 'Stop your messing around'
  
  sendEmail(subject, message)
}

export const sendPayoffEmail = () => {
  const subject = 'Payoff email subject'
  const message = 'Payoff email message body'

  sendEmail(subject, message)
}