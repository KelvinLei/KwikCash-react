import { getLoanList } from './database-proxy'
import _debug from 'debug'
import { LOAN_STATUS_MAP } from '../shared/loansConstants'

const debug = _debug('app:server:admin:api:filterLoans')

`
SELECT
COUNT(*) as remainingPaymentsCount, SUM(p.loanpayment_principal) as remainingBalance, MIN(p.loanpayment_date) as nextPaymentDate, loan_result.*
FROM tbl_loanpayments p
INNER JOIN
(
SELECT 
	distinct e.fname, e.lname, e.hstate, l.loan_id, l.loan_number, l.loan_funddate, l.loan_rate, l.loan_amount, l.loan_notedate, l.loan_status
FROM 
	e_applications e,
	tbl_loans l
WHERE e.application_member = l.loan_member AND l.loan_member = 384
ORDER BY l.loan_funddate DESC
LIMIT 10
) AS loan_result
ON loan_result.loan_id = p.loanpayment_loan AND p.loanpayment_amount < p.loanpayment_due
GROUP BY p.loanpayment_loan

`