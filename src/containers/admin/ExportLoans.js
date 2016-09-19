import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { filterLoansAction } from '../../redux/actions/admin/filterLoans'
import ContentWrapper from '../../themeJsx/Layout/ContentWrapper';
import ExportLoansContent from "../../components/admin/exportLoans/ExportLoansContent";

export default class ExportLoans extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { filterLoans } = this.props
    filterLoans()
  }

  render() {
    const { isFetching, fetchLoansFailed, loans } = this.props;

    return (
      <div>
        <ExportLoansContent isFetching={isFetching}
                            fetchLoansFailed={fetchLoansFailed}
                            loans={loans}
        />
      </div>
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
