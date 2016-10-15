import Pikaday from 'pikaday/pikaday.js'

export default () => {

  new Pikaday({
    field: document.getElementById('input-loanFundDate'),
    maxDate: new Date(2025, 12, 31)
  })

  new Pikaday({
    field: document.getElementById('input-firstPaymentDate'),
    maxDate: new Date(2025, 12, 31)
  })

  new Pikaday({
    field: document.getElementById('input-loanNoteDate'),
    maxDate: new Date(2025, 12, 31)
  })

  new Pikaday({
    field: document.getElementById('input-defaultDate'),
    maxDate: new Date(2025, 12, 31)
  })  
  
  new Pikaday({
    field: document.getElementById('input-payoffDate'),
    maxDate: new Date(2025, 12, 31)
  })

  new Pikaday({
    field: document.getElementById('input-lateDate'),
    maxDate: new Date(2025, 12, 31)
  })

  new Pikaday({
    field: document.getElementById('input-manualDate'),
    maxDate: new Date(2025, 12, 31)
  })

  new Pikaday({
    field: document.getElementById('input-recoveryDate'),
    maxDate: new Date(2025, 12, 31)
  })

  new Pikaday({
    field: document.getElementById('input-recoveryEndDate'),
    maxDate: new Date(2025, 12, 31)
  })

  new Pikaday({
    field: document.getElementById('input-refiDate'),
    maxDate: new Date(2025, 12, 31)
  })
}
