import { runParameterizedQuery } from './database-proxy'
import _debug from 'debug'
import {decrypt} from "../shared/decrypter";
import { LOAN_STATUS_MAP } from '../shared/loansConstants'

const debug = _debug('app:server:admin:api:fetchARReport')

export async function fetchARReport() {
  const start = new Date()

  const query = `
    SELECT
        e_applications.id,
        e_applications.lname,
        e_applications.fname,
        tbl_loans.*,
        DATE_FORMAT(tbl_loans.loan_funddate, '%Y-%m-%d') as loanFundDate,
        DATE_FORMAT(tbl_loans.loan_notedate, '%Y-%m-%d') as loanNoteDate,
        CASE WHEN loan_status='L' then
            CASE 
               WHEN loan_paymentschedule = '4' then (TIMESTAMPDIFF(MONTH , loan_latedate, CURDATE( ) ) +1) *30
               WHEN loan_paymentschedule = '4n' then (TIMESTAMPDIFF(MONTH , loan_latedate, CURDATE( ) ) +1) *30
               WHEN loan_paymentschedule = 'W' then (TIMESTAMPDIFF(MONTH , loan_latedate, CURDATE( ) ) +1) *30
               WHEN loan_paymentschedule = '2' then (TIMESTAMPDIFF(MONTH , loan_latedate, CURDATE( ) ) +1) *30
               WHEN loan_paymentschedule = '2N' then (TIMESTAMPDIFF(MONTH , loan_latedate, CURDATE( ) ) +1) *30
               WHEN loan_paymentschedule = '1' then (TIMESTAMPDIFF(MONTH , loan_latedate, CURDATE( ) ) +1) *30
               ELSE DATEDIFF( CURDATE( ) , loan_latedate ) 
            END
        ELSE 0 
        END
        AS days,
       IFNULL((
            SELECT SUM(loanpayment_principal)
            FROM tbl_loanpayments
            WHERE loanpayment_loan = loan_id
            AND loanpayment_amount <> 0
        ), 0) AS loan_paid, 
       DATE_FORMAT((
            SELECT loanpayment_date
            FROM tbl_loanpayments
            WHERE loanpayment_loan = loan_id
            AND loanpayment_amount <> 0
            AND loanpayment_date < CURDATE( )
            ORDER BY loanpayment_date DESC
            LIMIT 1
       ), '%Y-%m-%d') AS lastDate,
       IFNULL((
            SELECT loanpayment_amount
            FROM tbl_loanpayments
            WHERE loanpayment_loan = loan_id
            AND loanpayment_amount <> 0
            AND loanpayment_date < CURDATE( )
            ORDER BY loanpayment_date DESC
            LIMIT 1
       ), 0) AS lastAmount,
       DATE_FORMAT((
            SELECT loanpayment_date
            FROM tbl_loanpayments
            WHERE loanpayment_loan = loan_id
            AND loanpayment_scheduled = 'Y'
            AND loanpayment_date >= CURDATE( )
            ORDER BY loanpayment_date
            LIMIT 1
       ), '%Y-%m-%d') AS nextDate
     FROM e_applications, tbl_loans
     WHERE loan_application = e_applications.ID
     AND loan_status IN ('L','M','A','F')
     ORDER BY loan_status DESC, loan_id, lname, fname
  `

  const rows = await runParameterizedQuery({
    actionName      : 'fetchARReport',
    paramValueList  : [],
    query,
  })

  const end = new Date()
  var dif = end.getTime() - start.getTime();
  var Seconds_from_T1_to_T2 = dif / 1000;
  var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
  debug(`db results ready time: ${Seconds_Between_Dates}`)
  const stats = {
     total_00               :  0,
     total_31               :  0,
     total_61               :  0,
     total_91               :  0,
     total_121              :  0,
     total_151              :  0,
     total_total            :  0,
     total_balance          :  0,
     total_lastpayment      :  0,
     total_count            :  0,
     total_countactive      :  0,
     total_amountactive     :  0,
     total_countlate        :  0,
     total_rateactive       :  0,
     total_ratelate         :  0,
     count_00               :  0,
     count_31               :  0,
     count_61               :  0,
     count_91               :  0,
     count_121              :  0,
     count_151              :  0,
     percent_active         : 0,
     percent_late           : 0,
     average_rateactive     : 0,
     average_ratelate       : 0,
     percent_activeamount   : 0,
     percent_lateamount     : 0,
  }

  const applications = rows.map( (row) => {
    const loanBalance = row.loan_amount && row.loan_paid >= 0 ?
                        (parseFloat(row.loan_amount) - parseFloat(row.loan_paid)).toFixed(2)
                        : 0.00
    const loanStatusCode = row.loan_status
    const daysLate = row.days
    const loanRate = row.loan_rate
    let balance_00 = 0
    let balance_31 = 0
    let balance_61 = 0
    let balance_91 = 0
    let balance_121 = 0
    let balance_151 = 0

    if (loanStatusCode == 'L') {
      if (daysLate < 31) {
        balance_00 = loanBalance
        stats.total_00 = (parseFloat(stats.total_00) + parseFloat(loanBalance)).toFixed(2)
        debug(`full name: ${row.fname + ' ' + row.lname}. ID: ${row.id} loanBalance ${loanBalance} stats.total_00  ${stats.total_00}`)
        stats.count_00++
      }
      else if (daysLate < 61) {
        balance_31 = loanBalance
        stats.total_31 = (parseFloat(stats.total_31) + parseFloat(loanBalance)).toFixed(2)
        stats.count_31++
      }
      else if (daysLate < 91) {
        balance_61 = loanBalance
        stats.total_61 = (parseFloat(stats.total_61) + parseFloat(loanBalance)).toFixed(2)
        stats.count_61++
      }
      else if (daysLate < 121) {
        balance_91 = loanBalance
        stats.total_91 = (parseFloat(stats.total_91) + parseFloat(loanBalance)).toFixed(2)
        stats.count_91++
      }
      else if (daysLate < 151) {
        balance_121 = loanBalance
        stats.total_121 = (parseFloat(stats.total_121) + parseFloat(loanBalance)).toFixed(2)
        stats.count_121++
      }
      else if (daysLate < 181) {
        balance_151 = loanBalance
        stats.total_151 = (parseFloat(stats.total_151) + parseFloat(loanBalance)).toFixed(2)
        stats.count_151++
      }
      stats.total_total = (parseFloat(stats.total_total) + parseFloat(loanBalance)).toFixed(2)
      stats.total_countlate ++
      stats.total_ratelate += loanRate
    }
    else if (loanStatusCode == "A" || loanStatusCode == "M" || loanStatusCode == "F") {
      stats.total_countactive ++
      stats.total_amountactive = (parseFloat(stats.total_amountactive) + parseFloat(loanBalance)).toFixed(2)
      stats.total_rateactive += loanRate
    }
    stats.total_balance = (parseFloat(stats.total_balance) + parseFloat(loanBalance)).toFixed(2)
    stats.total_lastpayment = (parseFloat(stats.total_lastpayment) + parseFloat(row.lastAmount)).toFixed(2)
    stats.total_count ++

    return {
      id                : row.id,
      fullName          : row.fname + ' ' + row.lname,
      loanNumber        : row.loan_number,
      lastAmount        : row.lastAmount,
      loanFundDate      : row.loanFundDate,
      loanNoteDate      : row.loanNoteDate,
      lastPaymentDate   : row.lastDate,
      nextPaymentDate   : row.nextDate,
      daysLate          : row.days,
      loanStatus        : LOAN_STATUS_MAP[loanStatusCode],
      loanStatusCode,
      balance_00,
      balance_31,
      balance_61,
      balance_91,
      balance_121,
      balance_151,
      loanBalance,
    }
  })

  // calculates stats
  if (stats.total_count > 0) {
    stats.percent_active = (stats.total_countactive * 100/ stats.total_count).toFixed(2)
    stats.percent_late = (stats.total_countlate * 100/ stats.total_count).toFixed(2)
  }
  if (stats.total_balance > 0) {
    stats.percent_lateamount = (stats.total_total * 100/ stats.total_balance).toFixed(2)
    stats.percent_activeamount = (stats.total_amountactive * 100/ stats.total_balance).toFixed(2)
  }
  if (stats.total_countactive > 0) {
    stats.average_rateactive = (stats.total_rateactive / stats.total_countactive).toFixed(2)
  }
  if (stats.total_countlate > 0) {
    stats.average_ratelate = (stats.total_ratelate / stats.total_countlate).toFixed(2)
  }

  return {
    applications,
    stats,
  }
}
