import _debug from 'debug'
import { sendEmail } from './EmailExecutor'
import { getUserDataAsync } from '../members/get-user-data'
import {getPayoffConfirmationEmail} from "../admin/EmailTemplateProvider";
import {getPaymentTerminationEmail} from "../admin/EmailTemplateProvider";
const debug = _debug('app:server:admin:email-proxy')

const INFO_EMAIL = 'info@kwikcashonline.com'
const TODD_EMAIL = 'todd@kwikcashonline.com'
const THALIA_EMAIL = 'thalia@kwikcashonline.com'
const ANA_EMAIL = 'ana@kwikcashonline.com'
const FRANKY_EMAIL = 'franky@kwikcashonline.com'
const JOSIE_EMAIL = 'josie@kwikcashonline.com'
const NATALIA_EMAIL = 'Natalia@kwikcashonline.com'
const KELVIN_EMAIL = 'kelvin.j.lei@gmail.com'
const TEXT = 'Text'
const HTML = 'Html'

export async function sendPayoffConfirmationEmail({loanId}) {
  const { userEmail, subject, message } = await getPayoffConfirmationEmail({loanId})

  debug(`userEmail: ${userEmail}`)
  return await sendEmail({
    subject,
    message,
    messageType   : HTML,
    destinations  : [userEmail],
  })
}

export async function sendPaymentTerminationReminderEmail({loanId}) {
  const { subject, message } = await getPaymentTerminationEmail({loanId})

  return await sendEmail({
    subject,
    message,
    messageType   : HTML,
    destinations  : [INFO_EMAIL, FRANKY_EMAIL, JOSIE_EMAIL, NATALIA_EMAIL, THALIA_EMAIL],
  })
}
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
    messageType   : TEXT,
    destinations : [INFO_EMAIL, THALIA_EMAIL, TODD_EMAIL, ANA_EMAIL],
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
    messageType   : TEXT,
    destinations : [INFO_EMAIL],
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
    messageType   : TEXT,
    destinations : [INFO_EMAIL, THALIA_EMAIL],
  })
}

export async function sendReapplyEmail({ user, applicationId}) {
  const subject = `[System] Re-apply application has been submitted`
  const userData = await getUserDataAsync(user.id);

  const message = `
    Customer has submitted an application for re-apply.

    Infomation:
    applicationId: ${applicationId}
    name: ${user.name}
    username: ${user.username}
    user id: ${user.id}
    phone: ${userData.homePhone}
  `

  return await sendEmail({
    subject,
    message,
    messageType   : TEXT,
    destinations : [INFO_EMAIL, THALIA_EMAIL, TODD_EMAIL, ANA_EMAIL],
  })
}
