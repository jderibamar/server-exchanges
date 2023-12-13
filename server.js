const express = require('express')
const axios = require('axios')
const app = express()
const path = require('path')
const nomeApp = process.env.npm_package_name
const port = process.env.PORT || 3000

let tickersDataCache = null


// ESTRATÉGIA PARA NÃO DEIXAR O SERVIDOR CAIR
process.on('uncaughtException', (error) => 
{
    console.error('Erro não tratado:', error);
});

process.on('unhandledRejection', (reason, promise) => 
{
    console.error('Rejeição não tratada em promessa:', reason, promise);
});



// Middleware para habilitar o CORS
app.use((req, res, next) => 
{
   res.setHeader('Access-Control-Allow-Origin', '*')
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
});

app.get('/api/tickers', async (req, res) => 
{
    try 
    {
        // const response = await axios.get('https://api.xeggex.com/api/v2/tickers')
        // const tickersData = response.data
        // res.json(tickersData)
        // Verifica se os dados já estão em cache
        if (!tickersDataCache) 
        {
            // Se não estiver em cache, retorna uma resposta indicando que os dados estão sendo atualizados
            res.status(202).json({ message: 'Atualizando dados em cache. Tente novamente em breve.' });
        }
        else 
        {
            // Se estiverem em cache, retorna os dados
            res.json(tickersDataCache);
        }
    }
    catch (error) 
    {
        console.error('Erro ao buscar dados da API:', error)
        res.status(500).json({ error: 'Erro ao buscar dados da API' })
    }
})

// Roteamento para a aplicação Angular
app.use(express.static(`${__dirname}/dist/${nomeApp}`));
app.get('/*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/dist/${nomeApp}/index.html`));
});

app.listen(port, () => 
{
   console.log('Servidor ativo na porta %d', port);
});


async function fetchAndCacheTickersData() 
{
    try 
    {
      const response = await axios.get('https://api.xeggex.com/api/v2/tickers');
      tickersDataCache = response.data;
      return tickersDataCache;
    } 
    catch (error) 
    {
      console.error('Erro ao buscar dados da API:', error);
      throw error;
    }
}

// Função para atualizar os dados em cache a cada 5 segundos
function updateCachePeriodically() 
{
    setInterval(async () => 
    {
      await fetchAndCacheTickersData()
      console.log('Dados em cache atualizados.');
    }, 10000);
}

// Inicializa o cache
fetchAndCacheTickersData()

// Inicializa a atualização periódica do cache
updateCachePeriodically()