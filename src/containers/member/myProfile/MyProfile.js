import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { MyProfileContent } from '../../../components/member/myProfile/MyProfileContent'

export default class MyProfile extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    // const { loanList } = this.props;

    const loanList = [
      {"id": 1234, "status": "Active", "currentBalance": 3000.00, "APR": "4.00", "nextPaymentDate": "06/01/2016"},
      {"id": 5342, "status": "Active", "currentBalance": 4000.00, "APR": "5.00", "nextPaymentDate": "06/15/2016"},
      {"id": 1534, "status": "Complete", "currentBalance": 0, "APR": "6.00", "nextPaymentDate": ""}
    ]

    const activeLoansCount = 2

    const completeLoansCount = 1

    const name = "John Smith"

    const address = "1111 Pacifica Irvine, CA 92614"

    const phone = "9491245123"
    
    const email = "sample.email@email.com"

    return (
      <div>
        <MyProfileContent activeLoansCount={activeLoansCount}
                          completeLoansCount={completeLoansCount}
                          name={name}
                          address={address}
                          phone={phone}
                          email={email}
        />
      </div>
    )
  }
}