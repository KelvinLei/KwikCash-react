import { fetchMembersQuery } from './database-proxy'
import _debug from 'debug'

const debug = _debug('app:server:admin:api:fetchMembers')

export async function fetchMembers(memberName) {
  debug("calling admin fetch members for name " + memberName);

  var rows = await fetchMembersQuery(memberName)
  
  const memberListResult = rows.map( (row) => {
    return {
      memberId    : row.member_id,
      memberName  : row.member_name,
      memberEmail : row.member_email,
    }
  })

  return memberListResult
}