//https://github.com/siimon/prom-client sigo tomando en cuenta este link

import client from 'prom-client';

const totalTransactions = new client.Counter({
    name: 'total_transactions',
    help: 'Total number of transactions',
    labelNames: ['type', 'status']
});

const failedLoginAttempts = new client.Counter({
    name: 'failed_login_attempts',
    help: 'Total number of failed login attempts',
    labelNames: ['reason']
})

const users_logged_in = new client.Gauge({
    name: 'active_users',
    help: 'Number of logged in users',
})

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics();

export { totalTransactions, failedLoginAttempts, users_logged_in };