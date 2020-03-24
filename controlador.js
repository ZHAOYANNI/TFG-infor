
function getAlphaData() {

    const apiKey = 'demo'

    const symbol = 'MSFT'

    const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + symbol + '&interval=1min&apikey=' + apiKey;

    requestFile( url );

}

function requestFile( url ) {

    const xhr = new XMLHttpRequest();
    xhr.open( 'GET', url, true );
    xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
    xhr.onload = callback;
    xhr.send( null );

    function callback( xhr ) {

        let response, json, lines;

        response = xhr.target.response;
        resultados.innerText = response;

        json = JSON.parse( response );

        // ¿Cómo puedo sacar las informaciones que me interesa?
        // Por ejemplo, open
        
        console.log( 'json', json );


    }
    

}