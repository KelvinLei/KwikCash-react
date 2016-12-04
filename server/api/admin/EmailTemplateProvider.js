import {runParameterizedQuery} from "./database-proxy";
import {decrypt} from "../shared/decrypter";
import _debug from "debug";
var moment = require('moment')

const debug = _debug('app:server:admin:deletePayment')

const PAYOFF_CONFIRMATION_ID = 5
const PAYMENT_TERMINATION_ID = 6

export async function getPayoffConfirmationEmail({
  loanId
}) {
  debug(`getPayoffConfirmationEmail loan id ${loanId}`)

  const { subject, message } = await getEmailContent(PAYOFF_CONFIRMATION_ID)
  const { fullName, userEmail, loanNumber } = await getDataForPayoffEmail(loanId)

  const newMessage = message.replace("|!--full_name--|", fullName)
                            .replace("|!--loan_number--|", loanNumber)
  return {
    userEmail,
    subject,
    message   : newMessage,
  }
}

export async function getPaymentTerminationEmail({
  loanId
}) {
  debug(`getPaymentTerminationEmail loan id ${loanId}`)

  const { subject, message } = await getEmailContent(PAYMENT_TERMINATION_ID)
  const paymentStopData = await getDataForPaymentTerminationEmail(loanId)

  const newMessage = message.replace("|!--full_name--|", paymentStopData.fullName)
                            .replace("|!--loan_number--|", paymentStopData.loanNumber)
                            .replace("|!--loan_amount--|", paymentStopData.loanAmount)
                            .replace("|!--loan_date--|", paymentStopData.loanDate)
                            .replace("|!--last_payment_amount--|", paymentStopData.lastPaymentAmount)
                            .replace("|!--bank_name--|", paymentStopData.bankName)
                            .replace("|!--bank_routing--|", paymentStopData.bankRouting)
                            .replace("|!--bank_account--|", paymentStopData.bankAccount)
                            .replace("|!--bank_account_type--|", paymentStopData.bankType)

  return {
    subject,
    message   : newMessage,
  }
}

async function getEmailContent(emailId) {
  const query = `
    SELECT * FROM tbl_emails WHERE email_id = ?
  `

  const results = await runParameterizedQuery({
    actionName      : 'getEmailContent',
    paramValueList  : [emailId],
    query,
  })

  return {
    subject   : results[0].email_subject,
    message   : results[0].email_body,
  }
}

async function getDataForPayoffEmail(loanId) {
  const query = `
    SELECT e.fname, e.lname, e.email, l.loan_number
    FROM tbl_loans as l, e_applications as e
    WHERE e.id = l.loan_application AND l.loan_id = ?
  `

  const results = await runParameterizedQuery({
    actionName      : 'getDataForPayoffEmail',
    paramValueList  : [loanId],
    query,
  })

  return {
    fullName    : results[0].fname + ' ' + results[0].lname,
    userEmail    : results[0].email,
    loanNumber  : results[0].loan_number,
  }
}

async function getDataForPaymentTerminationEmail(loanId) {
  debug(`getDataForPaymentTerminationEmail loan id ${loanId}`)

  const query = `
    SELECT loanpayment_amount, loan_app.*
    FROM tbl_loanpayments as p
    JOIN (
      SELECT 
        e.fname, e.lname, e.email, e.bank_name, e.bank_account, e.bank_routing, e.bank_type,
        l.loan_number, l.loan_amount, l.loan_id,
        DATE_FORMAT(l.loan_date, '%Y-%m-%d') as loan_date
      FROM 
        tbl_loans as l, e_applications as e
      WHERE 
        e.id = l.loan_application AND l.loan_id = ?
    ) as loan_app
    on p.loanpayment_amount <> 0 AND p.loanpayment_loan = loan_app.loan_id
    ORDER BY loanpayment_date DESC
    LIMIT 1
  `
  const results = await runParameterizedQuery({
    actionName      : 'getDataForPaymentTerminationEmail',
    paramValueList  : [loanId],
    query,
  })

  return {
    fullName            : results[0].fname + ' ' + results[0].lname,
    userEmail           : results[0].email,
    loanNumber          : results[0].loan_number,
    loanDate            : results[0].loan_date,
    loanAmount          : results[0].loan_amount,
    lastPaymentAmount   : results[0].loanpayment_amount,
    bankName            : decrypt(results[0].bank_name.toString()),
    bankAccount         : decrypt(results[0].bank_account.toString()),
    bankRouting         : decrypt(results[0].bank_routing.toString()),
    bankType            : results[0].bank_type == "C" ? "Checking" : "Savings",
  }
}