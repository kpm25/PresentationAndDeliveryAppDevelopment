let nodeServerUrl;
let flaskServerUrl;

function fetchServerUrls() {
    return fetch('/config')
        .then(response => response.json())
        .then(config => {
            nodeServerUrl = config.nodeServerUrl;
            flaskServerUrl = config.flaskServerUrl;
            //if Ansi is a class use new Ansi().. else just use normal console.log
            if(typeof Ansi === 'undefined'){
                console.log('Node server URL:', nodeServerUrl);
                console.log('Flask server URL:', flaskServerUrl);
            }else{
                new Ansi().pink().bgYellow().bold().text(`nodeServerUrl: ${nodeServerUrl}, flaskServerUrl: ${flaskServerUrl}`).print();
            }
        })
        .catch(error => {
            if(typeof Ansi === 'undefined'){
                console.log('Error fetching server URLs:', error);
            }else{
                new Ansi().red().bold().text(`Error fetching server URLs: ${error}`).print();
            }
        });
}