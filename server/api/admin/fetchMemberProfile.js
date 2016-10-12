import { fetchMemberProfileQuery } from './database-proxy'
import _debug from 'debug'
import {decrypt} from "../shared/decrypter";

const debug = _debug('app:server:admin:api:fetchMemberProfile')

export async function fetchMemberProfile(memberId) {
  debug("calling fetchMemberProfile for id " + memberId);

  const rows = await fetchMemberProfileQuery(memberId)
  if (rows.length == 0) {
    return
  }

  return {
    memberId      : rows[0].member_id,
    memberName    : rows[0].member_name,
    memberEmail   : rows[0].member_email,
    memberSsn     : decrypt(rows[0].member_ssn.toString()),
  }
}