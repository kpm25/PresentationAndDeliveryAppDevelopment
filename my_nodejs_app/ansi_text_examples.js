 const Ansi = require('./ansi_text.js');


//a function to display the text style in color steps etc..
function testVariousANSI(){
                //#For 256 colors, the code is \033[38;5;#m for foreground and \033[48;5;#m for background, where # is a number from 0 to 255.
            //For 24-bit true color, the code is \033[38;2;R;G;Bm for foreground and \033[48;2;R;G;Bm for background, where R, G, and B
            //are numbers from 0 to 255 representing the red, green, and blue color channels.

            //  256 colors and 24-bit true color in JavaScript:
            console.log('\033[38;5;196m%s\033[0m', 'This is red text');
            console.log('\033[38;5;226m%s\033[0m', 'This is yellow text');
            console.log('\033[38;5;21m%s\033[0m', 'This is blue text');
            console.log('\033[38;5;46m%s\033[0m', 'This is green text');

            // 24-bit true color
            console.log('\033[38;2;255;0;0m%s\033[0m', 'This is red text');
            console.log('\033[38;2;255;255;0m%s\033[0m', 'This is yellow text');
            console.log('\033[38;2;0;0;255m%s\033[0m', 'This is blue text');
            console.log('\033[38;2;0;255;0m%s\033[0m', 'This is green text');
            //a spectrum of colors from red to blue
            console.log('\033[38;2;255;0;0m%s\033[0m', 'This is red text');
            console.log('\033[38;2;255;128;0m%s\033[0m', 'This is orange text');
            console.log('\033[38;2;255;255;0m%s\033[0m', 'This is yellow text');
            console.log('\033[38;2;128;255;0m%s\033[0m', 'This is lime text');
            console.log('\033[38;2;0;255;0m%s\033[0m', 'This is green text');
            console.log('\033[38;2;0;255;128m%s\033[0m', 'This is cyan text');
            console.log('\033[38;2;0;255;255m%s\033[0m', 'This is sky blue text');
            console.log('\033[38;2;0;128;255m%s\033[0m', 'This is light blue text');
            console.log('\033[38;2;0;0;255m%s\033[0m', 'This is blue text');
            console.log('\033[38;2;128;0;255m%s\033[0m', 'This is purple text');
            console.log('\033[38;2;255;0;255m%s\033[0m', 'This is magenta text');
            console.log('\033[38;2;255;0;128m%s\033[0m', 'This is pink text');

            //Complentary color spectrums in steps of 32 one one color to its complement
            //Green to red
            console.log('\033[38;2;0;255;0m%s\033[0m', 'This is green text');
            console.log('\033[38;2;32;223;0m%s\033[0m',  'This is step 1 text');
            console.log('\033[38;2;64;191;0m%s\033[0m',  'This is step 2 text');
            console.log('\033[38;2;96;159;0m%s\033[0m',  'This is step 3 text');
            console.log('\033[38;2;128;127;0m%s\033[0m',  'This is step 4 text');
            console.log('\033[38;2;160;95;0m%s\033[0m',  'This is step 5 text');
            console.log('\033[38;2;192;63;0m%s\033[0m',  'This is step 6 text');
            console.log('\033[38;2;224;31;0m%s\033[0m',  'This is step 7 text');
            console.log('\033[38;2;255;0;0m%s\033[0m',  'This is red text');

            //Blue to yellow
            console.log('\033[38;2;0;0;255m%s\033[0m', 'This is blue text');
            console.log('\033[38;2;32;32;223m%s\033[0m',  'This is step 1 text');
            console.log('\033[38;2;64;64;191m%s\033[0m',  'This is step 2 text');
            console.log('\033[38;2;96;96;159m%s\033[0m',  'This is step 3 text');
            console.log('\033[38;2;128;128;127m%s\033[0m',  'This is step 4 text');
            console.log('\033[38;2;160;160;95m%s\033[0m',  'This is step 5 text');
            console.log('\033[38;2;192;192;63m%s\033[0m',  'This is step 6 text');
            console.log('\033[38;2;224;224;31m%s\033[0m',  'This is step 7 text');
            console.log('\033[38;2;255;255;0m%s\033[0m',  'This is yellow text');

            //Red to cyan
            console.log('\033[38;2;255;0;0m%s\033[0m', 'This is red text');
            console.log('\033[38;2;223;32;32m%s\033[0m',  'This is step 1 text');
            console.log('\033[38;2;191;64;64m%s\033[0m',  'This is step 2 text');
            console.log('\033[38;2;159;96;96m%s\033[0m',  'This is step 3 text');
            console.log('\033[38;2;127;128;128m%s\033[0m',  'This is step 4 text');
            console.log('\033[38;2;95;160;160m%s\033[0m',  'This is step 5 text');
            console.log('\033[38;2;63;192;192m%s\033[0m',  'This is step 6 text');
            console.log('\033[38;2;31;224;224m%s\033[0m',  'This is step 7 text');
            console.log('\033[38;2;0;255;255m%s\033[0m',  'This is cyan text');

            //Yellow to purple
            console.log('\033[38;2;255;255;0m%s\033[0m', 'This is yellow text');
            console.log('\033[38;2;223;223;32m%s\033[0m',  'This is step 1 text');
            console.log('\033[38;2;191;191;64m%s\033[0m',  'This is step 2 text');
            console.log('\033[38;2;159;159;96m%s\033[0m',  'This is step 3 text');
            console.log('\033[38;2;127;127;128m%s\033[0m',  'This is step 4 text');
            console.log('\033[38;2;95;95;160m%s\033[0m',  'This is step 5 text');
            console.log('\033[38;2;63;63;192m%s\033[0m',  'This is step 6 text');
            console.log('\033[38;2;31;31;224m%s\033[0m',  'This is step 7 text');
            console.log('\033[38;2;0;0;255m%s\033[0m',  'This is purple text');

            //Cyan to pink
            console.log('\033[38;2;0;255;255m%s\033[0m', 'This is cyan text');
            console.log('\033[38;2;32;223;223m%s\033[0m',  'This is step 1 text');
            console.log('\033[38;2;64;191;191m%s\033[0m',  'This is step 2 text');
            console.log('\033[38;2;96;159;159m%s\033[0m',  'This is step 3 text');
            console.log('\033[38;2;128;127;127m%s\033[0m',  'This is step 4 text');
            console.log('\033[38;2;160;95;95m%s\033[0m',  'This is step 5 text');
            console.log('\033[38;2;192;63;63m%s\033[0m',  'This is step 6 text');
            console.log('\033[38;2;224;31;31m%s\033[0m',  'This is step 7 text');
            console.log('\033[38;2;255;0;255m%s\033[0m',  'This is pink text');

            //Purple to green
            console.log('\033[38;2;0;0;255m%s\033[0m', 'This is purple text');
            console.log('\033[38;2;32;32;223m%s\033[0m',  'This is step 1 text');
            console.log('\033[38;2;64;64;191m%s\033[0m',  'This is step 2 text');
            console.log('\033[38;2;96;96;159m%s\033[0m',  'This is step 3 text');
            console.log('\033[38;2;128;128;127m%s\033[0m',  'This is step 4 text');
            console.log('\033[38;2;160;160;95m%s\033[0m',  'This is step 5 text');
            console.log('\033[38;2;192;192;63m%s\033[0m',  'This is step 6 text');
            console.log('\033[38;2;224;224;31m%s\033[0m',  'This is step 7 text');
            console.log('\033[38;2;0;255;0m%s\033[0m',  'This is green text');

            //Pink to green
            console.log('\033[38;2;255;0;255m%s\033[0m', 'This is pink text');
            console.log('\033[38;2;223;32;223m%s\033[0m',  'This is step 1 text');
            console.log('\033[38;2;191;64;191m%s\033[0m',  'This is step 2 text');
            console.log('\033[38;2;159;96;159m%s\033[0m',  'This is step 3 text');
            console.log('\033[38;2;127;128;127m%s\033[0m',  'This is step 4 text');
            console.log('\033[38;2;95;160;95m%s\033[0m',  'This is step 5 text');
            console.log('\033[38;2;63;192;63m%s\033[0m',  'This is step 6 text');
            console.log('\033[38;2;31;224;31m%s\033[0m',  'This is step 7 text');
            console.log('\033[38;2;0;255;0m%s\033[0m',   'This is green text');

            //Green to purple
            console.log('\033[38;2;0;255;0m%s\033[0m', 'This is green text');
            console.log('\033[38;2;32;223;32m%s\033[0m',  'This is step 1 text');
            console.log('\033[38;2;64;191;64m%s\033[0m',  'This is step 2 text');
            console.log('\033[38;2;96;159;96m%s\033[0m',  'This is step 3 text');
            console.log('\033[38;2;128;127;128m%s\033[0m',  'This is step 4 text');
            console.log('\033[38;2;160;95;160m%s\033[0m',  'This is step 5 text');
            console.log('\033[38;2;192;63;192m%s\033[0m',  'This is step 6 text');
            console.log('\033[38;2;224;31;224m%s\033[0m',  'This is step 7 text');
            console.log('\033[38;2;0;0;255m%s\033[0m',   'This is purple text');




            //Here are the examples using background colors:

            // 256 colors
            console.log('\033[48;5;196m%s\033[0m', 'This is red background');
            console.log('\033[48;5;226m%s\033[0m', 'This is yellow background');
            console.log('\033[48;5;21m%s\033[0m', 'This is blue background');
            console.log('\033[48;5;46m%s\033[0m', 'This is green background');

            // 24-bit true color
            console.log('\033[48;2;255;0;0m%s\033[0m', 'This is red background');
            console.log('\033[48;2;255;255;0m%s\033[0m', 'This is yellow background');
            console.log('\033[48;2;0;0;255m%s\033[0m', 'This is blue background');
            console.log('\033[48;2;0;255;0m%s\033[0m', 'This is green background');
            //a spectrum of colors from red to blue
            console.log('\033[48;2;255;0;0m%s\033[0m', 'This is red background');
            console.log('\033[48;2;255;128;0m%s\033[0m', 'This is orange background');
            console.log('\033[48;2;255;255;0m%s\033[0m', 'This is yellow background');
            console.log('\033[48;2;128;255;0m%s\033[0m', 'This is lime background');
            console.log('\033[48;2;0;255;0m%s\033[0m', 'This is green background');
            console.log('\033[48;2;0;255;128m%s\033[0m', 'This is cyan background');
            console.log('\033[48;2;0;255;255m%s\033[0m', 'This is sky blue background');

            //Complentary color spectrums in steps of 32 one one color to its complement
            //Green to red
            console.log('\033[48;2;0;255;0m%s\033[0m', 'This is green background');
            console.log('\033[48;2;32;223;0m%s\033[0m',  'This is step 1 background');
            console.log('\033[48;2;64;191;0m%s\033[0m',  'This is step 2 background');
            console.log('\033[48;2;96;159;0m%s\033[0m',  'This is step 3 background');
            console.log('\033[48;2;128;127;0m%s\033[0m',  'This is step 4 background');
            console.log('\033[48;2;160;95;0m%s\033[0m',  'This is step 5 background');
            console.log('\033[48;2;192;63;0m%s\033[0m',  'This is step 6 background');
            console.log('\033[48;2;224;31;0m%s\033[0m',  'This is step 7 background');
            console.log('\033[48;2;255;0;0m%s\033[0m',  'This is red background');

            //Blue to yellow
            console.log('\033[48;2;0;0;255m%s\033[0m', 'This is blue background');
            console.log('\033[48;2;32;32;223m%s\033[0m',  'This is step 1 background');
            console.log('\033[48;2;64;64;191m%s\033[0m',  'This is step 2 background');
            console.log('\033[48;2;96;96;159m%s\033[0m',  'This is step 3 background');
            console.log('\033[48;2;128;128;127m%s\033[0m',  'This is step 4 background');
            console.log('\033[48;2;160;160;95m%s\033[0m',  'This is step 5 background');
            console.log('\033[48;2;192;192;63m%s\033[0m',  'This is step 6 background');
            console.log('\033[48;2;224;224;31m%s\033[0m',  'This is step 7 background');
            console.log('\033[48;2;255;255;0m%s\033[0m',  'This is yellow background');

            //Red to cyan
            console.log('\033[48;2;255;0;0m%s\033[0m', 'This is red background');
            console.log('\033[48;2;223;32;32m%s\033[0m',  'This is step 1 background');
            console.log('\033[48;2;191;64;64m%s\033[0m',  'This is step 2 background');
            console.log('\033[48;2;159;96;96m%s\033[0m',  'This is step 3 background');
            console.log('\033[48;2;127;128;128m%s\033[0m',  'This is step 4 background');
            console.log('\033[48;2;95;160;160m%s\033[0m',  'This is step 5 background');
            console.log('\033[48;2;63;192;192m%s\033[0m',  'This is step 6 background');
            console.log('\033[48;2;31;224;224m%s\033[0m',  'This is step 7 background');
            console.log('\033[48;2;0;255;255m%s\033[0m',  'This is cyan background');

            //Yellow to purple
            console.log('\033[48;2;255;255;0m%s\033[0m', 'This is yellow background');
            console.log('\033[48;2;223;223;32m%s\033[0m',  'This is step 1 background');
            console.log('\033[48;2;191;191;64m%s\033[0m',  'This is step 2 background');
            console.log('\033[48;2;159;159;96m%s\033[0m',  'This is step 3 background');
            console.log('\033[48;2;127;127;128m%s\033[0m',  'This is step 4 background');
            console.log('\033[48;2;95;95;160m%s\033[0m',  'This is step 5 background');
            console.log('\033[48;2;63;63;192m%s\033[0m',  'This is step 6 background');
            console.log('\033[48;2;31;31;224m%s\033[0m',  'This is step 7 background');
            console.log('\033[48;2;0;0;255m%s\033[0m',  'This is purple background');

            //Cyan to pink
            console.log('\033[48;2;0;255;255m%s\033[0m', 'This is cyan background');
            console.log('\033[48;2;32;223;223m%s\033[0m',  'This is step 1 background');
            console.log('\033[48;2;64;191;191m%s\033[0m',  'This is step 2 background');
            console.log('\033[48;2;96;159;159m%s\033[0m',  'This is step 3 background');
            console.log('\033[48;2;128;127;127m%s\033[0m',  'This is step 4 background');
            console.log('\033[48;2;160;95;95m%s\033[0m',  'This is step 5 background');
            console.log('\033[48;2;192;63;63m%s\033[0m',  'This is step 6 background');
            console.log('\033[48;2;224;31;31m%s\033[0m',  'This is step 7 background');
            console.log('\033[48;2;255;0;255m%s\033[0m',  'This is pink background');

            //Purple to green
            console.log('\033[48;2;0;0;255m%s\033[0m', 'This is purple background');
            console.log('\033[48;2;32;32;223m%s\033[0m',  'This is step 1 background');
            console.log('\033[48;2;64;64;191m%s\033[0m',  'This is step 2 background');
            console.log('\033[48;2;96;96;159m%s\033[0m',  'This is step 3 background');
            console.log('\033[48;2;128;128;127m%s\033[0m',  'This is step 4 background');
            console.log('\033[48;2;160;160;95m%s\033[0m',  'This is step 5 background');
            console.log('\033[48;2;192;192;63m%s\033[0m',  'This is step 6 background');
            console.log('\033[48;2;224;224;31m%s\033[0m',  'This is step 7 background');
            console.log('\033[48;2;0;255;0m%s\033[0m',  'This is green background');


            //Pink to green
            console.log('\033[48;2;255;0;255m%s\033[0m', 'This is pink background');
            console.log('\033[48;2;223;32;223m%s\033[0m',  'This is step 1 background');
            console.log('\033[48;2;191;64;191m%s\033[0m',  'This is step 2 background');
            console.log('\033[48;2;159;96;159m%s\033[0m',  'This is step 3 background');
            console.log('\033[48;2;127;128;127m%s\033[0m',  'This is step 4 background');
            console.log('\033[48;2;95;160;95m%s\033[0m',  'This is step 5 background');
            console.log('\033[48;2;63;192;63m%s\033[0m',  'This is step 6 background');
            console.log('\033[48;2;31;224;31m%s\033[0m',  'This is step 7 background');
            console.log('\033[48;2;0;255;0m%s\033[0m',   'This is green background');


            //Green to purple
            console.log('\033[48;2;0;255;0m%s\033[0m', 'This is green background');
            console.log('\033[48;2;32;223;32m%s\033[0m',  'This is step 1 background');
            console.log('\033[48;2;64;191;64m%s\033[0m',  'This is step 2 background');
            console.log('\033[48;2;96;159;96m%s\033[0m',  'This is step 3 background');
            console.log('\033[48;2;128;127;128m%s\033[0m',  'This is step 4 background');
            console.log('\033[48;2;160;95;160m%s\033[0m',  'This is step 5 background');
            console.log('\033[48;2;192;63;192m%s\033[0m',  'This is step 6 background');
            console.log('\033[48;2;224;31;224m%s\033[0m',  'This is step 7 background');
            console.log('\033[48;2;0;0;255m%s\033[0m',   'This is purple background');


                //Formatting style examples
                console.log('\033[1m%s\033[0m', 'This is bold text');
                console.log('\033[3m%s\033[0m', 'This is italic text');
                console.log('\033[4m%s\033[0m', 'This is underlined text');
                console.log('\033[7m%s\033[0m', 'This is inverted text');
                console.log('\033[5m%s\033[0m', 'This is blinking text');
                console.log('\033[2m%s\033[0m', 'This is dim text');
                console.log('\033[8m%s\033[0m', 'This is hidden text');
                console.log('\033[9m%s\033[0m', 'This is strikethrough text');

                //Combining styles
                console.log('\033[1m\033[3m\033[4m\033[7m\033[5m\033[2m\033[8m\033[9m%s\033[0m', 'This is a combination of styles');





}


 //testVariousANSI();

//examples using the ansi_text.js library
//let ansi = new Ansi();
//console.log(ansi.text("hello world").bold().underline().toString());

//let ansi = new Ansi();
//console.log(ansi.text("hello world").redText().orangeBackground().underline().toString());

  //function to test the ansi_text.js library
  function testAnsiLibrary(){


      let ansi = new Ansi();

        // Example 1: Red text with green background
//        console.log(ansi.text("Hello World").rgbText(255, 0, 0).rgbBackground(0, 255, 0).getLine());
        console.log(ansi.rgbText(255, 0, 0).rgbBackground(0, 255, 0).text("Red Text on a Green background").getLine());
          console.log(ansi.rgbText(255, 0, 0).rgbBackground(0, 255, 0).text("*****Hello World").getLine());

      //underline and bold
        console.log(ansi.bold().underline().text("bold and underlined").getLine());

        // Example 2: Blue text with yellow background, bold and underlined
         console.log(ansi.rgbText(0, 0, 255).rgbBackground(255, 255, 0).bold().underline().text("Hello World").getLine());

        // Example 3: Magenta text with cyan background, dim and italic
        console.log(ansi.rgbText(255, 0, 255).rgbBackground(0, 255, 255).dim().italic().text("Hello World").getLine());

        // Example 1: Chaining multiple text color functions
        console.log(ansi.redText().text("and this is red text").greenText().text("This is green text ").getLine());

        // Example 2: Chaining text color and background color functions
        console.log(ansi.redText().greenBackground().text("This is red text on a green background").getLine());

        // Example 3: Chaining text color, background color, and style functions
        console.log(ansi.redText().greenBackground().bold().text("This is bold red text on a green background").getLine());

        // Example 4: Using disableAutoReset to keep the style for subsequent text
        console.log(ansi.disableAutoReset().redText().text("This is red ").text("and this is also red").getLine());

        console.log("is this red too??");

        // Example 5: Using reset to clear the style
        console.log(ansi.yellowText().text("This is yellow ").resetText().text("and this is default").getLine());

        // Example 6: Chaining multiple style functions
        console.log(ansi.bold().underline().text("This is bold and underlined").getLine());

        // Example 7: Using rgbText and rgbBackground for custom colors
        console.log(ansi.rgbText(128, 128, 128).rgbBackground(255, 255, 255).text("This is gray text on a white background").getLine());

         //white text on black background
        console.log(ansi.rgbText(255, 255, 255).rgbBackground(0, 0, 0).text("This is white text on a black background").getLine());
      //black text on white background
        console.log(ansi.rgbText(0, 0, 0).rgbBackground(255, 255, 255).text("This is black text on a white background").getLine());
        //red text on white background
        console.log(ansi.rgbBackground(255, 255, 255).rgbText(255, 0, 0).text("This is red text on a white background").getLine());
      //white text on red background
        console.log(ansi.rgbBackground(255, 0, 0).rgbText(255, 255, 255).text("This is white text on a red background").getLine());
      //underlined
        console.log(ansi.underline().text("This is underlined text").getLine());
      //bold orange text on cyan background with strikethrough and italic
        console.log(ansi.rgbBackground(0, 255, 255).rgbText(255, 165, 0).strikethroughOn().italic().bold().text("This is bold orange text on a cyan background with strikethrough and italic").getLine());

       //plain strike through text
           console.log(ansi.strikethroughOff().strikethroughOn().text("This is strikethrough text").getLine());

      //rapid blinking text
        console.log(ansi.rapidBlink().text("This is rapidly blinking text").getLine());
        //slow blinking text
        console.log(ansi.slowBlink().text("This is slowly blinking text").getLine());
           ansi.resetAnsi() ;

      //random color text
 console.log(ansi.randomColorText("This is random color text").getLine());

      //random color text on white background
    //    console.log(ansi.rgbBackground(255, 0, 0).randomColorText("This is MORE random color text").getText());
//      console.log(ansi.randomColorText("This is MORE random color text").rgbBackground(255, 0, 0).getLine());
//
//       console.log(ansi.randomColorText("This is MORE random color text", 255, 255, 255).rgbBackground(255, 0, 0).getText());
      console.log(ansi.randomColorText("This is MORE random color text").getLine());

       console.log(ansi.randomColorText("This is MORE random color text", 255, 255, 255).getLine());

      //blinking random color text
        console.log(ansi.randomColorText("This is blinking random color text").getLine());


             ansi.resetAnsi() ;
        console.log('\n\n\n\nnormal text');


  }

  testAnsiLibrary();















