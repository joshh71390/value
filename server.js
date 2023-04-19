// import express JS module into app
// and creates its variable.
var express = require('express')
const https = require('https')
const fs = require('fs')
const cors = require('cors')
var app = express()
const { lookupPost, getSteemProps } = require('./utils/sds.js')
const { getMedianPrice, getVoterAccount } = require('./utils/steemClient.js')

const options = {
  cert: fs.readFileSync('/etc/ssl/certs/server.crt'),
  key: fs.readFileSync('/etc/ssl/certs/server.key')
};


// Creates a server which runs on port 3000 and
// can be accessed through localhost:3000
// app.listen(5000, function () {
//     console.log('server running on port 5000')
// })


https.createServer(options, app).listen(5000, function(){

  console.log('listening on 5000')
})

app.use(cors({ origin: '*' }))
// Function callName() is executed whenever
// url is of the form localhost:3000/name
app.get('/sbdToPct/:steem/:voter/:author/:permlink', sbd_to_percent)
app.get('/pctToSbd/:percent/:voter/:author/:permlink', pct_to_sbd)



async function pct_to_sbd(req,res){
 
  const voterRes = await getVoterAccount(req.params.voter)


//   steem_power (number) – Steem Power
// post_rshares (int) – rshares of post which is voted
// voting_power (int) – voting power (100% = 10000)
// vote_pct (int) – voting percentage (100% = 10000)
    const steemProps = await getSteemProps()
    const sps = steemProps.steem_per_share
    const vp = voterRes.voting_power
    const vests =
        parseFloat(voterRes.vesting_shares.split(' ')[0]) +
        parseFloat(voterRes.received_vesting_shares.split(' ')[0]) -
        parseFloat(voterRes.delegated_vesting_shares.split(' ')[0]) -
        parseFloat(voterRes.vesting_withdraw_rate.split(' ')[0])
    const sp = vests * sps
    const pct = req.params.percent
    const postRes = await lookupPost(req.params.author, req.params.permlink)
    const prs = postRes.net_rshares
    console.log(sp, prs, vp, pct)

    var spawn = require('child_process').spawn
 // Parameters passed in spawn -
    // 1. type_of_script
    // 2. list containing Path of the script
    //    and arguments for the script

    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
    // so, first name = Mike and last name = Will
    var process = spawn('python3', ['python/percToSbd.py', sp, prs, vp, pct])

    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', async (data) =>{  
      const price = await getMedianPrice()

      const steem = data / price
      
      res.send(steem.toString())
    })
}

  function getVPHF20(account) {
    var totalShares = parseFloat(account.vesting_shares) + parseFloat(account.received_vesting_shares) - parseFloat(account.delegated_vesting_shares);
  
    var elapsed = Date.now() / 1000 - account.voting_manabar.last_update_time;
    var maxMana = totalShares * 1000000;
    // 432000 sec = 5 days
    var currentMana = parseFloat(account.voting_manabar.current_mana) + elapsed * maxMana / 432000;
    
    if (currentMana > maxMana) {
      currentMana = maxMana;
    }
  
    var currentManaPerc = currentMana * 100 / maxMana;
  
    return Math.round(currentManaPerc * 100);
   }
async function sbd_to_percent(req, res) {
    // Use child_process.spawn method from
    // child_process module and assign it
    // to variable spawn

    const price = await getMedianPrice()
    console.log(price)
    const sbd = req.params.steem * price
console.log(sbd)
    const voterRes = await getVoterAccount(req.params.voter)
    console.log(voterRes)
    const steemProps = await getSteemProps()
    const sps = steemProps.steem_per_share
    const vp = getVPHF20(voterRes)
    const vests =
        parseFloat(voterRes.vesting_shares.split(' ')[0]) +
        parseFloat(voterRes.received_vesting_shares.split(' ')[0]) -
        parseFloat(voterRes.delegated_vesting_shares.split(' ')[0]) -
        parseFloat(voterRes.vesting_withdraw_rate.split(' ')[0])
    const sp = vests * sps
    const postRes = await lookupPost(req.params.author, req.params.permlink)
    const prs = postRes.net_rshares
    var spawn = require('child_process').spawn

    // Parameters passed in spawn -
    // 1. type_of_script
    // 2. list containing Path of the script
    //    and arguments for the script

    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
    // so, first name = Mike and last name = Will
    var process = spawn('python3', ['python/sbdToVotePct.py', sbd, prs, sp, vp])

    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', function (data) {
        res.send(data.toString())
    })
}

