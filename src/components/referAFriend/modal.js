import { sendReferalRequest } from '../../api/memberApiClient'

require("sweetalert/dist/sweetalert.min")
require("sweetalert/dist/sweetalert.css")

export function showReferAFriendModal(e) {
  e.preventDefault();
  swal({
    title: "Refer a friend",
    text: "Refer a friend and receive a 100 dollar Visa gift card! To get started, enter your friend's name",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "Name:" },
    (inputName) => {
      if (!inputName || inputName.length <= 2) {
        swal.showInputError("Please enter a valid name");
        return false
      }
      swal({
        title: "Refer a friend",
        text: "Enter your friend's email address",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Email Address:" },
        (inputEmail) => {
          if (!inputEmail || inputEmail.length <= 2) {
            swal.showInputError("Please enter a valid email address");
            return false
          }
          sendReferalRequest(inputEmail, inputName).then(() => {
            swal("Got it!",
              `We will reach out to ${inputName}. Once they have signed up for a loan, we will send you a $100 dollar Visa Gift Card.`,
              "success");
          }).catch(() => {
              swal("Oops...", "Please enter a valid email address.", "error");
          })

        }
      );

    }
  );
}
