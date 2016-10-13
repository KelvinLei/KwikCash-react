import Pikaday from 'pikaday/pikaday.js'

export default () => {

  new Pikaday({
    field: document.getElementById('input-loanFundDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('input-firstPaymentDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('input-loanNoteDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('input-defaultDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('input-lateDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('input-manualDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('input-recoveryDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('input-recoveryEndDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('input-refiDate'),
    maxDate: new Date()
  })
}
