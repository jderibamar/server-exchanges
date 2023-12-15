const axios = require('axios')

let tickersMercatox = null

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
        console.error('Erro ao buscar dados da API da Mercatox:', error)
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
    }, 10000);
}

// Inicializa o cache
mercTickers()

// Inicializa a atualização periódica do cache
upDados()

module.exports = { mercTickers }