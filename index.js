const ServiceBusWatcher = require('./services/subscription-sb-watcher');

const { subscriptionName, topicName, connectionString } = {
  subscriptionName: '/*YOUR SUBCRIPTION NAME HERE*/',
  topicName: '/*YOUR TOPIC NAME HERE*/',
  connectionString: '/*YOUR CONNECTION STRING HERE*/'
};

const serviceBusWatcher = new ServiceBusWatcher({connectionString, subscriptionName, topicName});

serviceBusWatcher.start();