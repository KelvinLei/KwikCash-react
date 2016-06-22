import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {selectRefinanceValue} from '../../../redux/actions/member/memberAction'

import RefinanceContent from '../../../components/member/refinance/RefinanceContent'

class Refinance extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {currentBalance, refinanceValue, handleSelectRefinanceValue} = this.props
    
    const newBalance = refinanceValue - currentBalance
    
    return (
      <div>
        <RefinanceContent currentBalance={currentBalance} 
                          refinanceValue={refinanceValue} 
                          newBalance={newBalance} 
                          onClickRefinanceValue={handleSelectRefinanceValue}
        />
      </div>
    )
  }
}

Refinance.propTypes = {
  currentBalance: PropTypes.string.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSelectRefinanceValue: (refinanceValue) => {
      dispatch(selectRefinanceValue(refinanceValue))
    }
  }
}

function mapStateToProps(state) {
  const currentBalance = "3000.00" // state.currentBalance || "unknown"
  const refinanceValue = state.refinanceValue || "5000.00"

  return {
    currentBalance,
    refinanceValue
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Refinance)
