import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageKeyService {

  constructor() { }


  validation_messages = {
    postalCode:[

      { type: 'required', key: "postalCodeReq" },
    
      { type: 'minlength', key: "postalCodeminlength" },
      { type: 'maxlength', key: "postalCodeMaxLength" },


    ],
    monthlyIncome:[

      { type: 'required', key: "monthlyIncomeReq" },
    
      { type: 'minlength', key: "monthlyIncomeminlength" },
      { type: 'maxlength', key: "monthlyIncomeMaxLength" },


    ],
    typeofaccount:[
      {
        type: 'required', key: 'tofrequired'
      }
    ],
    POA:[
      {
        type: 'required', key: 'poarequired'
      }
    ],
    EMCTR:[
      {
        type: 'required', key: 'emctrrequired'
      }
    ],
    EMCTURN:[
      {
        type: 'required', key: 'emcturnreq'
      }
    ],
    SOF:[
      {
        type: 'required', key: 'sofrequired'
      }
    ],
    Occup:[
      {
        type: 'required', key: 'Occupreq'
      }
    ],
    MonthIncome:[
      {
        type: 'required', key: 'monthincomereq'
      }
    ],
    Province:[
      {
        type: 'required', key: 'provincereq'
      }
    ],
    // Productselection:[
    //   {
    //     type: 'required', key: 'tofrequired'
    //   }
    // ],
    natureofaccount:[
      {
        type: 'required', key: 'nofrequired'
      }
    ],
    Acctitle:[
      {
        type: 'required', key: 'AcctitleReq'
      },
      { type: 'minlength', key: "Acctitleminlength" },
      { type: 'maxlength', key: "AcctitleMaxLength" },
    ],
    companyName:[

      { type: 'required', key: "companyNameReq" },
    
      { type: 'minlength', key: "companyNameminlength" },
      { type: 'maxlength', key: "companyNameMaxLength" },


    ],
    addressLine1:[

      { type: 'required', key: "addressLine1Req" },
    
      { type: 'minlength', key: "addressLine1minlength" },
      { type: 'maxlength', key: "addressLine1MaxLength" },


    ],
    addressLine2:[

      
    
      { type: 'minlength', key: "addressLine2minlength" },
      { type: 'maxlength', key: "addressLine2MaxLength" },


    ],
    rating:[
      {type: 'required' , key: 'ratingreq'}
    ],
    otp:[  
      { type: 'required', key: "OtpRequired" },
      { type: 'minlength', key: "Otpminlength" },
    ],

    userName: [

      { type: 'required', key: "UserNameRequired" },
      { type: "pattern", key: "InvalidUserName" },
      { type: 'minlength', key: "UserNameminlength" },
      { type: 'maxlength', key: "UserNameMaxLength" },


    ],
    email: [

      { type: 'required', key: "EmailRequired" },
      { type: 'pattern', key: "EmailPattern" },
      { type: 'maxlength', key: "EmailMaxLength" },

    ],
    newemail:[

      { type: 'required', key:"EmailRequired" },
      { type: 'pattern', key:"EmailPattern" },
      { type: 'maxlength', key: "EmailMaxLength" },

    ],
    address:[
      { type: 'pattern', key:"addressPatter" },
      { type: 'required', key: "AddressRequired" },
      { type: 'maxlength', key: "addressmaxlength" },
      { type: 'minlength', key: "addressminlength" },
    ],
    completeaddress:[
      { type: 'pattern', key:"completeaddressPatter" },
      { type: 'required', key: "completeaddressRequired" },
      { type: 'maxlength', key: "completeaddressmaxlength" },

    ],
    driverAddress:[
      { type: 'pattern', key:"driverAddressPatter" },
      { type: 'required', key: "AddressRequired" },
      { type: 'maxlength', key: "completeaddressmaxlength" },
    ],
    city: [
      { type: 'required', key: "CityRequired" },
    ],
    ResAddress1: [
      { type: 'required', key: "ResAddress1Required" },
    ],
    ResAddress2: [
      { type: 'required', key: "ResAddress2Required" },
    ],
    IDIssuance: [
      { type: 'required', key: "DOERequired" },
    ],
    branch: [
      { type: 'required', key: "branchRequired" },
    ],
    State: [
      { type: 'required', key: "StateRequired" },
    ],
    country: [
      { type: 'required', key: "CountryRequired"},
    ],
    termsCondition: [
      {type:'required', key: "TermsConditions"}
    ],
    employeerName: [

      { type: 'required', key: "EmployeerNameRequired" },
      { type: 'pattern', key: "EmployeerNamePatter" },
      { type: 'minlength', key: "Employeerminlength" },
      { type: 'maxlength', key: "Employeermaxlength" },

    ],
    profession: [

      { type: 'required', key: "ProfessionRequired" },


    ],
    passportexpiry: [
      { type: 'required', key: "passportexpiry" },
    ],
    PassportName: [
      { type: 'required', key: "PassportName" },
    ],
    PassportNumber: [
      { type: 'required', key: "Passnmbrrequired" },
      { type: 'maxlength', key: "Passnmbrlength" },
    ],
    DobYearSelect:[
      { type: 'required', key: 'dobyearreq'},
    ],
    DobMonthSelect:[
      { type: 'required', key: 'dobmonthreq'},
    ],
    DobdaySelect:[
      { type: 'required', key: 'dobdayreq'},
    ],
    DoeYearSelect:[
      { type: 'required', key: 'doeyearreq'},
    ],
    DoeMonthSelect:[
      { type: 'required', key: 'doemonthreq'},
    ],
    DoedaySelect:[
      { type: 'required', key: 'doedayreq'},
    ],
    issueYearSelect:[
      { type: 'required', key: 'issueyearreq'},
    ],
    issueMonthSelect:[
      { type: 'required', key: 'issuemonthreq'},
    ],
    issuedaySelect:[
      { type: 'required', key: 'issuedayreq'},
    ],
    pepexpose: [
      { type: 'required', key: "pepreq" },
    ],
    Frequency: [
      { type: 'required', key: "freqReq" },
    ],
    PepRelative: [
      { type: 'required', key: "peprelreq" },
    ],
    MailAddress1: [
      { type: 'required', key: "Mailingline1req" },
    ],
    MailAddress2: [
      { type: 'required', key: "Mailingline2req" },
    ],
    CurntAddress: [
      { type: 'required', key: "Currentreq" },
    ],
    SpouseName:[
      { type: 'required', key: "SpouseNamereq"}
    ],
    Father_Name:[
      { type: 'required', key: "fatherNamereq"}
    ],
    Addressdiffer:[
      { type: 'required', key: "Addrdifferreq"}
    ],
    Remittance:[
      { type: 'required', key: "Remittancereq"}
    ],
    Mother_M_name:[
      { type: 'required', key: "M_M_Name"}
    ],
    CountryofIssue:[
      { type: 'required', key: "CountryofIssue" },
    ],
    Nationality:[
      { type: 'required', key: "Nationreq" },
    ],
    whatido: [

      { type: 'required', key: "Required" },


    ]    ,
    annualIncome: [

      { type: 'required', key: "AnnulaIncomeRequired" },


    ]

    , mobilenumber: [

      { type: 'required', key: "MobileRequired" },
      { type: 'pattern', key: "MobilePattern" },
      { type: 'minlength', key: "MobileMin" },
      { type: 'maxlength', key: "MobileMax" },
    ],
    newmobile: [

      { type: 'required', key: "MobileRequired" },
      { type: 'pattern', key: "MobilePattern" },
      { type: 'minlength', key: "MobileMin" },
      { type: 'maxlength', key: "MobileMax" },
    ],
    currentmobilenumber: [

      { type: 'required', key: "MobileRequired" },
      { type: 'pattern', key: "MobilePattern" },
      { type: 'minlength', key: "MobileMin" },
      { type: 'maxlength', key: "MobileMax" },
    ],
    amount: [

      { type: 'required', key: "AmountRequired" },

    ],
    password: [
      { type: 'required', key: "PasswordRequired" },
      { type: 'pattern', key: "PasswordPattern" },

    ]
    , inputiban: [
      { type: 'required', key: "Required" },
      { type: 'maxlength', key: "20MaxLenght" },
      { type: 'minlength', key: "12 Max Lenght" },
    ],
    description: [
      { type: 'required', key: "DescriptionRequired" },
      { type: 'maxlength', key: "DescriptionMaxLenght" },
      { type: 'minlength', key: "DescriptionMinLenght" },

    ],

    startDate: [
      { type: 'required', key: "StartDateRequired" },

    ],
    numberOfTransaction: [
      { type: 'required', key: "numberOfTransferRequired" },

    ],
    frequency: [
      { type: 'required', key: "FrequencyRequired" },

    ],
    numberOfTransfer: [
      { type: 'required', key: "numberOfTransferRequired" },

    ],
    nickName:[
      { type: 'required', key: "nickNameRequired" },
      { type: 'maxlength', key: "nickNameMax" },
      { type: 'minlength', key: "nickNameMin" },

    ],
    FirstName:[
      {
        type: 'required', key: 'firstnamerequired'
      },
      {
        type: 'minlength', key: 'firstnamemin'
      }
    ],
    MiddleName:[
      {
        type: 'required', key: 'middlenamerequired'
      }
    ],
    LastName:[
      {
        type: 'required', key: 'lastnamerequired'
      },
      {
        type: 'minlength', key: 'lastnamemin'
      }
    ],
    Gender:[
      {
        type: 'required', key: 'genderrequired'
      }
    ],
    DateofBirth:[
      {
        type: 'required', key: 'DOBrequired'
      }
    ],
    IDExpiry:[
      {
        type: 'required', key: 'idexpirereq'
      }
    ],
    iban:[
      { type: 'required', key: "IbanRequired" },
      { type: 'maxlength', key: "IbanMax" },
      { type: 'minlength', key: "IbanMin" },

    ],
    accountNo:[
      { type: 'required', key: "accNoRequired" },
      { type: 'maxlength', key: "accNoMax" },
      { type: 'minlength', key: "accNoMin" },
      { type: 'pattern', key: "accNoPattern" },

    ],
    cardnumber:[
      { type: 'required', key: "Cardnumberrequired" },
      { type: 'maxlength', key: "Cardnumber13digits" },
      { type: 'minlength', key: "Cardnumber13digits" },
      { type: 'pattern', key: "cardnumberPattern" },
    ],
    IDNumber:[
      { type: 'required', key: "Idnumberrequired" },
      { type: 'minlength', key: "Idnumber13digits" },
    ],
    expirymonth:[
      { type: 'required', key: "expirymonthrequired" },
    ],
    expiryyear:[
      { type: 'required', key: "expiryyearrequired" },
    ],
    cvvnumber:[
      { type: 'required', key: "Cvv" },
      { type: 'maxlength', key: "Cardnumber3digits" },
       { type: 'minlength', key: "Cardnumber3digits" },
    ],
    budget: [

      { type: 'required', key: "budgetRequired" },
      { type: 'minlength', key: "budgetminlength" },
      { type: 'maxlength', key: "budgetMaxLength" },
      { type: 'pattern', key: "budgetPattern" },
    ],
    comment: [

      { type: 'required', key: "commentRequired" },
      { type: 'maxlength', key: "commentMaxLength" },

    ],
    response: [
      { type: 'required', key: "ResponseReq" },
    ],
    ConfirmTerms: [
      { type: 'required', key: "termreq" },
    ],
    bankname: [
      { type: 'required', key: "banknamereq" },
      { type: 'minlength', key: "banknamemin" }
    ],
    amountbudget: [

      { type: 'required', key: "amountbudgetRequired" },
      { type: 'maxlength', key: "amountbudgetMaxLength" },
      { type: 'minlength', key: "amountbudgetminlength" },
      { type: 'pattern', key: "amountbudgetPattern" },
    ],
    ibanvalid:[
      { type: 'required', key: "ibanRequired" },
      { type: 'maxlength', key: "ibanMaxLength" },
      { type: 'pattern', key: "Invalidiban" },
    ],
    newbeneficiary:[
      { type: 'required', key: "newbeneficiaryRequired" },
      { type: 'maxlength', key: "newbeneficiaryMaxLength" },
    ],
    startdate:[
      { type: 'required', key: "startdateRequired" },

    ],
    enddate:[
      { type: 'required', key: "enddateRequired" },

    ],
     minamount:[
      { type: 'required', key: "minamountRequired" },
      { type: 'maxlength', key: "minamountlength" },
    ],
     maxamount:[
      { type: 'required', key: "maxamountRequired" },
      { type: 'maxlength', key: "maxamountlength" },
    ],
    categroy:[
      { type: 'required', key: "categroyRequired" },

    ],
     text:[
      { type: 'required', key: "textRequired" },

    ],types:[
      { type: 'required', key: "typeRequired" },

    ],fullName:[
      { type: 'required', key: "fullNameRequired" },

    ],benificiaryadderss:[
      { type: 'required', key: "benificiaryadderss" },
    ]
  }
}
