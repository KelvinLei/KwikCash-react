import Pikaday from 'pikaday/pikaday.js'

export default () => {

  new Pikaday({
    field: document.getElementById('inputloanFundDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('inputfirstPaymentDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('inputloanNoteDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('inputdefaultDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('inputlateDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('inputmanualDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('inputrecoveryDate'),
    maxDate: new Date()
  })

  new Pikaday({
    field: document.getElementById('inputrecoveryEndDate'),
    maxDate: new Date()
  })
}
