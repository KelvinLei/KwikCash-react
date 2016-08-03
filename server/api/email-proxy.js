import _debug from 'debug'
import { sendEmail } from '../shared/EmailExecutor'

//todo- correct data in email
export const sendRefinanceEmail = () => {
  const subject = '[System] A Message To You Rudy'
  const message = 'Stop your messing around'

  sendEmail(subject, message)
}

export const sendPayoffEmail = (loanId) => {
  const subject = '[System] Payoff request for loan id ' + loanId
  const message = `User has submitted a payoff request for loan id ${loanId}. Please contact user to proceed.`

  sendEmail(subject, message)
}