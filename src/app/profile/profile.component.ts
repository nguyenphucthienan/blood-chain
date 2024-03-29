import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { environment } from 'src/environments/environment';

import { Point } from '../core/models/point.interface';
import { User } from '../core/models/user.interface';
import { AuthService } from '../core/services/auth.service';
import { ProfileUserQrcodeModalComponent } from './modals/profile-user-qrcode-modal/profile-user-qrcode-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit, OnDestroy {

  readonly defaultPhotoUrl = environment.photoUrl.defaultUser;

  user: User;
  userForm: FormGroup;

  point: Point;
  modalRef: MDBModalRef;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private authService: AuthService,
    private modalService: MDBModalService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'grey-background');
    this.userForm = this.fb.group({
      id: ['', Validators.required],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255)
      ]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      gender: [null, Validators.required],
      birthdate: [null, Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      createdAt: [null, Validators.required],
      location: [null, Validators.required]
    });

    this.authService.getMyUserInfo().subscribe((user: User) => {
      this.user = user;
      this.point = this.user.location;
      this.userForm.patchValue({
        id: this.user._id,
        username: this.user.username,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        gender: this.user.gender,
        birthdate: this.user.birthdate,
        email: this.user.email,
        phone: this.user.phone,
        address: this.user.address,
        createdAt: this.datePipe.transform(new Date(this.user.createdAt)),
        location: this.user.location
      });
    });
  }

  openUserQrCodeModal() {
    if (!this.user) {
      return;
    }

    this.modalRef = this.modalService.show(ProfileUserQrcodeModalComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered',
      containerClass: 'top',
      animated: true,
      data: {
        user: this.user
      }
    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'grey-background');
  }

}
