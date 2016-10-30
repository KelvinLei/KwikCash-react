import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Row, Col, Panel, Button, Alert } from 'react-bootstrap';
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';

import { withRouter } from 'react-router';
import { FailureWidget } from '../../../components/shared/FailureWidget'

class ReapplyResults extends Component {

  render() {
    const { success } = this.props.params

    let headerText, panelClass, bodyText
    if (success == 1) {
      headerText = "Congratulations"
      panelClass = "panel-success"
      bodyText = "We received your application and a KwikCash representative will contact you directly or via email shortly."
    }
    else {
      headerText = "Sorry - system error"
      panelClass = "panel-danger"
      bodyText = "Your re-apply request did not get submitted due to system error. Please contact our office at 1-800-478-6230 to re-apply. Thank you!"
    }
    return (
      <ContentWrapper>
        <div className="content-heading">
          { headerText }
        </div>

        <Panel className={panelClass} header="Thank you for applying!">
          { bodyText }
        </Panel>
      </ContentWrapper>
    )
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     fetchLastApplication: () => dispatch(fetchLastAppAction()),
//
//     submitReapply: (reapplyInput) => dispatch(submitReapplyAction(reapplyInput)),
//   }
// }
//
// function mapStateToProps(state) {
//   const { reapplyState } = state
//
//   return {
//     reapplyState,
//   }
// }

export default connect(
  // mapStateToProps,
  // mapDispatchToProps
)(ReapplyResults)
