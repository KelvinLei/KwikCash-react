import Pikaday from 'pikaday/pikaday.js'

export default () => {
  new Pikaday({
    field: document.getElementById('input-paymentDate'),
    maxDate: new Date(2025, 12, 31)
  })
}
