import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";
import {Info} from "../../Info";
import * as AppComp from "../app.component"

@Component({
  selector: 'app-form-lobby',
  templateUrl: './form-lobby.component.html',
  styleUrls: ['./form-lobby.component.scss'],
})

export class FormLobbyComponent implements OnInit {
  @Output() isClickBtn = new EventEmitter<any>();
  @Output() onFormChanged = new EventEmitter<any>();
  @Output() outputInfo= new EventEmitter<any>();
  tittle = 'Создать игру';
  flag = true;
//  stompClient: any;
  disabled = true;
  greetings: string[] = [];
  name!: string;

  constructor() {
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }

  form!: FormGroup;
  btnInEnabled = false;
  btnCreateEnabled = false;

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(),
      idGame: new FormControl(),
    })
    this.form.valueChanges.subscribe(x => {

      this.btnCreateEnabled = x.name;
      this.btnInEnabled = x.name && (x.idGame || x.idGame ===0);
    });
  }

  create() {
    let info = new Info("none", this.form.value.name);
    this.isClickBtn.emit(info);
    this.onFormChanged.emit("info")
    // AppComp.setForm(this);
    // AppComp.create();
  }

  join() {
    let info = new Info(this.form.value.idGame, this.form.value.name);
    let xhr = new XMLHttpRequest();

    xhr.onload = () =>{
      if(xhr.status===200){
        this.isClickBtn.emit(info);
        this.onFormChanged.emit("info")
      } else {
        alert("Такого лобби не существует")
      }
    }
    xhr.open("GET", `http://localhost:8080/lobby.check?id=${this.form.value.idGame}`)

    xhr.send()
    // AppComp.setForm(this);
    // AppComp.join();
  }
}
