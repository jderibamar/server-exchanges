const express = require('express')
const axios = require('axios')
const app = express()
const path = require('path')
const nomeApp = process.env.npm_package_name
const port = process.env.PORT || 3000

let tickersXeggex = null,
    tickersMexc = null,
    tickersXT = null


// ESTRATÉGIA PARA NÃO DEIXAR O SERVIDOR CAIR
process.on('uncaughtException', (error) => 
{
    console.error('Erro não tratado:', error);
});

process.on('unhandledRejection', (reason, promise) => 
{
    console.error('Rejeição não tratada em promessa:', reason, promise)
})

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

// ENDPOINT DA MEXC
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
        res.status(500).json({ error: 'Erro ao buscar dados da API da MEXC' })
    }
})

// ENDPOINT DA XT
app.get('/xt', async (req, res) => 
{
    try 
    {
        // Verifica se os dados já estão em cache
        if (!tickersXT) 
        {
            // Se não estiver em cache, retorna uma resposta indicando que os dados estão sendo atualizados
            res.status(202).json({ message: 'Atualizando dados em cache da XT. Tente novamente em breve.' })
        }
        else 
        {
            // Se estiverem em cache, retorna os dados
            res.json(tickersXT)
        }
    }
    catch (error) 
    {
        console.error('Erro ao buscar dados da API da XT:', error)
        res.status(500).json({ error: 'Erro ao buscar dados da API da XT' })
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

setInterval(() =>
{
    const mexcTickers = require('./tickers_exchanges').mexcTickers()
    const XtTickers = require('./tickers_exchanges').XT()
    
    mexcTickers.then((res) =>
    {
        tickersMexc = res
        console.log('Tickers da Mexc Atualizados a cada 7 segundos')
    })
    .catch(erro => console.error(erro))

    XtTickers.then((res) =>
    {
        tickersXT = res
        console.log('Tickers da XT Atualizados a cada 7 segundos')
        // console.log('Tickers da XT POS zero: ' + res[0].s)
    })
}, 7000)