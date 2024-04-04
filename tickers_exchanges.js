const axios = require('axios')
const books = require('./books_apis')

let tickersMercatox = null,
    tickersMexc = null

async function mercTickers() 
{
    try 
    {
      const response = await axios.get('https://mercatox.com/api/public/v1/ticker')
      const tickers = response.data

      return tickers
    } 
    catch (error) 
    {
        console.error('Erro ao buscar tickers da API da Mercatox:', error)
        throw error
    }
}

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
   
    return tickers
    // console.log('Tickers da XT: ' + tickers)

    // try 
    // {
    //     const response = await axios.get('https://api.mexc.com/api/v3/ticker/bookTicker')
    //     let tickers = response.data

    //     // console.log('Tickers da Mexc: ' + tickersMexc)

    //   return tickers
    // } 
    // catch (error) 
    // {
    //     console.error('Erro ao buscar moedsa da API da XT:', error)
    //     throw error
    // }
}

// Função para atualizar os dados em cache a cada 5 segundos
function upDados() 
{
    setInterval(async () => 
    {
      await mercTickers()
      
      console.log('Dados da Mercatox atualizados.')
    }, 5000)
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
upDados()
// upTckMexc()

module.exports = { mercTickers, mexcTickers, XT }