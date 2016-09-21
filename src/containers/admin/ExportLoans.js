import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ContentWrapper from '../../themeJsx/Layout/ContentWrapper';
import { filterLoansAction } from '../../redux/actions/admin/filterLoans'
import ExportLoansTable from "../../components/admin/exportLoans/ExportLoansTable";
import { LoanFilterWidget } from "../../components/admin/exportLoans/LoanFilterWidget";
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Row, Col, Panel, Table, Grid, Button } from 'react-bootstrap';

class ExportLoans extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { filterLoans } = this.props
    filterLoans()
  }

  render() {
    const { isFetching, fetchLoansFailed, loans, filterLoans } = this.props;

    const limit = Math.floor(Math.random() * 3) + 1
    
    let exportLoansDisplay
    if (isFetching) {
      exportLoansDisplay = <LoadingSpinner/>
    }
    else if (fetchLoansFailed) {
      exportLoansDisplay = <div>Failure</div>
    }
    else {
      exportLoansDisplay = <ExportLoansTable isFetching={isFetching}
                                             fetchLoansFailed={fetchLoansFailed}
                                             loans={loans}
                                             filterLoans={filterLoans}
                                             limit={limit}
      />
    }

    return (
      <ContentWrapper>
        <div className="content-heading">
          Export Loans
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
    filterLoans: () => dispatch(filterLoansAction()),
  }
}

function mapStateToProps(state) {
  const { loanList } = state

  return {
    isFetching: loanList.isFetching,
    fetchLoansFailed: loanList.fetchLoansFailed,
    loans: loanList.loans,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportLoans)
