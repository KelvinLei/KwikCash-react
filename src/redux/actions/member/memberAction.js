export const SELECT_PAYMENT_STATUS = 'SELECT_PAYMENT_STATUS'
export const SELECT_MEMBER_PAGE = 'SELECT_MEMBER_PAGE'

export const selectPaymentStatus = (status) => {
  return {
    type: SELECT_PAYMENT_STATUS,
    selectedStatus: status
  }
}

export const selectMemberPage = (page) => {
  return {
    type: SELECT_MEMBER_PAGE,
    selectedStatus: page
  }
}