
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Ansi = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    // Your existing Ansi class definition here
 class Ansi {
            constructor() {
                this.str = '';
                this.pending = '';
                this.autoReset = true; // Add a flag for automatic reset
            }


            text(str) {
                this.str += this.pending + str;
                this.pending = '';
                return this;
            }


           //Text color functions
            //rgbText:
/*            rgbText(r, g, b) {
                this.pending = `\x1B[38;2;${r};${g};${b}m${this.autoReset ? '\x1B[0m' : ''}`;
                return this;
            }

 */
                rgbText(r, g, b) {
//                    this.pending += `\x1B[38;2;${r};${g};${b}m ${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;${r};${g};${b}m`;
                    return this;
                }

                redText() {
                 //   this.pending = `\x1B[38;2;255;0;0m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;255;0;0m`;
                    return this;
                }

                orangeText() {
                  //  this.pending = `\x1B[38;2;255;128;0m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;255;128;0m`;
                    return this;
                }

                yellowText() {
                 //   this.pending = `\x1B[38;2;255;255;0m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;255;255;0m`;
                    return this;
                }

                limeText() {
                  //  this.pending = `\x1B[38;2;128;255;0m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;128;255;0m`;
                    return this;
                }

                greenText() {
                    //this.pending = `\x1B[38;2;0;255;0m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;0;255;0m`;
                    return this;
                }

                cyanText() {
                 //   this.pending = `\x1B[38;2;0;255;128m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;0;255;128m`;
                    return this;
                }

                skyBlueText() {
                   // this.pending = `\x1B[38;2;0;255;255m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;0;255;255m`;
                    return this;
                }

                lightBlueText() {
                  //  this.pending = `\x1B[38;2;0;128;255m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;0;128;255m`;
                    return this;
                }

                blueText() {
                 //   this.pending = `\x1B[38;2;0;0;255m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;0;0;255m`;
                    return this;
                }

                purpleText() {
                  //  this.pending = `\x1B[38;2;128;0;255m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;128;0;255m`;
                    return this;
                }

                magentaText() {
                   // this.pending = `\x1B[38;2;255;0;255m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;255;0;255m`;
                    return this;
                }

                pinkText() {
                   // this.pending = `\x1B[38;2;255;0;128m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;255;0;128m`;
                    return this;
                }

                whiteText() {
                 //   this.pending = `\x1B[38;2;255;255;255m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;255;255;255m`;
                    return this;
                }

                blackText() {
                   // this.pending = `\x1B[38;2;0;0;0m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[38;2;0;0;0m`;
                    return this;
                }



            // Background color functions
            //rgbBackground:
            rgbBackground(r, g, b) {
//                this.pending += `\x1B[48;2;${r};${g};${b}m ${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;${r};${g};${b}m`;
                return this;
            }

            redBackground() {
//                this.pending = `\x1B[48;2;255;0;0m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;255;0;0m`;
                return this;
            }

            orangeBackground() {
//                this.pending = `\x1B[48;2;255;128;0m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;255;128;0m`;
                return this;
            }

            yellowBackground() {
//                this.pending = `\x1B[48;2;255;255;0m${this.autoReset ? '\x1B[0m' : ''}`;
                 this.pending += `\x1B[48;2;255;255;0m`;
                return this;
            }

            limeBackground() {
//                this.pending = `\x1B[48;2;128;255;0m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;128;255;0m`;
                return this;
            }

            greenBackground() {
              //  this.pending = `\x1B[48;2;0;255;0m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;0;255;0m`;
                return this;
            }

            cyanBackground() {
              //  this.pending = `\x1B[48;2;0;255;128m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;0;255;128m`;
                return this;
            }

            skyBlueBackground() {
                //this.pending = `\x1B[48;2;0;255;255m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;0;255;255m`;
                return this;
            }

            lightBlueBackground() {
              //  this.pending = `\x1B[48;2;0;128;255m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;0;128;255m`;
                return this;
            }

            blueBackground() {
              //  this.pending = `\x1B[48;2;0;0;255m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending +=`\x1B[48;2;0;0;255m`;
                return this;
            }

            purpleBackground() {
             //   this.pending = `\x1B[48;2;128;0;255m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;128;0;255m`;
                return this;
            }

            magentaBackground() {
             //   this.pending = `\x1B[48;2;255;0;255m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;255;0;255m`;
                return this;
            }

            pinkBackground() {
              //  this.pending = `\x1B[48;2;255;0;128m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;255;0;128m`;
                return this;
            }

            whiteBackground() {
              //  this.pending = `\x1B[48;2;255;255;255m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;255;255;255m`;
                return this;
            }

            blackBackground() {
               // this.pending = `\x1B[48;2;0;0;0m${this.autoReset ? '\x1B[0m' : ''}`;
                this.pending += `\x1B[48;2;0;0;0m`;
                return this;
            }


               bold() {
                    this.pending += `\x1B[1m`;
                    return this;
                }

                dim() {
//                    this.pending = `\x1B[2m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[2m`;
                    return this;
                }

                italic() {
//                    this.pending = `\x1B[3m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[3m`;
                    return this;
                }

                underline() {
                    this.pending += `\x1B[4m`;
                    return this;
                }

                blink() {
//                    this.pending = `\x1B[5m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[5m`;
                    return this;
                }

                invert() {
//                    this.pending = `\x1B[7m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[7m`;
                    return this;
                }

                hide() {
//                    this.pending = `\x1B[8m${this.autoReset ? '\x1B[0m' : ''}`;
                    this.pending += `\x1B[8m`;
                    return this;
                }

             //slow blink
                slowBlink() {
                    this.pending += `\x1B[5m`;
                    return this;
                }

                //rapid blink
                rapidBlink() {
                    this.pending += `\x1B[6m`;
                    return this;
                }

                strikethroughOn() {
                    this.pending += `\x1B[9m`;
                    return this;
                }

                  strikethroughOff() {
                    this.pending += `\x1B[29m`;
                    return this;
                  }


                // Modify the reset method to also set the autoReset flag
                resetText() {
                    this.str = `\x1B[0m${this.str}\x1B[0m`;
                    this.autoReset = true;
                    return this;
                }

                // Add a method to disable automatic reset
                disableAutoReset() {
                    this.autoReset = false;
                    return this;
                }

                // return the text
                getText() {
                    return this.autoReset ? `${this.str}\x1B[0m` : this.str;
                }

          /*      getLine() {
                    const result = this.str;
                    this.resetString();
                    return result;
                }*/
                getLine() {
                    const result = this.autoReset ?   `${this.str}${this.pending} \x1B[0m` : `${this.str}${this.pending}`;
//                     this.resetString();
                           this.str = '';
                    console.log('\x1b[0m');
                    return result;
                }

                // Add a method to reset the string
                resetString() {
                    this.str = '';

                    return this;
                }
                //reset all to default
                resetAnsi() {
                    this.str = '';
                    this.pending = '';
                    this.autoReset = true;
                    console.log('\x1b[0m');
                    return this;
                }




             randomColorText(message, bgR = null, bgG = null, bgB = null) {
                    let temp = '';
                //  console.log('this.str is: ' + this.str);
                      //bgR, bgG, bgB
               //  console.log('bgR: ' + bgR + ' bgG: ' + bgG + ' bgB: ' + bgB);

                    for (let i = 0; i < message.length; i++) {
                        const r = Math.floor(Math.random() * 256);
                        const g = Math.floor(Math.random() * 256);
                        const b = Math.floor(Math.random() * 256);
                        if (bgR !== null && bgG !== null && bgB !== null) {
                            // If a background color is provided, include it in the ANSI escape code
                            temp += `\x1B[38;2;${r};${g};${b};48;2;${bgR};${bgG};${bgB}m${message[i]}`;
                        } else {
                            temp += `\x1B[38;2;${r};${g};${b}m${message[i]}`;
                        }
                    }
                    this.str += temp;
                    return this;
                }
        }

    // Return the Ansi class as the exported value
    return Ansi;
 }));





//in this code, factory is a function that returns the Ansi class. The outer function checks the environment and decides how to expose the Ansi class.
//If define is a function and define.amd is truthy, it uses AMD syntax. If module is an object and module.exports is available, it uses CommonJS syntax.
//Otherwise, it attaches Ansi to the global object (window in a browser).
//
//Now you can use your Ansi class in Node.js with require:
//
//
//const Ansi = require('./ansi_text.js');
//
//And in the browser with a <script> tag:
//
//
//<script src="ansi_text.js"></script>
//<script>
//    var ansi = new Ansi();
//    // ... use the ansi instance ...
//</script>
//
//Or with AMD:
//
//define(['ansi_text'], function(Ansi) {
//    var ansi = new Ansi();
//    // ... use the ansi instance ...
//});
//
//
//
//AMD stands for Asynchronous Module Definition. It's a JavaScript API for defining modules where both the module and its dependencies can be
//asynchronously loaded. It's particularly well suited for the browser environment where synchronous loading of modules can result in
//performance issues.  In AMD, modules are defined with the define function.
//
//Here's an example:
//
//define(['dependency1', 'dependency2'], function(dependency1, dependency2) {
//    // Module code here...
//    return someExportedValue;
//});
//
//
//In this example, dependency1 and dependency2 are dependencies of the module. The function is a callback that gets executed once
//all dependencies are loaded, receiving the exports of the dependencies as its arguments. The return value of the function is
//the exported value of the module.
//
//
