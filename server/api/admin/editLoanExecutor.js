import { editLoanQuery } from './database-proxy'
import _debug from 'debug'

const debug = _debug('app:server:admin:editLoanExecutor')

export async function editLoan(editLoanContext) {
  debug(`calling editLoan`)
  const {
    loanStatus,
    repeatLoan,
    paymentSchedule,
    loanFundAmount,
    firstPaymentDate,
    loanFundDate,
    loanNoteDate,
    refiDate,
    loanRate,
    loanTerm,
    clientFundAmount,
    fundMethodRadio,
    isJudgement,
    defaultDate,
    lateDate,
    manualDate,
    isRecovery,
    recoveryBalance,
    recoveryDate,
    recoveryEndDate,
  } = editLoanContext
  debug(`editLoanContext ${JSON.stringify(editLoanContext)}`)
  return ''// await editLoanQuery()
}

