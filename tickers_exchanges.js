const axios = require('axios')

let tickersMercatox = null,
    tickersBitmart = null,
    moedasBitmart = null

async function mercTickers() 
{
    try 
    {
      const response = await axios.get('https://mercatox.com/api/public/v1/ticker')
      tickersMercatox = response.data

      return tickersMercatox
    } 
    catch (error) 
    {
        console.error('Erro ao buscar tickers da API da Mercatox:', error)
        throw error
    }
}

async function bitMartTickers() 
{
    try 
    {
        const response = await axios.get('https://api-cloud.bitmart.com/spot/v1/ticker')
        tickersBitmart = response.data

      return tickersBitmart
    } 
    catch (error) 
    {
        console.error('Erro ao buscar moedsa da API da BitMart:', error)
        throw error
    }
}

async function bitMartMoedas() 
{
    try 
    {
      const response = await axios.get('https://api-cloud.bitmart.com/spot/v1/currencies')
      moedasBitmart = response.data

      return moedasBitmart
    } 
    catch (error) 
    {
        console.error('Erro ao buscar dados da API da BitMart:', error)
        throw error
    }
}

// Função para atualizar os dados em cache a cada 5 segundos
function upDados() 
{
    setInterval(async () => 
    {
      await mercTickers()
      console.log('Dados da Mercatox em cache atualizados.')
    }, 5000);
}

// Função para atualizar os dados em cache a cada 5 segundos
function upTckBitmart() 
{
    setInterval(async () => 
    {
      await bitMartTickers()
      console.log('Dados Tickers da BitMart em cache atualizados.')
    }, 10000);
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
mercTickers()
bitMartTickers()

// Inicializa a atualização periódica do cache
upDados()
upTckBitmart()

module.exports = { mercTickers, bitMartMoedas, bitMartTickers }