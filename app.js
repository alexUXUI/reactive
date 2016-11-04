'use strict'

var Rx = require('rxjs')

/**
 * Create a basic observable
 */

var observable = Rx.Observable.create(function subscribe(observer) {
  try {
    observer.next(1)
    observer.next(2)
    observer.next(3)
    observer.complete()
  } catch (err) {
    observer.error(err)
  }
})

/**
 * When observable.subscribe is called, the Observer gets attached to
 * the newly created Observable execution, but also this call returns an object,
 * the Subscription
 * @return { subscription }
 */

observable.subscribe({
  next: streamingData => console.log(`streaming data ${ streamingData }`),
  complete: () => console.log('donezo w/ subscriber one')
})

observable.subscribe({
  next: streamingData => console.log(`doing something differnet w/ same data ${ streamingData }`),
  complete: () => console.log('donezo w/ subscriber two')
})

/**
 * combined with promises, observers are pretty neat!
 */

let prom = new Promise((res, rej) => res('yo'))

let observePromise = Rx.Observable.fromPromise(prom)

let subscribePromise = observePromise.subscribe({
 next: promiseValue => console.log(`got the promise value ${ promiseValue }`)
})

/**
 * You can add subscriptions to each other so that you
 * can treat them as one
 */

let observable1 = Rx.Observable.interval(400)
let observable2 = Rx.Observable.interval(300)

let subscription = observable1.subscribe(x => console.log(`first: ${ x }`))

let childSubscription = observable2.subscribe(x => console.log(`second: ${ x }`))

subscription.add(childSubscription)

setTimeout(() => {
  // Unsubscribes BOTH subscription and childSubscription
  subscription.unsubscribe()
}, 5000)

/**
 * Observables can grab data straight out of arrays, thats nice
 */

let observableFrom = Rx.Observable.from([10, 20, 30, `whatever`, `is`, `clever`])
let subscription2 = observableFrom.subscribe(x => console.log(x))
subscription2.unsubscribe()

/**
 * This example shows that `Subjects`, like observables,
 * can broadcast to many obervables at the same time!
 */

 let subject = new Rx.Subject()

 subject.subscribe({
   next: value => console.log(`observerA: ${ value }`)
 })
 subject.subscribe({
   next: value => console.log(`observerB: ${ value }`)
 })

 subject.next(1)
 subject.next(2)
