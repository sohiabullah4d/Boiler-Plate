module.exports = function BootstrapMediator(opts) {

    const {
        svcCache,
        logger,
        utility,
        _,
        queue,
        mdRabbitMq,
    } = opts;

    const { asyncForEach } = utility;

    async function initQueueConsumers() {
        await mdRabbitMq.initSystemQueues();
        await mdRabbitMq.initQueueConsumers({ queue: 'q-eleanor-requests', exchange: 'x-eleanor' }, printer);
        return true;
    }
    async function printer(msg)
    {
        console.log(msg);
    }





    const initialize = async function initialize() {
        await initQueueConsumers();
    }

    return {
        initialize,
    }
}