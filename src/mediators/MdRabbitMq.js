module.exports = function MdRabbitMq(opts) {

    const {
        utility,
        _,
        queue,
    } = opts;

    const { asyncForEach } = utility;

    const { primary } = queue;

    const { channel } = primary;

    const { mqconfig } = primary;

    async function initQueueConsumers({ queue, exchange },  callback) {
        // eslint-disable-next-line no-shadow
        //const { consumer, queue } = consumers;

        //consume({ queue, callback: consumer });
        consume({ queue, exchange }, callback );
        
    }

    async function initSystemQueues() {
        const { mqconfig, channel } = queue.primary;

        const { exchange, routing, queues } = mqconfig;

        const _registrations = Object.keys(queues);

        await asyncForEach(_registrations, async (_r) => {
            const route = routing[_r];
            const queue = queues[_r];

            await channel.assertExchange(exchange, 'direct', { durable: true });
            await channel.assertQueue(queue);
            await channel.bindQueue(queue, exchange, route);
        });

        return true;
    }

    async function send({ queue, payload }) {

        //const _queue = mqconfig.queues[queue];
        const _queue = queue;
        payload = Buffer.from(JSON.stringify(payload));
        channel.assertQueue(_queue, { durable: true });
        channel.sendToQueue(_queue, payload, { persistent: true, contentType: 'application/json' });
    }

    async function publish({ payload }) {
        await channel.publish('x-eleanor', 'eleanor-notifications', Buffer.from(JSON.stringify(payload)), { persistent: true, contentType: 'application/json' });
    }

    async function consume({ queue, exchange}, callback ) {

        channel.assertQueue(queue, { durable: true });
        channel.bindQueue(queue, exchange, '');
        channel.prefetch(1);
        channel.consume(queue, (payload) => {
            try {
                const json = JSON.parse(payload.content.toString());
                callback(json);
            } catch (ex) {
                callback(ex);
            }

        }, { noAck: true });

    }

    async function sendToExchange({ exchange, route, payload }) {
        channel.assertExchange(exchange, 'direct', {
            durable: true
          });
        await channel.publish(exchange, route, Buffer.from(JSON.stringify(payload)), { persistent: true, contentType: 'application/json' });
    }

    async function close() {
        connection.close();
    }

    return {
        send,
        close,
        consume,
        publish,
        sendToExchange,
        initQueueConsumers,
        initSystemQueues
    }

} 