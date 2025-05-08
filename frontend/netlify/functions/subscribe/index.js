const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;


const axios = require('axios');
var crypto = require('crypto');

const apiRoot = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/`;

const handler = async (event) => {
	try {

		const email = event.queryStringParameters.email;
		if (!email) {
			return {
				statusCode: 500,
				body: 'email query paramter required'
			};
		}

		let emailhash = crypto.createHash('md5').update(email).digest('hex');

		return axios({
				method: 'put',
				url: apiRoot + emailhash,
				data: {
					email_address: email,
					status: 'subscribed',
					merge_fields: {
						tag:'blog'
					}
				},
				auth: {
					'username': 'anythingreally',
					'password': MAILCHIMP_API_KEY
				}
			}).then(res => {
				return {
					statusCode: 200,
					body: JSON.stringify(res.data)
				}
			})
			.catch(err => {
				console.log('returning from here', err.response.data.detail);
				return {
					statusCode: 500,
					body: JSON.stringify(err.response.data)
				};
			});

	} catch (error) {
		return { statusCode: 500, body: error.toString() }
	}
}

module.exports = { handler }