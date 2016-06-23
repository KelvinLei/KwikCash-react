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
            refinanceValue,
            userInputRefinanceValue,
            handleSelectRefinanceValue,
            handleSelectUserRefinanceValue,
            handleEnterUserRefinanceValue
    } = this.props

    const newBalance = refinanceValue - currentBalance

    return (
      <div>
        <RefinanceContent currentBalance={currentBalance}
                          refinanceValue={refinanceValue}
                          newBalance={newBalance}
                          userInputRefinanceValue={userInputRefinanceValue}
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
  refinanceValue: PropTypes.number.isRequired,
  userInputRefinanceValue: PropTypes.object.isRequired,
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
  const refinanceValue = state.refinanceValue || 5000
  const userInputRefinanceValue = state.userInputRefinanceValue

  return {
    currentBalance,
    refinanceValue,
    userInputRefinanceValue
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Refinance)
