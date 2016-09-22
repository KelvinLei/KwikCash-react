import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ContentWrapper from '../../themeJsx/Layout/ContentWrapper';
import { filterLoansAction } from '../../redux/actions/admin/filterLoans'
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
    const { isFetching, fetchLoansFailed, loans, filterContext, filterLoans } = this.props;


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
            <LoanFilterWidget filterLoans={filterLoans} />
          </Col>
        </Row>

        { exportLoansDisplay }

      </ContentWrapper>
    )
  }
}

ExportLoans.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  fetchLoansFailed: PropTypes.bool.isRequired,
  loans: PropTypes.array.isRequired,
  filterLoans: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => {
  return {
    filterLoans: (filterContext) => dispatch(filterLoansAction(filterContext)),
  }
}

function mapStateToProps(state) {
  const { loanList } = state

  return {
    isFetching: loanList.isFetching,
    fetchLoansFailed: loanList.fetchLoansFailed,
    loans: loanList.loans,
    filterContext: loanList.filterContext,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportLoans)
