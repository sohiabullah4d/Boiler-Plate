module.exports = function AuthRequestHandlers(opts) {

    const { authMediator, mdRabbitMq } = opts;



    async function test(request, reply) {
        const { body, elSession } = request;
        console.log('test') 
        //const sent = await authMediator.test({ ...body, session: elSession });
        //mdRabbitMq.send({queue: 'q-eleanor-requests', payload: { msg: 'Hello WOrkd'}})
        mdRabbitMq.sendToExchange({ exchange: 'x-eleanor', route: 'eleanor-notifications', payload: { msg: 'Hello WOrkd'}});
        //reply.send(JSON.stringify(sent));
        reply.send('send to queee');
    }
    return {
        test
    }
}