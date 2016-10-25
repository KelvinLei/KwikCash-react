import _debug from 'debug'
import { sendEmail } from './shared/EmailExecutor'
import { getUserDataAsync } from './get-user-data'

export async function sendRefinanceEmail({user, loanInput}) {
  const subject = `[System] Customer request for refinance loan id ${loanInput.loanId}`
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
    user id: ${id}
    phone: ${phone}
    loan id: ${loanInput.loanId}
    currentBalance: ${loanInput.currentBalance}
    refinanceAmount: ${loanInput.refinanceAmount}
  `

  return await sendEmail({
    subject,
    message,
    sendToThalia: false
  })
}

export async function sendReferalEmail({user, referalEmail, referalName}) {
  const subject = '[System] Customer request for referal'
  const userData = await getUserDataAsync(user.id);

  const name = user.name;
  const username = user.username;
  const id = user.id;
  const phone = userData.homePhone;
  const message = `
    Customer has requested for a referal.
    Customer information:
    name: ${name}
    username: ${username}
    user id: ${id}
    phone: ${phone}

    email of referal: ${referalEmail}
    name of referal: ${referalName}
  `

  return await sendEmail({
    subject,
    message,
    sendToThalia: false
  })
}

export async function sendPayoffEmail({user, loanId}) {
  const subject = '[System] Customer request for payoff loan: ' + loanId
  const userData = await getUserDataAsync(user.id);

  const message = `
    Customer has requested to payoff their loan.

    Infomation:
    loan id: ${loanId}
    name: ${user.name}
    username: ${user.username}
    user id: ${user.id}
    phone: ${userData.homePhone}
  `

  return await sendEmail({
    subject,
    message,
    sendToThalia: true
  })
}

export async function sendReapplyEmail({user}) {
  const subject = '[System] Customer request for re-apply'
  const userData = await getUserDataAsync(user.id);

  const message = `
    Customer has requested for re-apply.

    Infomation:
    name: ${user.name}
    username: ${user.username}
    user id: ${user.id}
    phone: ${userData.homePhone}
  `

  return await sendEmail({
    subject,
    message,
    sendToThalia: true
  })
}
