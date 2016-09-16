// Google project number - 104707683579
// google project number is needed while adding push notification token


// app test credentials
// username - rick.lassin@gmail.com
// pass - test123!

//var PATH = 'https://noochme.com/landlords/db/api/';
// var PATH = 'https://www.noochme.com/noochservice/api/NoochServices/';
var PATH = 'http://www.nooch.info/noochservice/api/NoochServices/';
//var PATH = 'http://localhost:40972/api/NoochServices/';

var URLs = {
    CancelRequest: PATH + 'CancelMoneyRequestForExistingNoochUser',
    CheckIfEmailIsRegistered: PATH + 'CheckIfEmailIsRegistered',
    DeleteAttachedBankNode: PATH + 'DeleteAttachedBankNode',
    ForgotPassword: PATH + 'ForgotPassword',
    GetDecryptedData: PATH + 'GetDecryptedData',
    GetEncryptedData: PATH + 'GetEncryptedData',
    getInvitedMemberList: PATH + 'getInvitedMemberList',
    GetLocationSearch: PATH + 'GetLocationSearch',
    GetMemberIdByUsername: PATH + 'GetMemberIdByUsername',
    GetMemberIdByPhone: PATH + 'GetMemberIdByPhone',
    GetMemberPrivacySettings: PATH + 'GetMemberPrivacySettings',
    GetMemberNotificationSettings: PATH + 'GetMemberNotificationSettings',
    GetMemberStatsGeneric: PATH + 'GetMemberStatsGeneric',
    GetMostFrequentFriends: PATH + 'GetMostFrequentFriends',
    GetMyDetails: PATH + 'GetMyDetails',
    GetRecentMembers: PATH + 'GetRecentMembers',
    getReferralCode: PATH + 'getReferralCode',
    GetRecentMembers: PATH + 'GetRecentMembers',
    GetSynapseBankAndUserDetails: PATH + 'GetUsersBankInfoForMobile', // CC (8/28/16) Updated this to call a new server method specifically for sending only the data needed for the mobile app (i.e. no OAuth key or bank OID stuff)
    getTransferList: PATH + 'GetTransactionsList',
    GetUserDetails: PATH + 'GetUserDetailsForApp',
    Login: PATH + 'LoginRequest',
    LoginWithFacebookGeneric: PATH + 'LoginWithFacebookGeneric',
    LogOutRequest: PATH + 'LogOutRequest',
    IsDuplicateMember: PATH + 'IsDuplicateMember',
    MemberEmailNotificationSettings: PATH + 'MemberEmailNotificationSettings',
    MemberPrivacySettings: PATH + 'MemberPrivacySettings',
    MySettings: PATH + 'MySettings',
    RegiserWithEmailAndPass: PATH + 'MemberRegistration',
    RejectPayment: PATH + 'RejectMoneyRequestForExistingNoochUser',
    RemindPayment: PATH + 'SendTransactionReminderEmail',
    RequestMoney: PATH + 'RequestMoney',
    RequestMoneyToNonNoochUserUsingSynapse: PATH + 'RequestMoneyToNonNoochUserUsingSynapse',
    RequestMoneyToNonNoochUserThroughPhoneUsingSynapse: PATH + 'RequestMoneyToNonNoochUserThroughPhoneUsingSynapse',
    ResendVerificationLink: PATH + 'ResendVerificationLink',
    ResendVerificationSMS: PATH + 'ResendVerificationSMS',
    ResetPassword: PATH + 'ResetPassword',
    ResetPin: PATH + 'ResetPin',
    SaveMembersFBId: PATH + 'SaveMembersFBId',
    SaveMemberSSN: PATH + 'SaveMemberSSN',
    sendTransactionInCSV: PATH + 'sendTransactionInCSV',
    Signup: PATH + 'MemberRegistration',
    submitDocumentToSynapseV3: PATH + 'submitDocumentToSynapseV3',
    TransferMoney: PATH + 'TransferMoneyUsingSynapse',
    TransferMoneyToNonNoochUserThroughPhoneUsingsynapse: PATH + 'TransferMoneyToNonNoochUserThroughPhoneUsingsynapse',
    TransferMoneyToNonNoochUserUsingSynapse: PATH + 'TransferMoneyToNonNoochUserUsingSynapse',
    ValidatePinNumberToEnterForEnterForeground: PATH + 'ValidatePinNumberToEnterForEnterForeground',
    ValidatePinNumber: PATH + 'ValidatePinNumber',
    UdateMemberIPAddress: PATH + 'UdateMemberIPAddress',
    CheckMemberExistenceUsingEmailOrPhone: PATH + 'CheckMemberExistenceUsingEmailOrPhone'
};
