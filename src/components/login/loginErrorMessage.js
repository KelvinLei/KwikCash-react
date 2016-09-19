import React from 'react'

export default (props) => (
  <ul class="parsley-errors-list filled" id="kc-incorrect-cred">
    <li class="parsley-type">
      Your {props.isAdmin ? 'username' : 'email'} or password was incorrect. Please try again.
    </li>
  </ul>
);

