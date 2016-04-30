# csg-events
Simple event publish/subscription manager

## License

MIT

## Dependencies

None

## Usage

### Event Object

new csg.Event()

- subscribe(callback): 

    Invokes the given callback whenever dispatch() is invoked on the event. Returns an EventSubscription.

- unsubscribe(callback)

    Unsubscribes the given callback from the event.

- dispatch(thisArg, arrArgs)
    
    Invokes all callbacks attached to the event via subscribe()

### Event Subscription

- dispose()

    Removes the subscription from the event it was added to. (Same as calling unsbuscribe on the Event).

```html

<script src="csg-event.js"></script>
<script>
    var evt = new csg.Event();

    evt.subscribe(function(message){
        console.log(message);
    });

    evt.dispatch(null, ['Hello World!']);
    // Prints 'Hello World' to the console
</script>

```