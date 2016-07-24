import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {selectRefinanceValue, enterRefinanceValue, selectUserRefinanceValue} from '../../../redux/actions/member/memberAction'

import { RefinanceContent } from '../../../components/member/refinance/RefinanceContent'

class Refinance extends Component {

  constructor(props) {
    super(props)
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
    const newBalance = refinanceValueForTable - loanData.balance

    return (
      <div>
        <RefinanceContent loanId={loanId}
                          currentBalance={loanData.balance}
                          refinanceState={refinanceState}
                          refinanceValueForTable={refinanceValueForTable}
                          newBalance={newBalance}
                          onClickRefinanceValue={handleSelectRefinanceValue}
                          onClickUserRefinanceValue={handleSelectUserRefinanceValue}
                          onEnterUserFinanceValue={handleEnterUserRefinanceValue}
        />
      </div>
    )
  }
}

Refinance.propTypes = {
  loanList: PropTypes.array.isRequired,
  refinanceState: PropTypes.object.isRequired,
  handleSelectRefinanceValue: PropTypes.func.isRequired,
  handleSelectUserRefinanceValue: PropTypes.func.isRequired,
  handleEnterUserRefinanceValue: PropTypes.func.isRequired
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
    }
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
