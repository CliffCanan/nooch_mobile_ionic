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
  LogOutRequest: PATH + 'LogOutRequest',
  getTransferList: PATH + 'GetTransactionsList',

  // Common methods
  GetEncryptedData: PATH + 'GetEncryptedData',
  GetDecryptedData: PATH + 'GetDecryptedData',



  GetMemberDetails:PATH+'GetMemberDetails',
  GetMyDetails:PATH+'GetMyDetails',


  GetRecentMembers:PATH+'GetRecentMembers',
  IsDuplicateMember:PATH+'IsDuplicateMember',

  MemberEmailNotificationSettings:PATH+'MemberEmailNotificationSettings',

  ResetPassword : PATH+'ResetPassword',
  ResetPin : PATH+'ResetPin',


  Signup: PATH + 'MemberRegistration',

  ValidatePinNumberToEnterForEnterForeground : PATH+'ValidatePinNumberToEnterForEnterForeground',
  ValidatePinNumber: PATH + 'ValidatePinNumber',
  getReferralCode: PATH + 'getReferralCode',
  MemberPrivacySettings: PATH + 'MemberPrivacySettings',
 
  CancelRequest: PATH + 'CancelMoneyRequestForExistingNoochUser',
  RemindPayment: PATH + 'SendTransactionReminderEmail',
 
  GetMemberPrivacySettings: PATH + 'GetMemberPrivacySettings',
  MySettings: PATH + 'MySettings'
 
};
