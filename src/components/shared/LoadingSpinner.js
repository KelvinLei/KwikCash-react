import React from 'react';
import { Panel } from 'react-bootstrap';
require('./spinner.scss')

export const LoadingSpinner = () => (
  <Panel header="Loading" className="loader-demo">
    <div className="ball-spin-fade-loader">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </Panel>
)