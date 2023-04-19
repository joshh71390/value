const axios = require('axios')

const sds = axios.create({
    baseURL: 'https://sds.steemworld.org/',
    timeout: 10000,
})

const lookupPost = async (author, permlink) => {
    try {
        const res = await sds.get(
            `/posts_api/getPayout/${author}/${permlink}/true/true`
        )
        return await res.data.result
    } catch (error) {
        console.log(error.message)
    }
}
const getSteemProps = async () => {
    try {
        const res = await sds.get('/steem_requests_api/getSteemProps')
        return await res.data.result
    } catch (error) {
        console.log(error.message)
    }

}
module.exports = { lookupPost, getSteemProps }