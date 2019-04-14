import { Component, OnInit } from '@angular/core';

import { ErrorHandler, Injectable } from '@angular/core';
@Component({
  selector: 'app-error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.css']
})
export class ErrorHandlerComponent implements ErrorHandler {
  handleError(error) {
    //console.log(error);
    const message = error.message ? error.message : error.toString();
    //throw message;
  }
}
