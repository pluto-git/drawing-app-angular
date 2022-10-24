import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/data-access/services/auth.service';
import { Feedback } from '../../data-access/services/feedback.model';
import { FeedbackService } from '../../data-access/services/feedback.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  public contactUsForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  public feedback: Feedback = {
    firstName: '',
    email: '',
    subject: '',
    message: ''
  };

  public feedbacks?: Feedback[];
  public isSuccess: boolean = false;
  public selectOption: boolean = true;


  constructor(private feedbackSvc: FeedbackService) {

  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    if (this.contactUsForm.dirty) {
      event!.preventDefault();
      this.canExit();
      event!.returnValue = false;
    }
  }

  ngOnInit(): void {
    
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
    this.contactUsForm.markAsPristine();
    //this.retrieveFeedbacks();
  }

  private saveFeedback(data: Feedback): void {

    this.feedbackSvc.create(data)
      .subscribe({
        next: () => {
          this.ClearFeedbackForm();
        },
        error: (e: Event) => console.error(e)
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

  canExit(): boolean {

    if (confirm("Form data will be lost. Leave?")) {
      return true
    } else {
      return false
    }
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
