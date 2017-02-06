import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { FailureWidget } from '../../../components/shared/FailureWidget'
import ReapplyContent from '../../../components/member/reapply/ReapplyContent'
import { fetchLastAppAction } from "../../../redux/actions/member/fetchLastApplication";
import {submitReapplyAction} from "../../../redux/actions/member/submitReapply";

class Reapply extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchLastApplication } = this.props
    fetchLastApplication()
  }

  render() {
    const { reapplyState, submitReapply } = this.props
    const {
      isFetching,
      isFetchFailed, } = reapplyState

    let displayContent
    if (isFetching) {
      displayContent = <LoadingSpinner/>
    }
    else if (isFetchFailed) {
      displayContent = <FailureWidget/>
    }
    else {
      displayContent = <ReapplyContent reapplyState={reapplyState}
                                       submitReapply={submitReapply}
      />
    }

    return (
      <div>
        { displayContent }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLastApplication: () => dispatch(fetchLastAppAction()),

    submitReapply: (reapplyInput) => dispatch(submitReapplyAction(reapplyInput)),
  }
}

function mapStateToProps(state) {
  const { reapplyState } = state

  return {
    reapplyState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reapply)
