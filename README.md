# csg-events
Simple event publish/subscription manager

## License

MIT

## Dependencies

None

## Usage

### Event Object

```js
import { Event } from "csg-eventjs";

var event = new Event();
var sub = event.subscribe(function(msg){
    console.log(msg)
});

// logs Hello World!
event.dispatch(["Hello World!"]);
// un-subscribe from the event.
sub.dispose();
// nothing will be logged
event.dispatch(["Won't See Me!"]);
```

- subscribe(callback): 

    Invokes the given callback whenever dispatch() is invoked on the event. Returns an EventSubscription.

- unsubscribe(callback)

    Unsubscribes the given callback from the event.

- dispatch(thisArg, arrArgs)
    
    Invokes all callbacks attached to the event via subscribe()

### Event Subscription

- dispose()

    Removes the subscription from the event it was added to. (Same as calling unsbuscribe on the Event).
