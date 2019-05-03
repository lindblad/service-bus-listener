const ServiceBusClient = require('../lib/azure-sb-client');
const Timeout = require('await-timeout');

class ServiceBusWatcher {
  constructor({ connectionString, subscriptionName, topicName }) {
    this.serviceBusClient = new ServiceBusClient({serviceBusConnection: connectionString});
    this.subscriptionName = subscriptionName;
    this.topicName = topicName;
  }

  start() {
    console.info(`Listening to topic ${this.topicName}, subscription ${this.subscriptionName}`);
    const receiveJob = async () => {
      try {
        const { body: msg } = await this.serviceBusClient.receiveSubscriptionMessage(this.topicName, this.subscriptionName);
        console.log(msg);
      } catch (e) {
        console.error(e.message || JSON.stringify(e));
      }

      await Timeout.set(2000);
      await receiveJob();
    };

    setTimeout(receiveJob, 2000);
  }
}

module.exports = ServiceBusWatcher;
