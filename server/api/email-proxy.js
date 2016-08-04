import _debug from 'debug'
import { sendEmail } from '../shared/EmailExecutor'
import { getUserDataAsync } from './get-user-data'

export async function sendRefinanceEmail({user, loanInput}) {
  const subject = '[System] Customer request for refinance'
  const userData = await getUserDataAsync(user.id);

  const name = user.name;
  const username = user.username;
  const id = user.id;
  const phone = userData.homePhone;
  const message = `
    Customer has requested for a refinance.
    Customer information:
    name: ${name}
    username: ${username}
    id: ${id}
    phone: ${phone}
    currentBalance: ${loanInput.currentBalance}
    refinanceAmount: ${loanInput.refinanceAmount}
  `

  return await sendEmail(subject, message)
}

export const sendPayoffEmail = (loanId) => {
  const subject = '[System] Payoff request for loan id ' + loanId
  const message = `User has submitted a payoff request for loan id ${loanId}. Please contact user to proceed.`

  return sendEmail(subject, message)
}
