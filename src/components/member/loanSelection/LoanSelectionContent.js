import React from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Alert } from 'react-bootstrap';
import { Link } from 'react-router';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import {getClassNameForLoanStatus} from "../shared/LoanStyles";

export const LoanSelectionContent = ({
  isFetching,
  fetchLoansFailed,
  firstName,
  loanList
}) => {
  // display different components based on the status of getLoanList api call
  let displayContent
  if (isFetching) {
    displayContent = <LoadingSpinner/>
  }
  else if (fetchLoansFailed) {
    displayContent = <FailureWidget/>
  }
  else {
    displayContent = <LoanSelectionWidget loanList={loanList}/>
  }

  return (
    <ContentWrapper>
      <div className="content-heading">
        Loan Selection
        <small data-localize="dashboard.WELCOME">Please select a loan</small>
      </div>

      <Row>
        <Col md={ 12 }>
          <h4>Hello {firstName}</h4>
        </Col>
      </Row>

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
    const { loanId, loanNumber, loanStatus, loanCode, balance, loanRate, loanTerm } = loan
    const nextPaymentDateDisplay = loan.nextPaymentDate || "NONE"
    if (loanCode == "L") {
      hasLatePayment = true
    }

    return (
      <LoanEntry key={loanId}
                 id={loanId}
                 loanNumber={loanNumber}
                 status={loanStatus}
                 statusCode={loanCode}
                 APR={loanRate}
                 currentBalance={balance}
                 nextPaymentDate={nextPaymentDateDisplay}
                 term={loanTerm}
      />
    )
  })

  return (
    <Panel className="panel-default" header="Please select a loan for details">
      {/* shows a warning if there's a late payment */}
      {
        hasLatePayment &&
        <Row>
          <Alert bsStyle="warning">
            <em className="fa fa-exclamation-circle fa-lg fa-fw"/>Your account is currently past due, please contact our office.
          </Alert>
        </Row>
      }

      <Row>
        <Col md={ 12 }>
          { /* START List group */ }
          <ul className="list-group">
            {loanListDisplay}
          </ul>
          { /* END List group */ }
        </Col>
      </Row>
    </Panel>
  )
}

/*
 Renders each loan entry in the loan selection
 */
const LoanEntry = ({id, loanNumber, status, statusCode, currentBalance, APR, nextPaymentDate, term}) => {
  const className = getClassNameForLoanStatus(statusCode)

  const loanSummaryUrl = '/myLoans/loanSummary/' + id

  return (
    <div className="list-group">
      <Link to={loanSummaryUrl} className="list-group-item">
        <table className="wd-wide">
          <tbody>
          <tr>
            <td className="wd-xs">
              <div className="ph">
                <div className={className + " hidden-xs"}> {status} </div>
                <div className={className + " visible-xs"}> {statusCode} </div>
              </div>
            </td>
            <td className="wd-lg">
              <div className="ph">
                <h4 className="media-box-heading hidden-xs">Loan ID: {loanNumber}</h4>
                <h4 className="media-box-heading visible-xs">Loan {loanNumber}</h4>
                <small className="text-muted hidden-xs">Click for details</small>
                <small className="text-muted visible-xs">Click</small>
              </div>
            </td>
            <td className="wd-sm">
              <div className="ph">
                <p className="m0">Balance</p>
                <small className="text-muted">${currentBalance}</small>
              </div>
            </td>
            <td className="wd-xs hidden-xs hidden-sm">
              <div className="ph">
                <p className="m0">Term</p>
                <small className="text-muted">{term} mo</small>
              </div>
            </td>
            <td className="wd-xs hidden-xs hidden-sm">
              <div className="ph">
                <p className="m0">APR</p>
                <small className="text-muted">{APR}%</small>
              </div>
            </td>
            <td className="wd-xs">
              <div className="ph">
                <p className="m0">Next payment</p>
                <small className="text-muted">{nextPaymentDate}</small>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </Link>
    </div>
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