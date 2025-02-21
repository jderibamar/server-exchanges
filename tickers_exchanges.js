const axios = require('axios')
const books = require('./books_apis')

async function mexcTickers() 
{
    try 
    {
        const response = await axios.get('https://api.mexc.com/api/v3/ticker/bookTicker')
        let tickers = response.data

        // console.log('Tickers da Mexc: ' + tickersMexc)

      return tickers
    } 
    catch (error) 
    {
        console.error('Erro ao buscar moedsa da API da Mexc:', error)
        throw error
    }
}

async function XT() 
{
    let tickers = await books.apiXt()

    console.log('Tickers da XT: ' + tickers)
    return tickers
}

// Função para atualizar os dados das moedas em cache a cada 5 segundos
// function upMoBitmart() 
// {
//     setInterval(async () => 
//     {
//       await bitMartMoedas()
//       console.log('Dados das moedas da BitMart em cache atualizados.')
//     }, 10000);
// }

// Inicializa o cache
// mercTickers()
// mexcTickers()

// Inicializa a atualização periódica do cache
// upTckMexc()

module.exports = { mercTickers, mexcTickers, XT }