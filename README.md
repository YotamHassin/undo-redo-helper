# undo-redo-helper

Undo Redo That Helper, control your value timeLine (past-future).

**ValueTimeLineSimple** is open for any type, and have few simple oprations, get-set(value), undo(isUndo), redo(isRedo), timeLine(past[], future[]). 

**ValueTimeLineWrapper** is like the simple version, but have encpsulated RxJs abilities (BehaviorSubject), such as Subscribe, trigger, pipe, and so on and so forth and what have you not. 

* [Installation](#installation)

* [Usage](#usage)
  + [TypeScript](#typescript)
    - [TS ValueTimeLineSimple](#ts-ValueTimeLine-Simple)
    - [TS ValueTimeLineWrapper](#ts-ValueTimeLine-Wrapper)
  + [JavaScript](#javascript)
    - [JS Value TimeLine Simple](#js-ValueTimeLine-Simple)
    - [JS Value TimeLine Wrapper](#js-ValueTimeLine-Wrapper)

* [Join Me](#join-me-on-the-quest-to-make-computer-software-and-development-simple)

### [npmjs/undo-redo-helper](https://www.npmjs.com/package/undo-redo-helper)

### [github/YotamHassin/undo-redo-helper](https://github.com/YotamHassin/undo-redo-helper)

## Installation

``` sh
cd <my_location>
npm install undo-redo-helper --save
```

## Usage

### TypeScript

### TS ValueTimeLine Simple

``` typescript
import { ValueTimeLineSimple } from "undo-redo-helper";

// if not undefined => add as first value (last undo is always undefined).
let stateHistory = new ValueTimeLineSimple<number|undefined>(undefined);

// value 1
stateHistory.value = 1;

// will add undefined to history(in ctor undefined will not add)
stateHistory.value = undefined;

console.log('timeLine, value change', stateHistory.value, stateHistory.timeLine);

// undo array, add undo options 3, 4.
stateHistory.timeLine.past.push(...[3, 4]);

// timeLine change.
// timeLine.past change => value change.
console.log('timeLine.past change, value change', stateHistory.value, stateHistory.timeLine);

// redo array, add redo options, no need to fireEventHandler
stateHistory.timeLine.future = [5, 6, 7];
	
// redo (after undo, or by timeLine.future);
stateHistory.redo();

console.log('timeLine.future + redo, value change', stateHistory.value);

// go back.
stateHistory.undo();

//stateHistory.redo();
console.log('stateHistory.timeLine - past-future', stateHistory.value, stateHistory.timeLine);

```

### TS ValueTimeLine Wrapper

``` typescript
import { ValueTimeLineWrapper } from "undo-redo-helper";
import { getLog } from "myy-common";
import { map } from "rxjs/operators";

// if not undefined => add as first value (last undo is always undefined).
// trigger 0
//let stateHistory = new ValueTimeLineWrapper(undefined, val => { getLog('stateHistory.eventHandler init test:')(val); });
let stateHistory = new ValueTimeLineWrapper(undefined, getLog('stateHistory.eventHandler init test:'));

// will trigger also on Ctor.
stateHistory._subscribe(getLog('stateHistory.eventHandler _subscribe test:'));
    
// line brake
stateHistory.subscribe(x => console.log());

// trigger 1
stateHistory.value = 1;

// will add undefined to history(in ctor undefined will not add)
stateHistory.value = undefined;

// trigger custom change.
stateHistory.fireEventHandler('my custom action', 2);

// not-trigger, undo array, add undo options 3, 4.
// to trigger 4 (last) use fireEventHandler
stateHistory.timeLine.past.push(...[3, 4]);

// timeLine change => no trigger.
// timeLine.past change => value change.
console.log('timeLine.past change, value change, no trigger', 
	stateHistory.value);

// update Observable by past array, trigger 4 (last from timeLine.past).
stateHistory.fireEventHandler('past.push');

// pipe source to make calced data.
stateHistory.e.pipe(map(x => 'last num is: ' + x))
	.subscribe(getLog('stateHistory simple pipe test:'));

stateHistory._e.pipe(map(x => JSON.stringify(x)))
	.subscribe(getLog('stateHistory complex pipe test:'));

// line brake
stateHistory.subscribe(x=> console.log());

// redo array, add redo options, no need to fireEventHandler
stateHistory.timeLine.future = [5, 6, 7];
	
// redo (after undo, or by timeLine.future);
stateHistory.redo();

// go back and trigger all subscribers.
stateHistory.undo();
//stateHistory.undo();

console.log('stateHistory.timeLine - past-future', stateHistory.timeLine);

```

### JavaScript

### JS ValueTimeLine Simple

``` javascript

const { ValueTimeLineSimple } = require('undo-redo-helper');

// if not undefined => add as first value (last undo is always undefined).
// value 0
let stateHistory = new ValueTimeLineSimple(undefined);

// value 1
stateHistory.value = 1;

// will add undefined to history(in ctor undefined will not add)
stateHistory.value = undefined;

// undo array, add undo options 3, 4.
stateHistory.timeLine.past.push(...[3, 4]);

// timeLine change.
// timeLine.past change => value change.
console.log('timeLine.past change, value change',
	stateHistory.value);

// redo array, add redo options, no need to fireEventHandler
stateHistory.timeLine.future = [5, 6, 7];

// redo (after undo, or by timeLine.future);
stateHistory.redo();

console.log('timeLine.future + redo, value change',
	stateHistory.value);

// go back.
stateHistory.undo();

console.log('stateHistory.timeLine - past-future', stateHistory.value, stateHistory.timeLine);

```

### JS ValueTimeLine Wrapper

``` javascript
const { ValueTimeLineWrapper } = require('undo-redo-helper');
const { getLog } = require('myy-common');
const { map } = require('rxjs/operators');

// if not undefined => add as first value (last undo is always undefined).
// trigger 0
let stateHistory = new ValueTimeLineWrapper(undefined, getLog('stateHistory.eventHandler init test:'));

// will trigger also on Ctor.
stateHistory._subscribe(getLog('stateHistory.eventHandler _subscribe test:'));
// line brake
stateHistory.subscribe(x => console.log());

// trigger 1
stateHistory.value = 1;

// will add undefined to history(in ctor undefined will not add)
stateHistory.value = undefined;

// trigger custom change.
stateHistory.fireEventHandler('my custom action', 2);

// not-trigger, undo array, add undo options 3, 4.
// to trigger 4 (last) use fireEventHandler
stateHistory.timeLine.past.push(...[3, 4]);

// timeLine change => no trigger.
// timeLine.past change => value change.
console.log('timeLine.past change, value change, no trigger',
	stateHistory.value);

// update Observable by past array, trigger 4 (last from timeLine.past).
stateHistory.fireEventHandler('past.push');

// pipe source to make calced data.
stateHistory.e.pipe(map(x => 'last num is: ' + x))
	.subscribe(getLog('stateHistory simple pipe test:'));

stateHistory._e.pipe(map(x => JSON.stringify(x)))
	.subscribe(getLog('stateHistory complex pipe test:'));
// line brake
stateHistory.subscribe(x => console.log());

// redo array, add redo options, no need to fireEventHandler
stateHistory.timeLine.future = [5, 6, 7];

// redo (after undo, or by timeLine.future);
stateHistory.redo();

// go back and trigger all subscribers.
stateHistory.undo();

console.log('stateHistory.timeLine - past-future', stateHistory.timeLine);

```

## Join me on the quest to make Computer, Software and Development Simple. 

## [Patreon/YotamHassin](https://www.patreon.com/YotamHassin)
