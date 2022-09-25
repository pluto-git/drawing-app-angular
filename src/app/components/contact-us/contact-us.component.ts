import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Feedback } from 'src/app/models/feedback.model';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {

  contactUsForm!: FormGroup;

  feedback: Feedback = {
    firstName: '',
    email: '',
    subject: '',
    message: ''
  };

  feedbacks?: Feedback[];
  isSuccess: boolean = false;
  selectOption: boolean = false;

  constructor(private feedbackSvc: FeedbackService) {
  }

  ngOnInit(): void {

    this.contactUsForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
    this.selectOption = true;
  }

  ngAfterViewInit(): void {
    this.selectOption = true;
  }
  ngDoCheck(): void {
    this.selectOption = true;
  }

  get firstName() {
    return this.contactUsForm.get('firstName');
  }
  get email() {
    return this.contactUsForm.get('email');
  }
  get subject() {
    return this.contactUsForm.get('subject');
  }
  get message() {
    return this.contactUsForm.get('message');
  }

  onSubmit(): void {
    // TODO: Use EventEmitter with form value
    this.saveFeedback(this.contactUsForm.value);
    //this.retrieveFeedbacks();
  }

  private saveFeedback(data: Feedback = {
    firstName: 'DefaultName',
    email: 'DefaultEmail',
    subject: 'DefaultSubject',
    message: 'DefaultMessage'
  }): void {

    this.feedbackSvc.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.ClearFeedbackForm();
        },
        error: (e) => console.error(e)
      });
  }

  private ClearFeedbackForm(): void {
    this.contactUsForm.reset();
    //show Successfully
    this.isSuccess = true;
    const debounceTime = 3000;// in ms before success text is hidden

    let timer!: ReturnType<typeof setTimeout>;
    if (timer) { clearTimeout(timer); }
    timer = setTimeout((() => {
      this.isSuccess = false
    }).bind(this), debounceTime);

  }



  //to retrieve all feedbacks.
  // private retrieveFeedbacks(): void {
  //   this.feedbackSvc.getAll()
  //     .subscribe({
  //       next: (data) => {
  //         this.feedbacks = data;
  //         console.log(data);
  //       },
  //       error: (e) => console.error(e)
  //     });
  // }



}
