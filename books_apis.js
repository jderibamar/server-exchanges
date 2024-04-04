const axios = require('axios')


async function apiXt()
    {
        let moedas = await axios.get('https://sapi.xt.com/v4/public/wallet/support/currency'),
            moJson = moedas.data,
            dados = moJson.result,
            tbook = await xtBookticker(),
            paresBtcUsdt = [],
            lf = []
            

        for(let i in dados)
        {
            if(dados[i].supportChains[0] != undefined)
            {
                if(dados[i].supportChains[0].depositEnabled && dados[i].supportChains[0].withdrawEnabled)
                {
                    // let upper = dados[i].currency.toUpperCase()
                    paresBtcUsdt.push({ par_btc: dados[i].currency + '_btc', par_usdt: dados[i].currency + '_usdt'  })
                }
            }
        }
       
        for(let i in paresBtcUsdt)
        {
            for(let j in tbook)
            {
                if(paresBtcUsdt[i].par_btc == tbook[j].s || paresBtcUsdt[i].par_usdt == tbook[j].s)
                    lf.push({ s: tbook[j].s, b: tbook[j].bp, a: tbook[j].ap })
            }
        }
        
        for(let i in lf)
        {
            lf[i].s = lf[i].s.replace('_', '')
            lf[i].s = lf[i].s.toUpperCase()
        }

        // for(let i in lf)
        //     console.log('par da XT -> ' + lf[i].s + 'b -> ' + lf[i].b + 'a -> ' + lf[i].a)

        return lf
    }

async function xtBookticker()
{
    let res = await axios.get('https://sapi.xt.com/v4/public/ticker/book'),
        dados =  res.data

        // console.log('Book da XT: ' + dados.result[0].s)

    return dados.result   
}

module.exports = { apiXt }