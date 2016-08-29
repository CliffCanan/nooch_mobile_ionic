// Google project number - 104707683579
// google project number is needed while adding push notification token


// app test credentials
// username - rick.lassin@gmail.com
// pass - test123!

//var PATH = 'https://noochme.com/landlords/db/api/';
var PATH = 'http://www.nooch.info/noochservice/api/NoochServices/';
//var PATH = 'http://localhost:40972/api/NoochServices/';

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
    GetUserDetails: PATH + 'GetUserDetailsForApp',
    GetMyDetails: PATH + 'GetMyDetails',
    GetRecentMembers: PATH + 'GetRecentMembers',
    IsDuplicateMember: PATH + 'IsDuplicateMember',
    MemberEmailNotificationSettings: PATH + 'MemberEmailNotificationSettings',
    ResetPassword: PATH + 'ResetPassword',
    ResetPin: PATH + 'ResetPin',
    Signup: PATH + 'MemberRegistration',
    ValidatePinNumberToEnterForEnterForeground: PATH + 'ValidatePinNumberToEnterForEnterForeground',
    ValidatePinNumber: PATH + 'ValidatePinNumber',
    getReferralCode: PATH + 'getReferralCode',
    MemberPrivacySettings: PATH + 'MemberPrivacySettings',
    CancelRequest: PATH + 'CancelMoneyRequestForExistingNoochUser',
    RemindPayment: PATH + 'SendTransactionReminderEmail',
    RejectPayment: PATH + 'RejectMoneyRequestForExistingNoochUser',
    TransferMoney: PATH + 'TransferMoneyUsingSynapse',
    TransferMoneyToNonNoochUserUsingSynapse: PATH + 'TransferMoneyToNonNoochUserUsingSynapse',
    TransferMoneyToNonNoochUserThroughPhoneUsingsynapse: PATH + 'TransferMoneyToNonNoochUserThroughPhoneUsingsynapse',
    GetMemberPrivacySettings: PATH + 'GetMemberPrivacySettings',
    MySettings: PATH + 'MySettings',
    GetMemberNotificationSettings: PATH + 'GetMemberNotificationSettings',
    MemberEmailNotificationSettings: PATH + 'MemberEmailNotificationSettings',
    GetRecentMembers: PATH + 'GetRecentMembers',
    GetLocationSearch: PATH + 'GetLocationSearch',
    RequestMoney: PATH + 'RequestMoney',
    RequestMoneyToNonNoochUserUsingSynapse: PATH + 'RequestMoneyToNonNoochUserUsingSynapse',
    RequestMoneyToNonNoochUserThroughPhoneUsingSynapse: PATH +'RequestMoneyToNonNoochUserThroughPhoneUsingSynapse',
    GetMemberStatsGeneric: PATH + 'GetMemberStatsGeneric',
    getInvitedMemberList: PATH + 'getInvitedMemberList',
    GetSynapseBankAndUserDetails: PATH + 'GetUsersBankInfoForMobile', // CC (8/28/16) Updated this to call a new server method specifically for sending only the data needed for the mobile app (i.e. no OAuth key or bank OID stuff)
    sendTransactionInCSV: PATH + 'sendTransactionInCSV',
    SaveDOBForMember: PATH + 'SaveDOBForMember',
    GetMostFrequentFriends: PATH + 'GetMostFrequentFriends',
    SaveMemberSSN: PATH + 'SaveMemberSSN',
    LoginWithFacebookGeneric: PATH + 'LoginWithFacebookGeneric',
    SaveMembersFBId: PATH + 'SaveMembersFBId',
    GetMemberNameByUserName: PATH + 'GetMemberNameByUserName'
};
