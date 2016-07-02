import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel } from 'react-bootstrap';
import { Link } from 'react-router';

export default class LoanSelectionContent extends Component {

  render() {
    const { loanList } = this.props;

    const loanListDisplay = loanList.map( loan => {
      const { id, status, currentBalance, APR } = loan

      const nextPaymentDateDisplay = loan.nextPaymentDate || "NONE"

      return (
        <LoanEntry key={id}
                   id={id}
                   status={status}
                   APR={APR}
                   currentBalance={currentBalance}
                   nextPaymentDate={nextPaymentDateDisplay}
        />
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
            <h4>Hello John</h4>
          </Col>
        </Row>

        <Panel className="panel-default" header="Please select a loan for details">
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
      </ContentWrapper>
    )
  }
}

const LoanEntry = ({id, status, currentBalance, APR, nextPaymentDate}) => {
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
                <div className={className + " hidden-xs"}> {status} </div>
                <div className={className + " visible-xs"}> {status[0]} </div>
              </div>
            </td>
            <td className="wd-lg">
              <div className="ph">
                <h4 className="media-box-heading hidden-xs">Loan ID: {id}</h4>
                <h4 className="media-box-heading visible-xs">Loan {id}</h4>
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