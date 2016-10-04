import React from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Alert, ButtonGroup, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import {getClassNameForLoanStatus} from "../../member/shared/LoanStyles";

export const MemberLoansContent = ({
  isFetching,
  isFetchFailed,
  memberLoans,
}) => {
  // display different components based on the status of getLoanList api call
  let displayContent
  if (isFetching) {
    displayContent = <LoadingSpinner/>
  }
  else if (isFetchFailed) {
    displayContent = <FailureWidget/>
  }
  else {
    displayContent = <LoanSelectionWidget loanList={memberLoans}/>
  }

  return (
    <ContentWrapper>
      <div className="content-heading">
        Loan Selection
        <small data-localize="dashboard.WELCOME">Loan editing</small>
      </div>

      { displayContent }

    </ContentWrapper>
  )
}


/*
 Renders the loan selection widget if loan list data is available
 */
const LoanSelectionWidget = ({loanList}) => {
  let hasLatePayment = false
  const loanListDisplay = loanList.map( loan => {
    return (
      <LoanEntry key={loan.loanId} loan={loan} />
    )
  })

  return (
    <Panel className="panel-default" header="Member's loans">
      <Row>
        <Col md={ 12 }>
          <Table responsive striped hover>
            <thead>
            <tr>
              <th>LoanNum</th>
              <th>LoanStatus</th>
              <th>FundDate</th>
              <th>LoanAmount</th>
              <th>Balance</th>
              <th>Term</th>
              <th>Interest</th>
              <th>NextPayDate</th>
              <th>Options</th>
            </tr>
            </thead>
            <tbody>
            { loanListDisplay }
            </tbody>
          </Table>
        </Col>
      </Row>
    </Panel>
  )
}

/*
 Renders each loan entry in the loan selection
 */
const LoanEntry = ({loan}) => {
  const className = getClassNameForLoanStatus(loan.loanCode)

  const loanOverviewUrl = '/admin/members/loanSummary/' + loan.loanId
  const loanEditUrl = '/admin/members/loanEdit/' + loan.loanId
  const payoffUrl = '/admin/members/payoff/' + loan.loanId

  return (
    <tr>
      <td className="wd-xs">
        {loan.loanNumber}
      </td>
      <td className="wd-xs">
        <div className={className}>{loan.loanStatus}</div>
      </td>
      <td className="wd-xs">
        {loan.loanFundDate}
      </td>
      <td className="wd-xs">
        ${loan.loanFundAmount}
      </td>
      <td className="wd-xs">
        ${loan.balance}
      </td>
      <td className="wd-xs">
        {loan.loanTerm} mo
      </td>
      <td className="wd-xs">
        {loan.loanRate}%
      </td>
      <td className="wd-xs">
        { loan.nextPaymentDate || "NONE" }
      </td>
      <td className="">
        <Link to={loanOverviewUrl} >
          <Button bsClass="btn btn-oval btn-primary">Summary</Button>
        </Link>
        <Link to={loanEditUrl} >
          <Button bsClass="btn btn-oval btn-info">Edit</Button>
        </Link>
        <Link to={payoffUrl} >
          <Button bsClass="btn btn-oval btn-success">Payoff</Button>
        </Link>
      </td>
    </tr>
  )
}

/*
 Renders error messagings
 */
const FailureWidget = () => (
  <Panel className="panel-default" header="Error">
    <Row>
      <Col md={ 12 }>
        Sorry, we failed to retrieve your data. Please try again or contact us.
      </Col>
    </Row>
  </Panel>
)