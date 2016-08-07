import { sendReferalRequest } from '../../api'

require("sweetalert/dist/sweetalert.min")
require("sweetalert/dist/sweetalert.css")

export function showReferAFriendModal(e) {
  e.preventDefault();
  swal({
    title: "Refer a friend",
    text: "Refer a friend and receive a 100 dollar Visa gift card! To get started, enter your friend's email address",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "Email Address:" },
    (inputValue) => {
      if (!inputValue) {
        swal.showInputError("Please enter a valid email address!");
        return false
      }
      sendReferalRequest(inputValue).then(() => {
        swal("Got it!",
          `We will reach out to ${inputValue}. Once they have signed up for a loan, we will send you a $100 dollar Visa Gift Card.`,
          "success");
      }).catch(() => {
          swal("Oops...", "Please enter a valid email address.", "error");
      })

    }
  );
}
