import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {selectRefinanceValue, enterRefinanceValue, selectUserRefinanceValue} from '../../../redux/actions/member/memberAction'

import RefinanceContent from '../../../components/member/refinance/RefinanceContent'

class Refinance extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { currentBalance,
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

    const newBalance = refinanceValueForTable - currentBalance

    return (
      <div>
        <RefinanceContent loandId={loanId}
                          currentBalance={currentBalance}
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
  currentBalance: PropTypes.string.isRequired,
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
  const currentBalance = "3000.00" // state.currentBalance || "unknown"
  const refinanceState = state.refinanceState

  return {
    currentBalance,
    refinanceState
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Refinance)
