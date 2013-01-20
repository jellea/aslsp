var sixhundred = sixhundred || (function ($) {

    var Utils = {}, // Your Toolbox
    Ajax = {}, // Your Ajax Wrapper
    Events = {}, // Event-based Actions
    App = {}, // Your Global Logic and Initializer
    Public = {}; // Your Public Functions

    Utils = {
        settings: {
            debug: true,
            meta: {},
            init: function () {

                $('meta[name^="app-"]').each(function () {
                    Utils.settings.meta[this.name.replace('app-', '')] = this.content;
                });

            }
        },
        cache: {
            window: window,
            document: document
        },
        home_url: function (path) {
            if (typeof path == "undefined") {
                path = '';
            }
            return Utils.settings.meta.homeURL + path + '/';
        },
        log: function (what) {
            if (Utils.settings.debug) {
                console.log(what);
            }
        }
    };
    var _log = Utils.log;

    Ajax = {
        ajaxUrl: Utils.home_url('ajax'),
        send: function (type, method, data, returnFunc) {
            $.ajax({
                type: 'POST',
                url: Ajax.ajaxUrl + method,
                dataType: 'json',
                data: data,
                success: returnFunc
            });
        },
        call: function (method, data, returnFunc) {
            Ajax.send('POST', method, data, returnFunc);
        },
        get: function (method, data, returnFunc) {
            Ajax.send('GET', method, data, returnFunc);
        }
    };

    Events = {
        endpoints: {},
        bindEvents: function () {

            $('[data-event]').each(function () {
                var _this = this,
                    method = _this.dataset.method || 'click',
                    name = _this.dataset.event,
                    bound = _this.dataset.bound;

                if (!bound) {
                    Utils.parseRoute({
                        path: name,
                        target: Events.endpoints,
                        delimiter: '.',
                        parsed: function (res) {
                            if (res.exists) {
                                _this.dataset.bound = true;
                                $(_this).on(method, function (e) {
                                    res.obj.call(_this, e);
                                });
                            }
                        }
                    });
                }
            });

        },
        init: function () {
            Events.bindEvents();
        }
    };

    App = {
        logic: {},
        init: function () {

            Utils.settings.init();
            Events.init();
            window.onload = function () {
              MIDI.loadPlugin({
                soundfontUrl: "./soundfont/",
                instruments: [ "acoustic_grand_piano"], // or multiple instruments
                callback: function() {
                  MIDI.programChange(0, 0);
                  MIDI.programChange(1, 118);
                  for (i in aslsp){
                    for (x in aslsp[i]){
                      console.log(i);
                      if (aslsp[i][x]['v'] == 0){
                        MIDI.noteOff(0, aslsp[i][x]['n'], i/1000);
                      }else{
                        MIDI.noteOn(0, aslsp[i][x]['n'], aslsp[i][x]['v'], i/1000);
                      }
                    }
                  }
                }
              });
            };
        }
    };

    Public = {
        init: App.init
    };

    return Public;

})(window.jQuery);

jQuery(document).ready(sixhundred.init);
