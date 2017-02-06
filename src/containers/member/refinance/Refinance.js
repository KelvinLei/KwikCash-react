import React, { Component } from 'react'
import { connect } from 'react-redux'
import {selectRefinanceValue, enterRefinanceValue, selectUserRefinanceValue} from '../../../redux/actions/member/memberAction'

import { RefinanceContent } from '../../../components/member/refinance/RefinanceContent'
import {fetchLoanListAction} from "../../../redux/actions/member/fetchLoanList";

class Refinance extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchLoanList } = this.props
    fetchLoanList()
  }

  render() {
    const { loanList,
            refinanceState,
            handleSelectRefinanceValue,
            handleSelectUserRefinanceValue,
            handleEnterUserRefinanceValue
    } = this.props

    const { loanId } = this.props.params

    const refinanceValueOption = refinanceState.refinanceValue
    const userInputRefinanceValue = refinanceState.userInputRefinanceValue.value
    const userInputRadioChecked = refinanceState.userInputRefinanceValue.selected

    const refinanceValueForTable = userInputRadioChecked ? userInputRefinanceValue : refinanceValueOption

    // find the loanData from loanList, get the current balance, and compute a new balance
    // based on selected refinance value
    const loanData = loanList.find( (loan) => loan.loanId == loanId )
    const newBalance = loanData ? refinanceValueForTable - loanData.balance : 0

    return (
      <div>
        <RefinanceContent loanId={loanId}
                          loanData={loanData}
                          refinanceState={refinanceState}
                          refinanceValueForTable={refinanceValueForTable}
                          newBalance={newBalance.toFixed(2)}
                          onClickRefinanceValue={handleSelectRefinanceValue}
                          onClickUserRefinanceValue={handleSelectUserRefinanceValue}
                          onEnterUserFinanceValue={handleEnterUserRefinanceValue}
        />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSelectRefinanceValue: (refinanceValue) => {
      dispatch(selectRefinanceValue(refinanceValue))
    },

    handleSelectUserRefinanceValue: () => {
      dispatch(selectUserRefinanceValue())
    },

    handleEnterUserRefinanceValue: (value) => {
      dispatch(enterRefinanceValue(value))
    },

    fetchLoanList: () => dispatch(fetchLoanListAction()),
  }
}

function mapStateToProps(state) {
  const { loanList, refinanceState } = state

  return {
    refinanceState,
    loanList: loanList.loans
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Refinance)
