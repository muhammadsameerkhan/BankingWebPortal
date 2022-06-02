import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidation } from '../../Validators/PasswordValidators';
import { AuthService } from '../../Services/auth.service';
import { CountriesService, Country } from '../../Services/countries.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../Services/common.service';
import { ErrorMessageKeyService } from '../../Services/error-message-key.service';
import * as moment from 'moment';
import { ConfigService } from '../../Services/config.service';
import { KycService } from "../../Services/kyc.service";
import { ɵDomEventsPlugin } from '@angular/platform-browser';

@Component({
  selector: 'app-pakistan-nationality-details',
  templateUrl: './pakistan-nationality-details.component.html',
  styleUrls: ['./pakistan-nationality-details.component.scss']
})
export class PakistanNationalityDetailsComponent implements OnInit {

  RegistrationForm: FormGroup;
  maxNumber: number;
  attachedHeading: string;
  cardmaask: string = "XXXXX-XXXXXXX-X";
  counter: string;
  current: string;
  max: string;
  attachedHeading2: string;
  submitAttempt: boolean = false;
  mask: string = "";
  cardPlaceHolder: string = "XXXXX-XXXXXXX-X";
  Idfrontbase64: string;
  Idbackbase64: string;
  doemin;
  doemax;
  dobmax;
  doe;
  dob;
  dobsplit;
  doesplit;
  issuemax;
  issuedate;
  issuedatesplit;
  fullname: string = "";
  responsestring: string;
  loginresponse;
  doeyears;
  dobyears;
  issuedateyears;
  dobmaxarray;

  dobdayslistArray = [];
  doedayslistArray = [];
  issuedayslistArray = [];

  dobmonthlistArray = [{
    value: 1,
    text: "January"
  },
  {
    value: 2,
    text: "February"
  }, {
    value: 3,
    text: "March"
  }, {
    value: 4,
    text: "April"
  }, {
    value: 5,
    text: "May"
  }, {
    value: 6,
    text: "June"
  }, {
    value: 7,
    text: "July"
  }, {
    value: 8,
    text: "August"
  }, {
    value: 9,
    text: "September"
  }, {
    value: 10,
    text: "October"
  }, {
    value: 11,
    text: "November"
  }, {
    value: 12,
    text: "December"
  }];

  doemonthlistArray = [{
    value: 1,
    text: "January"
  },
  {
    value: 2,
    text: "February"
  }, {
    value: 3,
    text: "March"
  }, {
    value: 4,
    text: "April"
  }, {
    value: 5,
    text: "May"
  }, {
    value: 6,
    text: "June"
  }, {
    value: 7,
    text: "July"
  }, {
    value: 8,
    text: "August"
  }, {
    value: 9,
    text: "September"
  }, {
    value: 10,
    text: "October"
  }, {
    value: 11,
    text: "November"
  }, {
    value: 12,
    text: "December"
  }];

  issuemonthlistArray = [{
    value: 1,
    text: "January"
  },
  {
    value: 2,
    text: "February"
  }, {
    value: 3,
    text: "March"
  }, {
    value: 4,
    text: "April"
  }, {
    value: 5,
    text: "May"
  }, {
    value: 6,
    text: "June"
  }, {
    value: 7,
    text: "July"
  }, {
    value: 8,
    text: "August"
  }, {
    value: 9,
    text: "September"
  }, {
    value: 10,
    text: "October"
  }, {
    value: 11,
    text: "November"
  }, {
    value: 12,
    text: "December"
  }];

  DobdaySelect: number = null;
  DobMonthSelect: number = null;
  DobYearSelect: number = null;
  DobIsFebSelect: boolean = false;
  Dobisyearleap: boolean = false;
  DobdefaultSelect: boolean = true;
  DobthirtySelect;

  DoedaySelect: number = null;
  DoeMonthSelect: number = null;
  DoeYearSelect: number = null;
  DoeIsFebSelect: boolean = false;
  Doeisyearleap: boolean = false;
  DoedefaultSelect: boolean = true;
  DoethirtySelect;

  issuedaySelect: number = null;
  issueMonthSelect: number = null;
  issueYearSelect: number = null;
  issueIsFebSelect: boolean = false;
  issueisyearleap: boolean = false;
  issuedefaultSelect: boolean = true;
  issuethirtySelect;

  dobstring;
  doestring;
  issuestring;

  doeminarray;
  doemaxarray;
  dobminarray;
  issuedatearray;

  doeError;

  dobError;
  dobErrorday;
  dobErrormonth;
  dobErroryear;

  IssueError;

  pickerOptions

  constructor(
    public formbuilder: FormBuilder,
    public auth: AuthService,
    public countries: CountriesService,
    private _router: Router,
    public translate: TranslateService,
    public errorKey: ErrorMessageKeyService,
    public common: CommonService,
    public kyc: KycService,
    private config: ConfigService,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');

    this.pickerOptions = {
      animated: false
    };

  }

  Idfrontfunction(data) {
    debugger
    this.Idfrontbase64 = data;
    this.RegistrationForm.patchValue({ IdFront: this.Idfrontbase64, IdBack: this.Idbackbase64 })
  }

  Idbackfunction(data) {
    debugger
    this.Idbackbase64 = data;
    this.RegistrationForm.patchValue({ IdFront: this.Idfrontbase64, IdBack: this.Idbackbase64 })
  }

  async ngOnInit(): Promise<void> {

    this.RegistrationForm = this.formbuilder.group({
      IdFront: ["", Validators.compose([Validators.required])],
      IdBack: ["", Validators.compose([Validators.required])],
      IDNumber: ["", Validators.compose([Validators.required, Validators.minLength(13)])],
      FirstName: ["", Validators.compose([Validators.required])],
      MiddleName: [""],
      LastName: ["", Validators.compose([Validators.required])],
      Gender: ['', Validators.compose([Validators.required])],
      DOB: ['', Validators.compose([Validators.required,])],
      DOE: ['', Validators.compose([Validators.required])],
      Issuedate: ['', Validators.compose([Validators.required])],
      DobdaySelect: ['', Validators.compose([Validators.required])],
      DobMonthSelect: ['', Validators.compose([Validators.required])],
      DobYearSelect: ['', Validators.compose([Validators.required])],
      DoedaySelect: ['', Validators.compose([Validators.required])],
      DoeMonthSelect: ['', Validators.compose([Validators.required])],
      DoeYearSelect: ['', Validators.compose([Validators.required])],
      issuedaySelect: ['', Validators.compose([Validators.required])],
      issueMonthSelect: ['', Validators.compose([Validators.required])],
      issueYearSelect: ['', Validators.compose([Validators.required])]
    })

    debugger;
    this.doemin = moment().add(1, 'days').format('YYYY-MM-DD');
    this.doemax = moment().add(12, 'years').format('YYYY-MM-DD');
    this.dobmax = moment().add(-18, 'years').format('YYYY-MM-DD');
    this.issuemax = moment().format('YYYY-MM-DD');

    // this.doeminarray = this.doemin.split('-');
    // console.log("doemin = " + this.doeminarray);
    // this.doemaxarray = this.doemax.split('-');
    // console.log("doemax = " + this.doemaxarray)
    // this.dobmaxarray = this.dobmax.split('-')
    // console.log("dobmax = " + this.dobmaxarray)
    // this.issuedatearray = this.issuedatearray.split('-');
    // console.log("issuedate = " + this.issuedatearray);

    const DOBYEARS = () => {
      const years = []
      const dateStart = moment().add(-100, 'years')
      const dateEnd = moment().add(-18, 'y')
      while (dateEnd.diff(dateStart, 'years') >= 0) {
        years.push(dateStart.format('YYYY'))
        dateStart.add(1, 'year')
      }
      return years
    }
    this.dobmaxarray = DOBYEARS();
    this.dobmaxarray.sort((one, two) => (one > two ? -1 : 1));

    const DOEYEARS = () => {
      const years = []
      debugger
      const dateStart = moment()
      const dateEnd = moment().add(12, 'y')
      while (dateEnd.diff(dateStart, 'years') >= 0) {
        years.push(dateStart.format('YYYY'))
        dateStart.add(1, 'year')
      }
      return years
    }
    this.doeyears = DOEYEARS();
    this.doeyears.sort((one, two) => (one > two ? -1 : 1));

    const IssueYEARS = () => {
      const years = []
      debugger
      const dateStart = moment().add(-100, 'y')
      const dateEnd = moment()
      while (dateEnd.diff(dateStart, 'years') >= 0) {
        years.push(dateStart.format('YYYY'))
        dateStart.add(1, 'year')
      }
      return years
    }
    this.issuedateyears = IssueYEARS();
    this.issuedateyears.sort((one, two) => (one > two ? -1 : 1));

    for (var i = 1; i <= 31; i++) {
      this.dobdayslistArray.push(i);
      this.doedayslistArray.push(i);
      this.issuedayslistArray.push(i);
    }

    this.counter = "1";
    this.current = "2";
    this.max = "13";
    this.translate.get(["IDFront", "IDBack"]).subscribe(data => {
      this.attachedHeading = data.IDFront;
      this.attachedHeading2 = data.IDBack;
    });


    let a = await this.common.Get('User')
    if (a) {
      this.loginresponse = JSON.parse(a);
    }

    debugger
    if(this.loginresponse == null || this.loginresponse.isIdCardExpire == false){
      if(this.auth.registrationObject.email == ""){  
        this._router.navigateByUrl("/register/LoginDetails");
      }  
    }

    console.log(this.auth.registrationObject);
  }

  getMessage(key, control) {

    let error = "";
    console.log(key + " " + control);
    this.translate.get([key]).subscribe(data => {
      console.log(data);
      error = data[key];
    })
    return error;
  }

  leapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  }

  isFormValid() {
    if (!this.RegistrationForm.valid) {
      return true;
    } else {
      false;
    }
  }



  DobSelectionchanges() {
    debugger
    const sb = document.querySelector('#dobdayslist') as HTMLSelectElement;
    const se = document.querySelector('#dobmonthlist') as HTMLSelectElement;

    if (this.DobdaySelect != null) {
      sb.style.color = '#354F52'
    }
    else if(this.DobdaySelect == null){
      sb.style.color = 'red'
    }
    if(this.DobMonthSelect != null){
      se.style.color = '#354F52'
    }
    else if(this.DobMonthSelect == null){
      se.style.color = 'red';
    }

    var array = this.dobmax.split('-');

    var day = Number(array[2]);
    var month = Number(array[1]);
    var year = array[0];

    this.RegistrationForm.patchValue({ 'DOB': null })
    debugger
    //days
    if (this.DobYearSelect != null) {
      var check = this.leapYear(this.DobYearSelect)
    }

    if (this.DobdaySelect != null && this.DobMonthSelect != null && this.DobYearSelect != null) {
      if (this.DobMonthSelect.toString().length == 1) {
        var monthvalue = "0" + this.DobMonthSelect
      }
      if (this.DobdaySelect.toString().length == 1) {
        var DobdaySelectvalue = "0" + this.DobdaySelect;
      }
      if (monthvalue != null && DobdaySelectvalue != null) {
        this.dobstring = this.DobYearSelect + "-" + monthvalue + "-" + DobdaySelectvalue;
      } else if (monthvalue != null && DobdaySelectvalue == null) {
        this.dobstring = this.DobYearSelect + "-" + monthvalue + "-" + this.DobdaySelect;
      } else if (monthvalue == null && DobdaySelectvalue != null) {
        this.dobstring = this.DobYearSelect + "-" + this.DobMonthSelect + "-" + DobdaySelectvalue;
      } else if (monthvalue == null && DobdaySelectvalue == null) {
        this.dobstring = this.DobYearSelect + "-" + this.DobMonthSelect + "-" + this.DobdaySelect;
      }
      if (this.dobstring > this.dobmax) {
        this.dobError = true;
        this.RegistrationForm.patchValue({ 'DOB': null });
      } else {
        this.dobError = false;
        this.RegistrationForm.patchValue({ 'DOB': this.dobstring });
      }
      console.log(this.dobstring);
    }

    //logic goes here
    if (this.DobMonthSelect == 1 || this.DobMonthSelect == 3 || this.DobMonthSelect == 5 || this.DobMonthSelect == 7 || this.DobMonthSelect == 8 || this.DobMonthSelect == 10 || this.DobMonthSelect == 12) {
      if (this.DobYearSelect != year) {
        if (!this.dobdayslistArray.includes(28)) { this.dobdayslistArray.push(28) }
        if (!this.dobdayslistArray.includes(29)) { this.dobdayslistArray.push(29) }
        if (!this.dobdayslistArray.includes(30)) { this.dobdayslistArray.push(30) }
        if (!this.dobdayslistArray.includes(31)) { this.dobdayslistArray.push(31) }
      }
    }

    else if (this.DobMonthSelect != 2 && this.DobMonthSelect == 4 || this.DobMonthSelect == 6 || this.DobMonthSelect == 9 || this.DobMonthSelect == 11) {
      if (this.DobYearSelect != year) {
        if (!this.dobdayslistArray.includes(28)) { this.dobdayslistArray.push(28) }
        if (!this.dobdayslistArray.includes(29)) { this.dobdayslistArray.push(29) }
        if (!this.dobdayslistArray.includes(30)) { this.dobdayslistArray.push(30) }

        var lastindex = this.dobdayslistArray.length - 1;
        if (this.dobdayslistArray.includes(31)) { this.dobdayslistArray.splice(lastindex, 1) }

        // this.dayslistArray.sort((a,b) => (a > b ? 1 : -1));
        if (this.DobdaySelect == 31) {
          this.DobdaySelect = null;
          //sb.style.color = 'red'
        }
      }
    }

    else if (this.DobMonthSelect == 2) {
      if (this.DobYearSelect != null) {
        if (check) {

          if (!this.dobdayslistArray.includes(28)) { this.dobdayslistArray.push(28) }
          if (!this.dobdayslistArray.includes(29)) { this.dobdayslistArray.push(29) }

          var lastindex = this.dobdayslistArray.length - 1;
          if (this.dobdayslistArray.includes(31)) { this.dobdayslistArray.splice(lastindex, 1) }

          var lastindex = this.dobdayslistArray.length - 1;
          if (this.dobdayslistArray.includes(30)) { this.dobdayslistArray.splice(lastindex, 1) }

          if (this.DobdaySelect == 30 || this.DobdaySelect == 31) {
            this.DobdaySelect = null;
            //sb.style.color = 'red'
          }
        }
        else {
          if (this.DobYearSelect != year) {
            if (!this.dobdayslistArray.includes(28)) { this.dobdayslistArray.push(28) }

            var lastindex = this.dobdayslistArray.length - 1;
            if (this.dobdayslistArray.includes(31)) { this.dobdayslistArray.splice(lastindex, 1) }

            var lastindex = this.dobdayslistArray.length - 1;
            if (this.dobdayslistArray.includes(30)) { this.dobdayslistArray.splice(lastindex, 1) }

            var lastindex = this.dobdayslistArray.length - 1;
            if (this.dobdayslistArray.includes(29)) { this.dobdayslistArray.splice(lastindex, 1) }

            if (this.DobdaySelect == 29 || this.DobdaySelect == 30 || this.DobdaySelect == 31) {
              this.DobdaySelect = null;
              //sb.style.color = 'red'
            }
          }
        }
      }
      else {
        if (this.DobYearSelect != year) {
          if (!this.dobdayslistArray.includes(28)) { this.dobdayslistArray.push(28) }
          var lastindex = this.dobdayslistArray.length - 1;
          if (this.dobdayslistArray.includes(31)) { this.dobdayslistArray.splice(lastindex, 1) }
          var lastindex = this.dobdayslistArray.length - 1;
          if (this.dobdayslistArray.includes(30)) { this.dobdayslistArray.splice(lastindex, 1) }
          var lastindex = this.dobdayslistArray.length - 1;
          if (this.dobdayslistArray.includes(29)) { this.dobdayslistArray.splice(lastindex, 1) }

          if (this.DobdaySelect == 29 || this.DobdaySelect == 30 || this.DobdaySelect == 31) {
            this.DobdaySelect = null;
           // sb.style.color = 'red'
          }
        }
      }
    }

    var anotherdobdayslistArray = [];
    for (var i = 1; i <= 31; i++) {
      anotherdobdayslistArray.push(i);
    }

    if (this.DobYearSelect != null) {
      debugger
      
      if (this.DobYearSelect == year) {
        if (this.DobdaySelect == null || this.DobdaySelect >= day) {
          if (this.DobMonthSelect == null || this.DobMonthSelect >= month) {
            
            // if(this.DobdaySelect <= day){
            //   this.DobdaySelect = null
            // }

            // if(this.DobMonthSelect <= month){
            //   this.DobMonthSelect = null
            // }

            var index = this.dobdayslistArray.indexOf(day);
            for (var i = index + 1; i <= 31; i++) {
              this.dobdayslistArray.splice(index + 1, 1)
            }

            if(this.DobdaySelect != day || this.DobdaySelect !< day){
              this.DobdaySelect = null;
              //sb.style.color = 'red';
            }

            var searchTerm = month
            var newindex = -1;
            for (var i = 0, len = this.dobmonthlistArray.length; i < len; i++) {
              if (this.dobmonthlistArray[i].value === searchTerm) {
                newindex = i;
                break;
              }
            }

            debugger
            for (var i = newindex + 1; i <= 12; i++) {
              this.dobmonthlistArray.splice(newindex + 1, 1)
            }

            if(this.DobMonthSelect != month){
              this.DobMonthSelect = null;
              //se.style.color = 'red';  
            }
          }
        }
      }
      else if (this.DobYearSelect != year){
        if(this.DobMonthSelect != null){
          if(this.DobMonthSelect <= month){
            if(this.DobdaySelect )
        console.log(this.DobdaySelect);
        this.DobMonthSelect = null;
        this.DobdaySelect = null;
        //sb.style.color = 'red';
        //se.style.color = 'red';
        // if(this.DobdaySelect == null && this.DobMonthSelect == null){
        //   sb.style.color = 'red';
        //   //#354F52
        //   se.style.color = 'red';
        // }

        

        // if(this.DobdaySelect > day){
        //   this.DobdaySelect = null;
        //   sb.style.color = 'red';
        // }

        // if(this.DobMonthSelect > month){
        //   this.DobMonthSelect = null;
        //   se.style.color = 'red';
        // }

        this.dobmonthlistArray = [{
          value: 1,
          text: "January"
        },
        {
          value: 2,
          text: "February"
        }, {
          value: 3,
          text: "March"
        }, {
          value: 4,
          text: "April"
        }, {
          value: 5,
          text: "May"
        }, {
          value: 6,
          text: "June"
        }, {
          value: 7,
          text: "July"
        }, {
          value: 8,
          text: "August"
        }, {
          value: 9,
          text: "September"
        }, {
          value: 10,
          text: "October"
        }, {
          value: 11,
          text: "November"
        }, {
          value: 12,
          text: "December"
        }];
        
        this.dobdayslistArray = null;
        this.dobdayslistArray = anotherdobdayslistArray;

        this.DobdaySelect = null;
        this.DobMonthSelect = null;
      }
      }
      }
      
      // if (this.DobYearSelect != year && this.DobdaySelect < day || this.DobdaySelect == day){
      //   sb.style.color = '#354F52'
        
      // }
      // if (this.DobYearSelect != year && this.DobMonthSelect == month){
      //   se.style.color = '#354F52'
      // }
      
    }
  }

  DobSelectionchange() {
    debugger
    const sb = document.querySelector('#dobdayslist') as HTMLSelectElement;

    // if (this.DobdaySelect != null) {
    //   sb.style.color = '#354F52'
    // }

    this.RegistrationForm.patchValue({ 'DOB': null })
    debugger
    //days
    if (this.DobYearSelect != null) {
      var check = this.leapYear(this.DobYearSelect)
    }

    sb.validity
    // sb.ontouchend = () => {
    //   if(this.DobdaySelect != null){
    //     this.dobErrorday = true;
    //   }else{
    //     this.dobErrorday = false;
    //   }
    // }

    if (this.DobdaySelect != null && this.DobMonthSelect != null && this.DobYearSelect != null) {
      if (this.DobMonthSelect.toString().length == 1) {
        var monthvalue = "0" + this.DobMonthSelect
      }
      if (this.DobdaySelect.toString().length == 1) {
        var DobdaySelectvalue = "0" + this.DobdaySelect;
      }
      if (monthvalue != null && DobdaySelectvalue != null) {
        this.dobstring = this.DobYearSelect + "-" + monthvalue + "-" + DobdaySelectvalue;
      } else if (monthvalue != null && DobdaySelectvalue == null) {
        this.dobstring = this.DobYearSelect + "-" + monthvalue + "-" + this.DobdaySelect;
      } else if (monthvalue == null && DobdaySelectvalue != null) {
        this.dobstring = this.DobYearSelect + "-" + this.DobMonthSelect + "-" + DobdaySelectvalue;
      } else if (monthvalue == null && DobdaySelectvalue == null) {
        this.dobstring = this.DobYearSelect + "-" + this.DobMonthSelect + "-" + this.DobdaySelect;
      }
      if (this.dobstring > this.dobmax) {
        this.dobError = true;
        this.RegistrationForm.patchValue({ 'DOB': null });
      } else {
        this.dobError = false;
        this.RegistrationForm.patchValue({ 'DOB': this.dobstring });
      }
      console.log(this.dobstring);
    }

    if (this.DobMonthSelect == 1 || this.DobMonthSelect == 3 || this.DobMonthSelect == 5 || this.DobMonthSelect == 7 || this.DobMonthSelect == 8 || this.DobMonthSelect == 10 || this.DobMonthSelect == 12) {

      if (!this.dobdayslistArray.includes(28)) { this.dobdayslistArray.push(28) }
      if (!this.dobdayslistArray.includes(29)) { this.dobdayslistArray.push(29) }
      if (!this.dobdayslistArray.includes(30)) { this.dobdayslistArray.push(30) }
      if (!this.dobdayslistArray.includes(31)) { this.dobdayslistArray.push(31) }
      
    }

    else if (this.DobMonthSelect != 2 && this.DobMonthSelect == 4 || this.DobMonthSelect == 6 || this.DobMonthSelect == 9 || this.DobMonthSelect == 11) {

      if (!this.dobdayslistArray.includes(28)) { this.dobdayslistArray.push(28) }
      if (!this.dobdayslistArray.includes(29)) { this.dobdayslistArray.push(29) }
      if (!this.dobdayslistArray.includes(30)) { this.dobdayslistArray.push(30) }

      var lastindex = this.dobdayslistArray.length - 1;
      if (this.dobdayslistArray.includes(31)) { this.dobdayslistArray.splice(lastindex, 1) }

      // this.dayslistArray.sort((a,b) => (a > b ? 1 : -1));
      if (this.DobdaySelect == 31) {
        this.DobdaySelect = null;
        //sb.style.color = 'red'
      }

    }

    else if (this.DobMonthSelect == 2) {
      if (this.DobYearSelect != null) {
        if (check) {

          if (!this.dobdayslistArray.includes(28)) { this.dobdayslistArray.push(28) }
          if (!this.dobdayslistArray.includes(29)) { this.dobdayslistArray.push(29) }

          var lastindex = this.dobdayslistArray.length - 1;
          if (this.dobdayslistArray.includes(31)) { this.dobdayslistArray.splice(lastindex, 1) }

          var lastindex = this.dobdayslistArray.length - 1;
          if (this.dobdayslistArray.includes(30)) { this.dobdayslistArray.splice(lastindex, 1) }

          if (this.DobdaySelect == 30 || this.DobdaySelect == 31) {
            this.DobdaySelect = null;
         //   sb.style.color = 'red'
          }
        }
        else {
          if (!this.dobdayslistArray.includes(28)) { this.dobdayslistArray.push(28) }

          var lastindex = this.dobdayslistArray.length - 1;
          if (this.dobdayslistArray.includes(31)) { this.dobdayslistArray.splice(lastindex, 1) }

          var lastindex = this.dobdayslistArray.length - 1;
          if (this.dobdayslistArray.includes(30)) { this.dobdayslistArray.splice(lastindex, 1) }

          var lastindex = this.dobdayslistArray.length - 1;
          if (this.dobdayslistArray.includes(29)) { this.dobdayslistArray.splice(lastindex, 1) }

          if (this.DobdaySelect == 29 || this.DobdaySelect == 30 || this.DobdaySelect == 31) {
            this.DobdaySelect = null;
            //sb.style.color = 'red'
          }
        }
      }
      else {
        if (!this.dobdayslistArray.includes(28)) { this.dobdayslistArray.push(28) }
        var lastindex = this.dobdayslistArray.length - 1;
        if (this.dobdayslistArray.includes(31)) { this.dobdayslistArray.splice(lastindex, 1) }
        var lastindex = this.dobdayslistArray.length - 1;
        if (this.dobdayslistArray.includes(30)) { this.dobdayslistArray.splice(lastindex, 1) }
        var lastindex = this.dobdayslistArray.length - 1;
        if (this.dobdayslistArray.includes(29)) { this.dobdayslistArray.splice(lastindex, 1) }

        if (this.DobdaySelect == 29 || this.DobdaySelect == 30 || this.DobdaySelect == 31) {
          this.DobdaySelect = null;
          //sb.style.color = 'red'
        }
      }
    }
  }

  DoeSelectionchange() {
    debugger
    const sb = document.querySelector('#doedayslist') as HTMLSelectElement;

    // if (this.DoedaySelect != null) {
    //   sb.style.color = '#354F52'
    // }

    this.RegistrationForm.patchValue({ 'DOE': null })
    debugger
    //days
    if (this.DoeYearSelect != null) {
      var check = this.leapYear(this.DoeYearSelect)
    }

    if (this.DoedaySelect != null && this.DoeMonthSelect != null && this.DoeYearSelect != null) {
      if (this.DoeMonthSelect.toString().length == 1) {
        var monthvalue = "0" + this.DoeMonthSelect
      }
      if (this.DoedaySelect.toString().length == 1) {
        var DoedaySelectvalue = "0" + this.DoedaySelect;
      }
      if (monthvalue != null && DoedaySelectvalue != null) {
        this.doestring = this.DoeYearSelect + "-" + monthvalue + "-" + DoedaySelectvalue;
      } else if (monthvalue != null && DoedaySelectvalue == null) {
        this.doestring = this.DoeYearSelect + "-" + monthvalue + "-" + this.DoedaySelect;
      } else if (monthvalue == null && DoedaySelectvalue != null) {
        this.doestring = this.DoeYearSelect + "-" + this.DoeMonthSelect + "-" + DoedaySelectvalue;
      } else if (monthvalue == null && DoedaySelectvalue == null) {
        this.doestring = this.DoeYearSelect + "-" + this.DoeMonthSelect + "-" + this.DoedaySelect;
      }
      if (this.doestring! < this.doemin) {
        this.doeError = true;
        this.RegistrationForm.patchValue({ 'DOE': null });
      } else {
        this.doeError = false;
        this.RegistrationForm.patchValue({ 'DOE': this.doestring });
      }
      console.log(this.doestring);
    }

    if (this.DoeMonthSelect == 1 || this.DoeMonthSelect == 3 || this.DoeMonthSelect == 5 || this.DoeMonthSelect == 7 || this.DoeMonthSelect == 8 || this.DoeMonthSelect == 10 || this.DoeMonthSelect == 12) {

      if (!this.doedayslistArray.includes(28)) { this.doedayslistArray.push(28) }
      if (!this.doedayslistArray.includes(29)) { this.doedayslistArray.push(29) }
      if (!this.doedayslistArray.includes(30)) { this.doedayslistArray.push(30) }
      if (!this.doedayslistArray.includes(31)) { this.doedayslistArray.push(31) }

    }

    else if (this.DoeMonthSelect != 2 && this.DoeMonthSelect == 4 || this.DoeMonthSelect == 6 || this.DoeMonthSelect == 9 || this.DoeMonthSelect == 11) {

      if (!this.doedayslistArray.includes(28)) { this.doedayslistArray.push(28) }
      if (!this.doedayslistArray.includes(29)) { this.doedayslistArray.push(29) }
      if (!this.doedayslistArray.includes(30)) { this.doedayslistArray.push(30) }

      var lastindex = this.doedayslistArray.length - 1;
      if (this.doedayslistArray.includes(31)) { this.doedayslistArray.splice(lastindex, 1) }

      // this.dayslistArray.sort((a,b) => (a > b ? 1 : -1));
      if (this.DoedaySelect == 31) {
        this.DoedaySelect = null;
        //sb.style.color = 'red'
      }

    }

    else if (this.DoeMonthSelect == 2) {
      if (this.DoeYearSelect != null) {
        if (check) {

          if (!this.doedayslistArray.includes(28)) { this.doedayslistArray.push(28) }
          if (!this.doedayslistArray.includes(29)) { this.doedayslistArray.push(29) }

          var lastindex = this.doedayslistArray.length - 1;
          if (this.doedayslistArray.includes(31)) { this.doedayslistArray.splice(lastindex, 1) }

          var lastindex = this.doedayslistArray.length - 1;
          if (this.doedayslistArray.includes(30)) { this.doedayslistArray.splice(lastindex, 1) }

          if (this.DoedaySelect == 30 || this.DoedaySelect == 31) {
            this.DoedaySelect = null;
           // sb.style.color = 'red'
          }
        }
        else {
          if (!this.doedayslistArray.includes(28)) { this.doedayslistArray.push(28) }

          var lastindex = this.doedayslistArray.length - 1;
          if (this.doedayslistArray.includes(31)) { this.doedayslistArray.splice(lastindex, 1) }

          var lastindex = this.doedayslistArray.length - 1;
          if (this.doedayslistArray.includes(30)) { this.doedayslistArray.splice(lastindex, 1) }

          var lastindex = this.doedayslistArray.length - 1;
          if (this.doedayslistArray.includes(29)) { this.doedayslistArray.splice(lastindex, 1) }

          if (this.DoedaySelect == 29 || this.DoedaySelect == 30 || this.DoedaySelect == 31) {
            this.DoedaySelect = null;
            //sb.style.color = 'red'
          }
        }
      }
      else {
        if (!this.doedayslistArray.includes(28)) { this.doedayslistArray.push(28) }
        var lastindex = this.doedayslistArray.length - 1;
        if (this.doedayslistArray.includes(31)) { this.doedayslistArray.splice(lastindex, 1) }
        var lastindex = this.doedayslistArray.length - 1;
        if (this.doedayslistArray.includes(30)) { this.doedayslistArray.splice(lastindex, 1) }
        var lastindex = this.doedayslistArray.length - 1;
        if (this.doedayslistArray.includes(29)) { this.doedayslistArray.splice(lastindex, 1) }

        if (this.DoedaySelect == 29 || this.DoedaySelect == 30 || this.DoedaySelect == 31) {
          this.DoedaySelect = null;
         // sb.style.color = 'red'
        }
      }
    }
  }

  issueSelectionchange() {
    debugger
    const sb = document.querySelector('#issuedayslist') as HTMLSelectElement;

    // if (this.issuedaySelect != null) {
    //   sb.style.color = '#354F52'
    // }

    this.RegistrationForm.patchValue({ 'Issuedate': null })
    debugger
    //days
    if (this.issueYearSelect != null) {
      var check = this.leapYear(this.issueYearSelect)
    }

    if (this.issuedaySelect != null && this.issueMonthSelect != null && this.issueYearSelect != null) {
      if (this.issueMonthSelect.toString().length == 1) {
        var monthvalue = "0" + this.issueMonthSelect
      }
      if (this.issuedaySelect.toString().length == 1) {
        var issuedaySelectvalue = "0" + this.issuedaySelect;
      }
      if (monthvalue != null && issuedaySelectvalue != null) {
        this.issuestring = this.issueYearSelect + "-" + monthvalue + "-" + issuedaySelectvalue;
      } else if (monthvalue != null && issuedaySelectvalue == null) {
        this.issuestring = this.issueYearSelect + "-" + monthvalue + "-" + this.issuedaySelect;
      } else if (monthvalue == null && issuedaySelectvalue != null) {
        this.issuestring = this.issueYearSelect + "-" + this.issueMonthSelect + "-" + issuedaySelectvalue;
      } else if (monthvalue == null && issuedaySelectvalue == null) {
        this.issuestring = this.issueYearSelect + "-" + this.issueMonthSelect + "-" + this.issuedaySelect;
      }
      if (this.issuestring! > this.issuemax) {
        this.IssueError = true;
        this.RegistrationForm.patchValue({ 'Issuedate': null });
      }
      else {
        this.IssueError = false;
        this.RegistrationForm.patchValue({ 'Issuedate': this.issuestring });
      }
      console.log(this.issuestring);
    }

    if (this.issueMonthSelect == 1 || this.issueMonthSelect == 3 || this.issueMonthSelect == 5 || this.issueMonthSelect == 7 || this.issueMonthSelect == 8 || this.issueMonthSelect == 10 || this.issueMonthSelect == 12) {

      if (!this.issuedayslistArray.includes(28)) { this.issuedayslistArray.push(28) }
      if (!this.issuedayslistArray.includes(29)) { this.issuedayslistArray.push(29) }
      if (!this.issuedayslistArray.includes(30)) { this.issuedayslistArray.push(30) }
      if (!this.issuedayslistArray.includes(31)) { this.issuedayslistArray.push(31) }

    }

    else if (this.issueMonthSelect != 2 && this.issueMonthSelect == 4 || this.issueMonthSelect == 6 || this.issueMonthSelect == 9 || this.issueMonthSelect == 11) {

      if (!this.issuedayslistArray.includes(28)) { this.issuedayslistArray.push(28) }
      if (!this.issuedayslistArray.includes(29)) { this.issuedayslistArray.push(29) }
      if (!this.issuedayslistArray.includes(30)) { this.issuedayslistArray.push(30) }

      var lastindex = this.issuedayslistArray.length - 1;
      if (this.issuedayslistArray.includes(31)) { this.issuedayslistArray.splice(lastindex, 1) }

      // this.dayslistArray.sort((a,b) => (a > b ? 1 : -1));
      if (this.issuedaySelect == 31) {
        this.issuedaySelect = null;
       // sb.style.color = 'red'
      }

    }

    else if (this.issueMonthSelect == 2) {
      if (this.issueYearSelect != null) {
        if (check) {

          if (!this.issuedayslistArray.includes(28)) { this.issuedayslistArray.push(28) }
          if (!this.issuedayslistArray.includes(29)) { this.issuedayslistArray.push(29) }

          var lastindex = this.issuedayslistArray.length - 1;
          if (this.issuedayslistArray.includes(31)) { this.issuedayslistArray.splice(lastindex, 1) }

          var lastindex = this.issuedayslistArray.length - 1;
          if (this.issuedayslistArray.includes(30)) { this.issuedayslistArray.splice(lastindex, 1) }

          if (this.issuedaySelect == 30 || this.issuedaySelect == 31) {
            this.issuedaySelect = null;
           // sb.style.color = 'red'
          }
        }
        else {
          if (!this.issuedayslistArray.includes(28)) { this.issuedayslistArray.push(28) }

          var lastindex = this.issuedayslistArray.length - 1;
          if (this.issuedayslistArray.includes(31)) { this.issuedayslistArray.splice(lastindex, 1) }

          var lastindex = this.issuedayslistArray.length - 1;
          if (this.issuedayslistArray.includes(30)) { this.issuedayslistArray.splice(lastindex, 1) }

          var lastindex = this.issuedayslistArray.length - 1;
          if (this.issuedayslistArray.includes(29)) { this.issuedayslistArray.splice(lastindex, 1) }

          if (this.issuedaySelect == 29 || this.issuedaySelect == 30 || this.issuedaySelect == 31) {
            this.issuedaySelect = null;
           // sb.style.color = 'red'
          }
        }
      }
      else {
        if (!this.issuedayslistArray.includes(28)) { this.issuedayslistArray.push(28) }
        var lastindex = this.issuedayslistArray.length - 1;
        if (this.issuedayslistArray.includes(31)) { this.issuedayslistArray.splice(lastindex, 1) }
        var lastindex = this.issuedayslistArray.length - 1;
        if (this.issuedayslistArray.includes(30)) { this.issuedayslistArray.splice(lastindex, 1) }
        var lastindex = this.issuedayslistArray.length - 1;
        if (this.issuedayslistArray.includes(29)) { this.issuedayslistArray.splice(lastindex, 1) }

        if (this.issuedaySelect == 29 || this.issuedaySelect == 30 || this.issuedaySelect == 31) {
          this.issuedaySelect = null;
          //sb.style.color = 'red'
        }
      }
    }
  }


  RegisterUser() {
    debugger
    if (this.loginresponse == null) {
      this.SaveRegistrationInfo();
      // if(!this.loginresponse.isIdCardExpire){
      this._router.navigateByUrl('/register/Validatethedetails');
      // }
    }
    else {
      this.SaveIdCardUpdateInfo();
      this.common.presentLoading();
      debugger;
      this.auth.SaveIdCard(this.auth.accessToken, this.auth.IdCardObject).then((data: any) => {
        debugger;
        if (data?.response?.code == 1) {
          this.common.hideLoading();
          this.common.Set('User', JSON.stringify(this.auth.data));
          this.common.Set('token', data.response.token);
          this.kyc.count = 0;
          this.kyc.GetKycStatus(this.auth.accessToken, this.auth.data.onBoardingAccount ? this.auth.data.onBoardingAccount.productId : 1).then(async (data: any) => {
            if (data.response) {
              if (data.response.code) {
                if (data.response.code == 1) {
                  //  this.country.countries=data.response.content;

                  if (this.kyc.totalCount > 0) {
                    let nextscreen = this.kyc.getScreen(this.kyc.count);
                    debugger;
                    // if (nextscreen == "CrsFatcaDeclaration") 
                    // {
                    //   this.common.hideLoading();
                    //   console.log(nextscreen);
                    // } 
                    // else {
                    this.common.hideLoading();
                    this._router.navigateByUrl("/register/" + nextscreen);
                    // }
                  }
                  //   this.navCtrl.push(this.kyc.getScreen(this.kyc.count));
                  else {
                    this.common.ParseErrorAlert('', '', this._router, data);
                  }
                }
                else {
                  this.common.ParseErrorAlert('', '', this._router, data);
                }
              }
              else {
                this.common.ParseErrorAlert('', '', this._router, data);
              }
            }
            else {
              this.common.ParseErrorAlert('', '', this._router, data);
            }
          })
        }
        else {
          this.common.hideLoading();
          this.common.ParseErrorAlert("", "", this._router, data);
        }
      });
    }
  }

  Savedolater() {

    // this.common.showDoLaterAlert(this._router).then((data) => {
    //   if(data == "Logout"){
    //     this.SaveRegistrationInfo();
    //     this.common.presentLoading();
    //     debugger;
    //     this.auth.Register().then((data : any) =>{
    //       if (data?.response?.code == 1) {
    //         this.common.hideLoading();
    //         this.common.clear();
    //         this._router.navigateByUrl('/login');
    //       }
    //       else{
    //         this.common.hideLoading();
    //         this.common.ParseErrorAlert("","",this._router,data.message);
    //       }
    //     });
    //   }
    // });
  }

  SaveRegistrationInfo(): void {

    var object = this.auth.registrationObject;

    this.dob = this.RegistrationForm.get('DOB').value;
    this.doe = this.RegistrationForm.get('DOE').value;
    this.issuedate = this.RegistrationForm.get('Issuedate').value;
    // this.dobsplit = this.dob.split('T');
    // this.doesplit = this.doe.split('T');
    // this.issuedatesplit = this.issuedate.split('T');

    if (this.RegistrationForm.get('MiddleName').value == null) {
      this.fullname = this.RegistrationForm.get('FirstName').value + " " + this.RegistrationForm.get('LastName').value;
    } else {
      this.fullname = this.RegistrationForm.get('FirstName').value + " " + this.RegistrationForm.get('MiddleName').value + " " + this.RegistrationForm.get('LastName').value;
    }

    object.documentCode = "Id";
    object.frontCardImage = this.Idfrontbase64;
    object.backCardImage = this.Idbackbase64;
    object.firstName = this.RegistrationForm.get('FirstName').value;
    object.documentNumber = this.RegistrationForm.get('IDNumber').value;
    object.middleName = this.RegistrationForm.get('MiddleName').value;
    object.familyName = this.RegistrationForm.get('LastName').value;
    object.gender = this.RegistrationForm.get('Gender').value;
    object.dOB = this.dob;
    object.dOE = this.doe;
    object.issuer = "PAK";
    object.issuedate = this.issuedate;
    object.fullName = this.fullname;
    object.mrtdraw = ""
    object.optionalData1 = ""
    object.optionalData2 = ""
    object.fireBaseToken = ""
    object.personFaceImage = ""
    object.companyId = 1;

    if (this.loginresponse != null) {
      object.personFaceImage = this.loginresponse.personFaceImage;
    }

    object.countryID = "PAK";
    object.nationality = "PAK";
    // object.type = "C";
  }

  SaveIdCardUpdateInfo(): void {

    var object = this.auth.IdCardObject;

    this.dob = this.RegistrationForm.get('DOB').value;
    this.doe = this.RegistrationForm.get('DOE').value;
    this.issuedate = this.RegistrationForm.get('Issuedate').value;
    // this.dobsplit = this.dob.split('T');
    // this.doesplit = this.doe.split('T');
    // this.issuedatesplit = this.issuedate.split('T');

    if (this.RegistrationForm.get('MiddleName').value == null) {
      this.fullname = this.RegistrationForm.get('FirstName').value + " " + this.RegistrationForm.get('LastName').value;
    } else {
      this.fullname = this.RegistrationForm.get('FirstName').value + " " + this.RegistrationForm.get('MiddleName').value + " " + this.RegistrationForm.get('LastName').value;
    }

    object.documentCode = "Id";
    object.frontCardImage = this.Idfrontbase64;
    object.backCardImage = this.Idbackbase64;
    object.firstName = this.RegistrationForm.get('FirstName').value;
    object.documentNumber = this.RegistrationForm.get('IDNumber').value;
    object.middleName = this.RegistrationForm.get('MiddleName').value;
    object.familyName = this.RegistrationForm.get('LastName').value;
    object.gender = this.RegistrationForm.get('Gender').value;
    object.dOB = this.dob;
    object.dOE = this.doe;
    object.issuer = "PAK";
    object.issuedate = this.issuedate;
    object.fullName = this.fullname;
    object.mrtDraw = ""
    object.optionalData1 = ""
    object.optionalData2 = ""
    object.fireBaseToken = ""
    object.personFaceImage = ""
    object.companyId = 1;

    if (this.loginresponse != null) {
      object.personFaceImage = this.loginresponse.personFaceImage;
    }

    object.countryID = "PAK";
    object.nationality = "PAK";
    object.type = "C";
  }

  RemoveFunction() {
    this.RegistrationForm.patchValue({ 'IdFront': null })
  }
  RemoveFunction1() {
    this.RegistrationForm.patchValue({ 'IdBack': null })
  }
}
