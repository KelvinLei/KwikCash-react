import { runParameterizedQuery } from './database-proxy'
import _debug from 'debug'
import {decrypt} from "../shared/decrypter";
import {authenticateUserById} from "./authenticate";
import {encrypt} from "../shared/decrypter";
import {salted_hash, salted_compare} from "../shared/password";
import {sendReapplyEmail} from "../shared/email-proxy";

const debug = _debug('app:server:api:submitReapply')

export async function submitReapply({
  user, reapplyInput
}) {

  const firstName = reapplyInput.firstName
  const middleInitial = reapplyInput.middleInitial
  const lastName = reapplyInput.lastName
  const loanAmount = reapplyInput.loanAmount

  const encryptedHomePhone = encrypt(reapplyInput.homePhoneNumber)
  const encryptedMobilePhone = encrypt(reapplyInput.mobilePhoneNumber)

  const query = `
      INSERT INTO e_applications (
      active, agent, fname, mi, lname, suffix, hphone, mphone, wphone, wphoneext, email,
			birthdate, licnumber, licstate, licdate, hstnum, hstname, haptnum, hcity, hstate, hzip,
			moved, pstnum, pstname, paptnum, pcity, pstate, pzip, pmovdate, ssn, selfemployed, cname,
			ctitle, emptype, cphone, cphoneext, cstnum, cstname, cstenum, ccity, cstate, czip, clenyear,
			clenmon, pdaytype, pday1, pday2, plastdate, mgross, msupp, rent, mrent, mortgageco, fixedoradj,
			military, whyapply, referrer, r1name, r1pnum, r2name, r2pnum, relname, relpnum, vpledge, emp3,
			precompname, precompadd, precompphone, cname2prev, ctitle2prev, emptype2prev, cphone2prev,
			cphoneext2prev, cstnum2prev, cstname2prev, cstenum2prev, ccity2prev, cstate2prev, czip2prev,
			clenyear2prev, clenmon2prev, referral, ddp, ccc, payment_schedule, bank_name, bank_routing,
			bank_account, bank_type, application_member, coborrower, loan_amount, loan_term, loan_rate )
			
			SELECT 
			active, agent, ?, ?, ?, suffix, ?, ?, wphone, wphoneext, email,
			birthdate, licnumber, licstate, licdate, hstnum, hstname, haptnum, hcity, hstate, hzip,
			moved, pstnum, pstname, paptnum, pcity, pstate, pzip, pmovdate, ssn, selfemployed, cname,
			ctitle, emptype, cphone, cphoneext, cstnum, cstname, cstenum, ccity, cstate, czip, clenyear,
			clenmon, pdaytype, pday1, pday2, plastdate, mgross, msupp, rent, mrent, mortgageco, fixedoradj,
			military, whyapply, referrer, r1name, r1pnum, r2name, r2pnum, relname, relpnum, vpledge, emp3,
			precompname, precompadd, precompphone, cname2prev, ctitle2prev, emptype2prev, cphone2prev,
			cphoneext2prev, cstnum2prev, cstname2prev, cstenum2prev, ccity2prev, cstate2prev, czip2prev,
			clenyear2prev, clenmon2prev, referral, ddp, ccc, payment_schedule, bank_name, bank_routing,
			bank_account, bank_type, application_member, coborrower, ?, loan_term, loan_rate
			FROM e_applications
      WHERE e_applications.application_member = ?
      ORDER BY time DESC
      LIMIT 1
  `

  const result = await runParameterizedQuery({
    actionName      : 'fetchLastApplication',
    paramValueList  : [firstName, middleInitial, lastName, encryptedHomePhone, encryptedMobilePhone, loanAmount, user.id],
    query,
  })
// debug(`result ${JSON.stringify(result)}`)
  await sendReapplyEmail({
    user,
    applicationId: result.insertId
  });

  return ""
}

