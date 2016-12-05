import { runParameterizedQuery } from './database-proxy'
import _debug from 'debug'
import {decrypt} from "../shared/decrypter";

const debug = _debug('app:server:admin:api:fetchLoanStats')

export async function fetchLoanStats(dateRange) {
  debug(`calling fetchLoanStats for date range ${dateRange}`);

  const query = `
    SELECT
        IFNULL(COUNT(ID), 0) as application_count,
        IFNULL(payment_principal - recovery_amount, 0) as adjusted_principal_amount,
        recovery_chargeOff_payments_loans.*
    FROM
        e_applications
    JOIN (
        SELECT
            IFNULL(COUNT(loanpayment_loan), 0) as recovery_count,
            IFNULL(SUM(loanpayment_amount), 0) as recovery_amount,
            chargeOff_payments_loans.*
        FROM (
            SELECT 
                IFNULL(COUNT(pp.loanpayment_loan), 0) as default_count,
                IFNULL(SUM(pp.loanpayment_amount), 0) as default_amount,
                payment_loans.*
            FROM tbl_loanpayments as pp
            JOIN (
                SELECT 
                    IFNULL(COUNT(p.loanpayment_id), 0) AS payment_count,
                    IFNULL(SUM(p.loanpayment_amount), 0) AS payment_amount,
                    IFNULL(SUM(p.loanpayment_interest), 0) AS payment_interest,
                    IFNULL(SUM(p.loanpayment_principal), 0) AS payment_principal,
                    loans.*
                FROM 
                    tbl_loanpayments as p JOIN tbl_loans as l ON p.loanpayment_loan = l.loan_id
                JOIN (
                    SELECT
                        MONTH(loan_notedate) AS loan_month,
                        YEAR(loan_notedate) AS loan_year,
                        IFNULL(COUNT(loan_id), 0) AS loan_count,
                        IFNULL(SUM(loan_amount), 0) AS loan_total,
                        IFNULL(SUM(loan_fundamount), 0) AS loan_fundtotal
                    FROM 
                        tbl_loans
                    WHERE loan_notedate >= DATE_FORMAT(DATE_SUB(NOW(),INTERVAL ? YEAR), '%Y-%m-01')
                    GROUP BY loan_year, loan_month
                ) as loans 
                ON MONTH(p.loanpayment_date) = loans.loan_month AND YEAR(p.loanpayment_date) = loans.loan_year
                AND p.loanpayment_amount <> 0
                AND p.loanpayment_scheduled <> 'C'
                AND (p.loanpayment_principal <> 0 OR p.loanpayment_interest <> 0)
                GROUP BY loan_year, loan_month
            ) as payment_loans
            ON MONTH(pp.loanpayment_date) = payment_loans.loan_month AND YEAR(pp.loanpayment_date) = payment_loans.loan_year
            AND pp.loanpayment_scheduled = 'C'
            GROUP BY payment_loans.loan_year, payment_loans.loan_month
        ) as chargeOff_payments_loans
        LEFT JOIN
            tbl_loanpayments as ppp JOIN tbl_loans as ll ON ppp.loanpayment_loan = ll.loan_id
        ON MONTH(ppp.loanpayment_date) = chargeOff_payments_loans.loan_month 
        AND YEAR(ppp.loanpayment_date) = chargeOff_payments_loans.loan_year
        AND ppp.loanpayment_scheduled = 'R'
        GROUP BY chargeOff_payments_loans.loan_year, chargeOff_payments_loans.loan_month
    ) AS recovery_chargeOff_payments_loans
    ON MONTH(time) = recovery_chargeOff_payments_loans.loan_month 
    AND YEAR(time) = recovery_chargeOff_payments_loans.loan_year
    GROUP BY recovery_chargeOff_payments_loans.loan_year, recovery_chargeOff_payments_loans.loan_month
    ORDER BY recovery_chargeOff_payments_loans.loan_year DESC, recovery_chargeOff_payments_loans.loan_month DESC

  `

  const rows = await runParameterizedQuery({
    actionName      : 'fetchLoanStats',
    paramValueList  : [dateRange],
    query,
  })

  return rows.map( (row) => {
    return {
      year              : row.loan_year,
      month             : row.loan_month,
      loanCount         : numberWithCommas(row.loan_count),
      loanAmount        : numberWithCommas(row.loan_total.toFixed(2)),
      clientFunded      : numberWithCommas(row.loan_fundtotal.toFixed(2)),
      paymentCount      : numberWithCommas(row.payment_count),
      paymentAmount     : numberWithCommas(row.payment_amount.toFixed(2)),
      principal         : numberWithCommas(row.adjusted_principal_amount.toFixed(2)),
      interest          : numberWithCommas(row.payment_interest.toFixed(2)),
      chargeOffCount    : numberWithCommas(row.default_count),
      chargeOffAmount   : numberWithCommas(row.default_amount.toFixed(2)),
      recoveryCount     : row.recovery_count,
      recoveryAmount    : numberWithCommas(row.recovery_amount.toFixed(2)),
      applicationCount  : numberWithCommas(row.application_count),
    }
  })
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}