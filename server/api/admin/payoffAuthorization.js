import {fetchPayoffAuthQuery} from './database-proxy'
import _debug from 'debug'
import {decrypt} from "../shared/decrypter";

const debug = _debug('app:server:admin:api:payoffAuthorization')

export async function payoffAuthorization(loanId) {
  debug("calling payoffAuthorization " + loanId);

  const rows = await fetchPayoffAuthQuery(loanId)
  if (rows.length == 0) {
    debug(`Error. No application info for loan id ${loanId}`)
    return
  }
  const result = rows[0]

  const borrowerName = `${result.fname} ${result.mi} ${result.lname} ${result.suffix}`
  const bankName = decrypt(result.bank_name.toString())
  const bankAccount = decrypt(result.bank_account.toString())
  const bankRouting = decrypt(result.bank_routing.toString())
  const bankType = result.bank_type == "C" ? "Checking" : "Savings";
  const loanNum = result.loan_number

  return `
  <!DOCTYPE html PUBLIC -//W3C//DTD XHTML 1.0 Transitional//EN http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd>
  <html xmlns=https://www.w3.org/1999/xhtml>
  
  <html>
  <head>
  <meta http-equiv=Content-Type content=text/html; charset=Windows-1252>
  <style type='text/css'>
  @page Section1
  {
		size:8.5in 11.0in;
		margin:.5in .5in .5in .5in;
		mso-header-margin:.5in;
		mso-footer-margin:.5in;
		mso-paper-source:0;
		font-family:Arial;
		font-size:8pt;
		mso-font-charset:0;
		mso-generic-font-family:auto;
  }
  td{
		font-family:Arial;
		font-size:8pt;
		mso-font-charset:0;
		mso-generic-font-family:auto;
  }
  div.Section1
  {
		page:Section1;
  }
  </style>
  </head>
  
  <body>
  <div class='Section1'>
  
  <table border='0' width='100%' style='border:0px; border-collapse:collapse'>
		<tr><td align='center'><font size='2'><b>Authorization for Automatic Electronic Funds Transfer</b></font></td></tr>
		<tr><td align='center'>${borrowerName}</td></tr>
		<tr><td align='center'>Contract #: ${loanNum}</td></tr>
  </table>
  
  <p>In this Authorization, you and your mean the Account Holder(s) who sign this Authorization.  We, us, and our means Kwikcash, Inc. By signing below, you authorize us to make a one-time electronic fund transfer in the form of ACH debit entry from your account identified below, and to electronically credit that amount (when received by us) to the amount due under your loan contract held by us.</p>
  
  <table border='1' width='100%' bgcolor='#000000' cellpadding='5' cellsapcing='5'>
		<tr>
			<td align='left' bgcolor='#FFFFFF'>
  <p>PLEASE COMPLETE THE FOLLOWING INFORMATION:</p>
				<table border='0' width='100%' style='border-collapse:collapse' cellpadding='5' cellspacing='25'>
					<tr>
						<td align='left'><b>Bank Name:</b></td>
						<td align='left'><b><u>&nbsp;&nbsp;${bankName}&nbsp;&nbsp;</u></b></td>
						<td align='left'><b>Account Type:</b></td>
						<td align='left'><b><u>&nbsp;&nbsp;${bankType}&nbsp;&nbsp;</u></b></td>
					</tr>
					<tr>
						<td align='left'></td>
						<td align='left'></td>
						<td align='left'></td>
						<td align='left'></td>
					</tr>
					<tr>
						<td align='left'><b>Routing Number:</b></td>
						<td align='left'><b><u>&nbsp;&nbsp;${bankRouting}&nbsp;&nbsp;</u></b></td>
						<td align='left'><b>Account Number:</b></td>
						<td align='left'><b><u>&nbsp;&nbsp;${bankAccount}&nbsp;&nbsp;</u></b></td>
					</tr>
					<tr>
						<td align='left'></td>
						<td align='left'></td>
						<td align='left'></td>
						<td align='left'></td>
					</tr>
					<tr>
						<td align='left' colspan='2'><b>Name of Primary Account Holder:</b></td>
						<td align='left'><b><u>${borrowerName}</u></b></td>
					</tr>
				</table>
			</td>
		</tr>
  </table>
  
  <p>&nbsp;</p>
  <p>The electronic fund transfer in the form of ACH debit will be made on _______________ in the amount of $ _______________.</p>
  
  <p>&nbsp;</p>
  <p>You understand and agree that this Authorization will remain in effect unless you cancel it by calling us at (800) 478-6230.  We must be notified of cancellation at least three (3) business days prior to the payment due date.  Your rights and obligations with respect to your financial institution (identified above) will be determined by your agreement with your financial Institution.  You request the financial institution that holds the account to honor the debit entries that we initiate.</p>
  
  <p>&nbsp;</p>
  <p><b>You acknowledge that you received a copy of this authorization when you signed it.</b></p>
  
  <p>&nbsp;</p>
  <table border='0' width='100%' style='border-collapse:collapse' cellpadding='5' cellspacing='25'>
		<tr>
			<td align='left' colspan='2'><b>Account Holder</b></td>
			<td align='left' colspan='2'><b>Account Holder</b></td>
		</tr>
		<tr><td colspan='4' height='30'>&nbsp;</td></tr>
		<tr>
			<td align='left'><b>X ______________________________</b></td>
			<td align='left'><b>___________</b></td>
			<td align='left'><b>X ______________________________</b></td>
			<td align='left'><b>___________</b></td>
		</tr>
		<tr>
			<td align='left'><b>${borrowerName}</b></td>
			<td align='left'><b>Date</b></td>
			<td align='left'></td>
			<td align='left'><b>Date</b></td>
		</tr>
  </table>
  
  <p>&nbsp;</p>
  <p><b>Kwikcash, Inc.<br>
  9150 Irvine Center Drive<br>
  Irvine, CA 92618<br>
  800-478-6230<br>
  info@kwikcashonline.com</b></p>
  
  </div>
  </body>
  </html>
  `
}