// Google project number - 104707683579
// google project number is needed while adding push notification token


// app test credentials
// username - rick.lassin@gmail.com
  // pass - test123!

//var PATH = 'https://noochme.com/landlords/db/api/';
var PATH = 'http://www.nooch.info/noochservice/api/NoochServices/';

var URLs = {

  Login: PATH + 'LoginRequest',
  RegiserWithEmailAndPass: PATH + 'MemberRegistration',
  GetMemberIdByUsername: PATH + 'GetMemberIdByUsername',
  ForgotPassword: PATH + 'ForgotPassword',
  GetMemberIdByPhone: PATH + 'GetMemberIdByPhone',

  // Commong methods
  GetEncryptedData: PATH + 'GetEncryptedData',
  GetDecryptedData: PATH + 'GetDecryptedData',

  GetMemberDetails: PATH + 'GetMemberDetails',

  Signup: PATH + 'MemberRegistration'

};
