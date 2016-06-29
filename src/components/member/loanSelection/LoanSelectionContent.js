import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel } from 'react-bootstrap';
import { Link } from 'react-router';

export default class LoanSelectionContent extends Component {

  render() {
    const { loanList } = this.props;

    const loanListDisplay = loanList.map( loan => {
      const { id, status, currentBalance } = loan

      const nextPaymentDateDisplay = loan.nextPaymentDate || "NONE"

      return (
        <LoanEntry key={id} id={id} status={status} currentBalance={currentBalance} nextPaymentDate={nextPaymentDateDisplay} />
      )
    })

    return (
      <ContentWrapper>
        <div className="content-heading">
          Loan Selection
          <small data-localize="dashboard.WELCOME">Please select a loan</small>
        </div>

        <Row>
          <Col md={ 12 }>
            { /* START List group */ }
            <ul className="list-group">
              {loanListDisplay}
            </ul>
            { /* END List group */ }
          </Col>
        </Row>
      </ContentWrapper>
    )
  }
}

class LoanEntry extends Component {
  render() {
    const { id, status, currentBalance, nextPaymentDate } = this.props

    const className = status === "Complete" ? "label label-success" : "label label-warning"

    const loanSummaryUrl = '/loanSummary/' + id

    return (
      <div className="list-group">
        <Link to={loanSummaryUrl} className="list-group-item">
          <table className="wd-wide">
            <tbody>
            <tr>
              <td className="wd-xs">
                <div className="ph">
                  <div className={className}>{status}</div>
                </div>
              </td>
              <td>
                <div className="ph">
                  <h4 className="media-box-heading">Loan ID: {id}</h4>
                  <small className="text-muted">Click for details</small>
                </div>
              </td>
              <td className="ph">
                <div className="ph">
                  <p className="m0">Current balance</p>
                  <small className="text-muted">${currentBalance}</small>
                </div>
              </td>
              <td className="ph">
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
}