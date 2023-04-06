import 'zone.js/dist/zone';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { forkJoin, ReplaySubject, Subject, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="clickSource()">Click Source</button>
    <button (click)="clickReq1()">Click Req 1</button>
    <button (click)="clickReq2()">Click Req 2</button>  
    <button (click)="clickLoading()">Click Loading</button>
    <button (click)="initReq()">initReq</button>  
    
  `,
})
export class App implements OnInit {
  router = new Subject();
  req1 = new Subject();
  req2 = new Subject();
  loading = new Subject();

  ngOnInit() {
    console.log('Ng On Init');
    this.router
      .pipe(
        tap(() => console.log('source starts')),
        switchMap(() =>
          forkJoin([
            this.req1.asObservable().pipe(tap(console.log)),
            this.req2.asObservable().pipe(tap(console.log)),
          ]).pipe(take(1))
        ),
        tap(() => console.log('after 1st switchMap')),
        switchMap(() => this.loading.asObservable()),
        tap(() => console.log('after 2nd switchMap'))
      )
      .subscribe(
        () => console.log('inside subscribe'),
        () => console.log('inside error'),
        () => console.log('completes')
      );
  }

  clickSource() {
    this.router.next(null);
  }

  clickReq1() {
    this.req1.next('req1');
    this.req1.complete();
  }

  clickReq2() {
    this.req2.next('req2');
    this.req2.complete();
  }

  clickLoading() {
    this.loading.next('loading');
  }

  initReq() {
    this.req1 = new Subject();
    this.req2 = new Subject();
  }
}

bootstrapApplication(App);
