import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ContentWrapper from '../../themeJsx/Layout/ContentWrapper';
import { filterLoansAction } from '../../redux/actions/admin/filterLoans'
import { exportLoansAction } from '../../redux/actions/admin/exportLoans'
import ExportLoansTable from "../../components/admin/exportLoans/ExportLoansTable";
import LoanFilterWidget from "../../components/admin/exportLoans/LoanFilterWidget";
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Row, Col, Panel, Table, Grid, Button } from 'react-bootstrap';

class ExportLoans extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { filterLoans } = this.props
    filterLoans({})
  }

  render() {
    const { isFetching,
            fetchLoansFailed,
            loans,
            filterContext,
            isExportLoansFetching,
            exportLoansFailed,
            filterLoans,
            exportLoans } = this.props;


    let exportLoansDisplay
    if (isFetching) {
      exportLoansDisplay = <LoadingSpinner/>
    }
    else if (fetchLoansFailed) {
      exportLoansDisplay = <div>Failure</div>
    }
    else {
      exportLoansDisplay = <ExportLoansTable loans={loans}
                                             filterContext={filterContext}
      />
    }

    return (
      <ContentWrapper>
        <div className="content-heading">
          Export Loans
          <small data-localize="dashboard.WELCOME">Loans filtering & reporting</small>
        </div>

        <Row>
          <Col md={ 12 }>
            <LoanFilterWidget isExportLoansFetching={isExportLoansFetching}
                              exportLoansFailed={exportLoansFailed}
                              filterLoans={filterLoans}
                              exportLoans={exportLoans} />
          </Col>
        </Row>

        { exportLoansDisplay }

      </ContentWrapper>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    filterLoans: (filterContext) => dispatch(filterLoansAction(filterContext)),
    exportLoans: (filterContext) => dispatch(exportLoansAction(filterContext)),
  }
}

function mapStateToProps(state) {
  const { loanListState, exportLoansState } = state

  return {
    isFetching: loanListState.isFetching,
    fetchLoansFailed: loanListState.fetchLoansFailed,
    loans: loanListState.loans,
    filterContext: loanListState.filterContext,

    isExportLoansFetching: exportLoansState.isFetching,
    exportLoansFailed: exportLoansState.fetchLoansFailed,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportLoans)
