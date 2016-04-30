/// <reference path="http://code.jquery.com/qunit/qunit-1.14.0.js" />
/// <reference path="../src/csg-event.js" />

QUnit.test('event messages work', function (assert) {
    expect(23);
    
    var event = new csg.Event();
    var callcount = 0;
    var context = {};

    assert.strictEqual(typeof event.subscribe, 'function');
    assert.strictEqual(typeof event.unsubscribe, 'function');
    assert.strictEqual(typeof event.dispatch, 'function');

    var sub1 = event.subscribe(function () {
        assert.strictEqual(this, context);
        assert.strictEqual(arguments.length, 3);
        assert.strictEqual(arguments[0], 1);
        assert.strictEqual(arguments[1], 2);
        assert.strictEqual(arguments[2], 3);
        callcount++;
    });

    var sub2 = event.subscribe(function () {
        assert.strictEqual(this, context);
        assert.strictEqual(arguments.length, 3);
        assert.strictEqual(arguments[0], 1);
        assert.strictEqual(arguments[1], 2);
        assert.strictEqual(arguments[2], 3);
        callcount++;
    });

    assert.strictEqual(typeof sub1, 'object');
    assert.strictEqual(typeof sub1.dispose, 'function');

    event.dispatch(context, [1, 2, 3]);
    assert.strictEqual(callcount, 2);
    sub1.dispose();

    event.dispatch(context, [1, 2, 3]);
    assert.strictEqual(callcount, 3);

    event.dispose();
    event.dispatch(context, [1, 2, 3]);
    assert.strictEqual(callcount, 3);

});
