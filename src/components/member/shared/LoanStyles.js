export const getClassNameForLoanStatus = (loanCode) => {
  let className
  switch (loanCode) {
    case "A":
    case "M":
    case "F":
      className = "label label-info"
      break;
    case "P":
      className = "label label-success"
      break;
    default:
      className = "label label-danger"
  }
  return className
}