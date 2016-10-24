import React from 'react'
import { Grid, Row, Col, Panel, Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router';

export const PaymentTableAdmin = ({
  paymentLevelData,
  deletePaymentState,
  waivePaymentState,
  waivePayment,
  deletePayment,
}) => {
  const paymentListContent = paymentLevelData.payments.map((payment, index) => {
    return (
      <PaymentPlanRow key={payment.id}
                      index={index + 1}
                      loanId={paymentLevelData.loanId}
                      payment={payment}
                      deletePaymentState={deletePaymentState}
                      waivePaymentState={waivePaymentState}
                      waivePayment={waivePayment}
                      deletePayment={deletePayment}
      />
    )
  })

  return (
    <Panel className="panel-default" header="Payments Schedule">
      <Grid fluid>
        <Row>
          <Col md={12}>
            { /* payment table */ }
            <Row>
              <Table id="paymentPlantTable" responsive striped hover>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Due</th>
                  <th>Paid</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Scheduled</th>
                  <th>PaymentSchedule</th>
                  <th>ExtraAmount</th>
                  <th>Options</th>
                </tr>
                </thead>

                <tbody>
                { paymentListContent }
                </tbody>
              </Table>
            </Row>
          </Col>
        </Row>
      </Grid>
    </Panel>
  )
}

const PaymentPlanRow = ({
  index,
  payment,
  loanId,
  deletePaymentState,
  deletePayment,
  waivePaymentState,
  waivePayment,
}) => {
  const { id,
          isPaid,
          paymentDate,
          amountDue,
          amountPaid,
          scheduled,
          principal,
          paymentSchedule,
          extraAmount,
          interest } = payment

  const status = isPaid ? 'Complete' : 'Pending'
  var className = status === "Complete" ? "label label-success" : "label label-warning"

  const deleteOnclick = () => {
    deletePayment(id, loanId)
  }
  const deleteButtonDisabled = id == deletePaymentState.paymentId && deletePaymentState.isFetching

  const waiveOnclick = () => {
    waivePayment(id, loanId)
  }
  const waiveButtonDisabled = id == waivePaymentState.paymentId && waivePaymentState.isFetching

  let failedAction
  if (id == waivePaymentState.paymentId && waivePaymentState.isFailed)
    failedAction = 'waive'
  else if (id == deletePaymentState.paymentId && deletePaymentState.isFailed)
    failedAction = 'delete'

  return (
    <tr>
      <td>{index}</td>
      <td>
        <div className={className}>{status}</div>
      </td>
      <td>{paymentDate}</td>
      <td>{'$' + amountDue}</td>
      <td>{'$' + amountPaid}</td>
      <td>{'$' + principal}</td>
      <td>{'$' + interest}</td>
      <td>{scheduled}</td>
      <td>{paymentSchedule}</td>
      <td>{'$' + extraAmount}</td>
      <td>
        <Link to={"/admin/members/paymentEdit/" + id} className="btn btn-oval btn-info">Edit</Link>

        <Button onClick={waiveOnclick.bind(this)}
                bsClass="btn btn-oval btn-success"
                disabled={waiveButtonDisabled}>
          Waive
        </Button>
        <Button onClick={deleteOnclick.bind(this)}
                bsClass="btn btn-oval btn-danger"
                disabled={deleteButtonDisabled}>
          Delete
        </Button>
        {
          failedAction &&
          <div>Failed to {failedAction}</div>
        }
      </td>
    </tr>
  )
}