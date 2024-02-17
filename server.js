const mercatox = require('./tickers_exchanges').mercTickers()
const mexcTickers = require('./tickers_exchanges').mexcTickers()

const express = require('express')
const axios = require('axios')
const app = express()
const path = require('path')
const nomeApp = process.env.npm_package_name
const port = process.env.PORT || 3000

let tickersXeggex = null,
    tickersMercatox = null,
    tickersMexc = null


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
        // Verifica se os dados já estão em cache
        if (!tickersXeggex) 
        {
            // Se não estiver em cache, retorna uma resposta indicando que os dados estão sendo atualizados
            res.status(202).json({ message: 'Atualizando dados em cache. Tente novamente em breve.' });
        }
        else 
        {
            // Se estiverem em cache, retorna os dados
            res.json(tickersXeggex);
        }
    }
    catch (error) 
    {
        console.error('Erro ao buscar dados da API:', error)
        res.status(500).json({ error: 'Erro ao buscar dados da API' })
    }
})

app.get('/mercatox', async (req, res) => 
{
    try 
    {
        // Verifica se os dados já estão em cache
        if (!tickersMercatox) 
        {
            // Se não estiver em cache, retorna uma resposta indicando que os dados estão sendo atualizados
            res.status(202).json({ message: 'Atualizando dados em cache da Mercatox. Tente novamente em breve.' })
        }
        else 
        {
            // Se estiverem em cache, retorna os dados
            res.json(tickersMercatox)
        }
    }
    catch (error) 
    {
        console.error('Erro ao buscar dados da API:', error)
        res.status(500).json({ error: 'Erro ao buscar dados da API' })
    }
})

app.get('/mexc_tickers', async (req, res) => 
{
    try 
    {
        // Verifica se os dados já estão em cache
        if (!tickersMexc) 
        {
            // Se não estiver em cache, retorna uma resposta indicando que os dados estão sendo atualizados
            res.status(202).json({ message: 'Atualizando dados tickers da Mexc. Tente novamente em breve.' })
        }
        else 
        {
            // Se estiverem em cache, retorna os dados
            res.json(tickersMexc)
        }
    }
    catch (error) 
    {
        console.error('Erro ao buscar tickers da API da Mexc:', error)
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
      tickersXeggex = response.data

      return tickersXeggex;
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
      console.log('Dados em cache da Xeggex atualizados.');
    }, 10000)
}

// Inicializa o cache
fetchAndCacheTickersData()

// Inicializa a atualização periódica do cache
updateCachePeriodically()

// POPULAR AS VARIÁVEIS QUE SERÃO ENVIADAS NAS ROTAS
mercatox.then((res) =>
{
    tickersMercatox = res
    // console.log('Res da M: ' + res.ETHO_BTC.last_price)
})
.catch(erro => console.error(erro))

setInterval(() =>
{
    mexcTickers.then((res) =>
    {
        tickersMexc = res
        // console.log('Tickers da Mexc: ' + res)
    })
    .catch(erro => console.error(erro))
}, 7000)