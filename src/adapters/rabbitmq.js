const amqp = require('amqplib');

const mqconfig = require('./mq/mqconfig');

module.exports = async ({ logger, config }) => {

    const { username, password, host, port } = config.get('queues:rabbitmq');

    const connection = await amqp.connect(`amqp://${username}:${password}@${host}:${port}`);
    console.log('------ Tars');
    const channel = await connection.createChannel();

    logger.info('[\u2713] RabbitMq [ready]');
    console.log('RabbitMq [ready]');

    async function createExchange(exchangeName, queueName, routingKey) {

		await connection.assertQueue(queueName);
		await connection.assertExchange(exchangeName, 'x-delayed-message', {
			arguments: {
				'x-delayed-type': 'direct'
			}
		});
		await connection.bindQueue(queueName, exchangeName, routingKey);
	}

	async function sendToExchange(exchange, routingKey, payload, options = {}) {
		const headers = { };
		headers['x-delay'] = options.delay ? options.delay : undefined;

	//	const { channel } = await RabbitMQ.get(tenantConfig);
		await connection.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)), { persistent: true, contentType: 'application/json', headers });
	}


    return {
        connection,
        channel,
        mqconfig,
    }
}