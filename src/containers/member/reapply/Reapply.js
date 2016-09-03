import React from 'react';
import {sendCounterMetrics, METRICS_NAME_REAPPLY_BTN_COUNT} from "../../../api/index";

export default class Reapply extends React.Component {

  componentWillMount() {
    sendCounterMetrics(METRICS_NAME_REAPPLY_BTN_COUNT, [])
    window.location = "https://www.kwikcashonline.com/members/memberReApply.php"
  }

  // intentionally blank
  render() {
    return null
  }
};

