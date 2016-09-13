import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ContentWrapper from '../../themeJsx/Layout/ContentWrapper';
import ExportLoansContent from "../../components/admin/exportLoans/ExportLoansContent";

export default class ExportLoans extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <ExportLoansContent/>
      </div>
    )
  }
}

// ExportLoans.propTypes = {
// }
//
//
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(ExportLoans)
