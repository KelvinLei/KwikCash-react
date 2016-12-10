import { createPaymentQuery
} from './database-proxy'
import _debug from 'debug'
import {fetchPayoffForDate} from "./fetchPayoff"
import {runParameterizedQuery} from "./database-proxy";
import {sendPayoffConfirmationEmail} from "../shared/email-proxy";
import {sendPaymentTerminationReminderEmail} from "../shared/email-proxy";
var moment = require('moment')

const debug = _debug('app:server:admin:editLoanExecutor')

/**
 if new loan status is paid and previous status is not paid
   get remaining balance from previous paid payment
   get paid off date, default to current date if not provided
   calculate paid off interest
   create a payment that
     payment date = paid off date
     payment schedule = selected payment schedule
     rate = rate
     due = 0
     paid = payoff amount
     principal = remaining balance from previous paid payment
     interest = payoff interest
     extra amount = 0
     scheduled = N
 else
    update paid off date in db

 */
export async function editLoan(editLoanContext) {
  debug(`calling editLoan`)
  const {
    loanId,
    currLoanStatus,
    loanStatus,
    payoffDate,
    paymentSchedule,
    defaultDate,
    sendPayoffEmail,
    sendPaymentTerminationReminder,
  } = editLoanContext

  // only generate payoff payment once (when the loan is marked as paid for the first time
  // when mark a loan as Paid the first time
  if (loanStatus == 'P' && currLoanStatus != 'P') {
    const payoffData = await fetchPayoffForDate(loanId, payoffDate)
    debug(`loan is marking paid off and a payoff payment gets created with payoff data 
            ${JSON.stringify(payoffData)}`)
    await createPaymentQuery({
      loanId            : loanId,
      due               : 0,
      paid              : payoffData.payoffAmount,
      scheduled         : 'N',
      paymentschedule   : paymentSchedule,
      rate              : payoffData.interestFromNextPayment,
      date              : payoffData.payoffDate,
      interest          : payoffData.payoffInterest,
      principal         : payoffData.balanceFromLastPayment,
    })

    await waiveFuturePayments(loanId, payoffData.payoffDate)

    // check whether to send payoff confirmation email to client
    if (sendPayoffEmail == true) {
      await sendPayoffConfirmationEmail({loanId})
    }

    // check whether to send payment termination reminder email to staff
    if (sendPaymentTerminationReminder == true) {
      await sendPaymentTerminationReminderEmail({loanId})
    }
  }
  // when mark a loan as Charged Off the first time
  else if (loanStatus == 'D' && currLoanStatus != 'D') {
    const payoffData = await fetchPayoffForDate(loanId, payoffDate)
    debug(`loan is marking charged off and a payoff payment gets created with payoff data 
            ${JSON.stringify(payoffData)}`)
    await createPaymentQuery({
      loanId            : loanId,
      due               : 0,
      paid              : payoffData.balanceFromLastPayment,
      scheduled         : 'C',
      paymentschedule   : paymentSchedule,
      rate              : payoffData.interestFromNextPayment,
      date              : defaultDate,
      interest          : 0,
      principal         : payoffData.balanceFromLastPayment,
    })
    await waiveFuturePayments(loanId, defaultDate)
  }

  debug(`editLoanContext ${JSON.stringify(editLoanContext)}`)
  await editLoanLevelData(editLoanContext)
}

async function waiveFuturePayments(loanId, date) {
  const query = `
    UPDATE tbl_loanpayments
    SET 
    loanpayment_due = 0,
    loanpayment_amount = 0,
    loanpayment_interest = 0,
    loanpayment_principal = 0
    WHERE loanpayment_loan = ? AND loanpayment_date > ?
  `

  await runParameterizedQuery({
    actionName      : 'waiveFuturePayments',
    paramValueList  : [
      loanId, date
    ],
    query,
  })
}

async function editLoanLevelData(editLoanContext) {
  const {
    loanId, loanStatus, repeatLoan, paymentSchedule, loanFundAmount, firstPaymentDate,
    loanFundDate, loanNoteDate, refiDate, loanRate, loanTerm, clientFundAmount, fundMethod,
    isJudgement, defaultDate, lateDate, manualDate, isRecovery, recoveryBalance, recoveryDate,
    recoveryEndDate, payoffDate
  } = editLoanContext

  const query = `
        UPDATE tbl_loans
        SET
        loan_status = ?, 
        loan_repeat = ?, 
        loan_paymentschedule = ?, 
        loan_payoffdate = ?,
        loan_amount = ?,
        loan_paymentdate = ?,
        loan_funddate = ?,
        loan_notedate = ?,
        loan_refidate = ?,
        loan_rate = ?,
        loan_term = ?,
        loan_fundamount = ?,
        loan_fundmethod = ?,
        loan_judgement = ?,
        loan_defaultdate = ?,
        loan_latedate = ?,
        loan_manualdate = ?,
        loan_recovery = ?,
        loan_recoverybalance = ?,
        loan_recoverydate = ?,
        loan_recoverystop = ?
        WHERE loan_id = ?
      `
  await runParameterizedQuery({
    actionName      : 'editLoanLevelData',
    paramValueList  : [
      loanStatus, repeatLoan, paymentSchedule, payoffDate, loanFundAmount, firstPaymentDate,
      loanFundDate, loanNoteDate, refiDate, loanRate, loanTerm, clientFundAmount, fundMethod, isJudgement,
      defaultDate, lateDate, manualDate, isRecovery, recoveryBalance, recoveryDate, recoveryEndDate, loanId,
    ],
    query,
  })
}