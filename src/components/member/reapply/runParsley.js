export default () => {

  $('form[data-parsley-validate]').parsley();

  // window.Parsley.addValidator('confirmPassword', {
  //   validateString: function(value, user) {
  //     return false
  //   },
  //   messages: {
  //     en: 'This string is not the reverse of itself',
  //     fr: "Cette valeur n'est pas l'inverse d'elle même."
  //   }
  // });
}
