class DBConnect {
	constructor(dbProcessor) {
		// this.paypal = new Paypal();
		// this.user = user;
		// this.stripe = new Stripe(user)
		this.dbProcessor = dbProcessor
	}

	async query(qr) {
		return this.dbProcessor.query(qr);
		// this.stripe.makePayment(200*quantity*100)
	}

}

class PGProcessor {
	constructor(opts) {
		this.pgp = new Postg(opts);
	}

	query(qr) {
		return this.pgp.getFromDB(qr)
	}
}

class MySqlProcessor {
	constructor(user) {

		this.mysql = new MySQL(user);
	}

	query(qr) {
		return this.mysql.getFromDB(qr)
	}
}

class Postg {

	constructor(opts) {
		this.Opts = opts;
	}
	async getFromDB(qr) {
		//const token = await svcCache.getKV({ key: 'ELRP_TOKEN' });
		const result = await this.Opts.db['primary'].any(qr, '');
		const response = result;
		console.log(response);
		console.log(qr + 'postgres')
		return response;    
	}
}

class MySQL {
	constructor(opts) {
		this.Opts = opts;
	}
	async getFromDB(query) {
		console.log(query + 'mysql')
		return hello;
	}
}


module.exports = function DbProcessor(opts) {

	const dbConnect = new DBConnect(new MySqlProcessor(opts))
	const test = async (request, reply) => {

		await dbConnect.query('SELECT 1');

		return null;
	}



	return {
		test
	}

}
