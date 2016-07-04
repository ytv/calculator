$(function() {
    Calc.init();
});

var Calc = {
    mem: '',
    lastClick: '',
    nextOp: 'eq',
    needScnClr: false,
    opKeys: ['div', 'mul', 'min', 'plus', 'eq'],
    numKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'dot'],
    init: function() {
        this._bindBtns();
    },
    _bindBtns: function() {
        // binds number, '.' and 'CE' buttons to update screen function
        for(var i = 0; i < this.numKeys.length; i++) {
            $('#btn-' + Calc.numKeys[i]).on('click', function(numKey) {
              return function() {
                $('#btn-CE').html('CE');
                if(Calc.lastClick === 'op') {
                    Calc._updateScreen(numKey, true);
                    Calc.lastClick = '';
                } else {
                    Calc._updateScreen(numKey, false);
                }
            }
          }(Calc.numKeys[i]));
        }
        // binds operation buttons
        for(var i = 0; i < Calc.opKeys.length; i++) {
            // console.log('#btn-' + Calc.opKeys[i]);
            $('#btn-' + Calc.opKeys[i]).on('click', function(num) {
              return function() {
                if(Calc.mem === '') {
                    Calc._storeInMem();
                    Calc.nextOp = $('#btn-' + Calc.opKeys[num]).val();
                    Calc.lastClick = 'op';
                } else if (Calc.lastClick === 'op') {
                    Calc.nextOp = $('#btn-' + Calc.opKeys[num]).val();
                } else {
                    var ans = 0;
                    switch(Calc.nextOp) {
                        case 'plus':
                            ans = Calc.mem + Number($('#display').text());
                            break;
                        case 'min':
                            ans = Calc.mem - Number($('#display').text());
                            break;
                        case 'mul':
                            ans = Calc.mem * Number($('#display').text());
                            break;
                        case 'div':
                            ans = Calc.mem / Number($('#display').text());
                            break;
                    }
                    Calc._updateScreen(ans.toString(), true);
                    var nextOp = $('#btn-' + Calc.opKeys[num]).val();
                    if(nextOp === 'eq') {
                        Calc.mem = '';
                        Calc.nextOp = 'eq';
                    } else {
                        Calc.mem = Number($('#display').text());
                        Calc.nextOp = nextOp;
                    }
                    Calc.lastClick = 'op';
                }
            }
          }(i));
        }
        $('#btn-per').on('click', function() {
          var display = Number($('#display').text())/100;
          $('#display').html(display);
        });
        // AC clears the screen and resets the memory
        $('#btn-AC').on('click', function() {
          $('.error').html('');
          Calc.mem = '';
          Calc.lastClick = '';
          Calc.nextOp = 'eq';
          Calc._updateScreen('0', true);
        });
        // CE "backspaces" the display.
        $('#btn-CE').on('click', function() {
          $('.error').html('');
          var display = $('#display').text().slice(0, -1);
          if (display === "")
              $('#display').html('0');
          else
              $('#display').html(display);
        });
    },
    _updateScreen: function(x, clearFirst) {
        // check length of number of the display or answer to be displayed
        x = this._checkLength(x);
        // clears display first if display is 0 or clearFirst is set to true
        if(($('#display').text() === '0') || (clearFirst === true)) {
            if(x === 'dot')
                $('#display').html('0.');
            else
                $('#display').html(x);
        // errors if 14 digits are already displayed and more numbers already
        // attempting to be added
        } else if ($('#display').text().length >= 14) {
            $('.error').html('Error: too many numbers');
        } else {
            if(x === 'dot')
                $('#display').append('.');
            else
                $('#display').append(x);
        }
    },
    _storeInMem: function() {
        this.mem = Number($("#display").text());
    },
    _checkLength: function(x) {
        if(x.length <= 14)
            return x;
        else if (x.slice(0,14) > Number(x) - 1)
            return x.slice(0,14);
        else
            return 'Err: # too large';
    }
};
