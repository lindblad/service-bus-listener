const azure = require('azure-sb');
const Agent = require('agentkeepalive').HttpsAgent;

const keepaliveAgent = new Agent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000
});

class ServiceBusClient {
  constructor(options) {
    this.serviceBus = azure.createServiceBusService(options.serviceBusConnection);
    this.serviceBus.setAgent(keepaliveAgent);
  }

  async createTopic(topic) {
    return new Promise((resolve, reject) => {
      this.serviceBus.createTopicIfNotExists(topic, function (error) {
        if (error) {
          return reject(error);
        }

        return resolve();
      });
    });
  }

  async createSubscription(topic, subscription) {
    return new Promise(((resolve, reject) => {
        this.serviceBus.createSubscription(topic, subscription, function (error) {
          if (error) {
            return reject(error);
          }

          return resolve();
        });
      }
    ));
  }

  async createTopicAndSubscription(topic, subscription) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.createTopic(topic, function (error) {
        if (error){
          return reject(error);
        }
        self.createSubscription(topic, subscription, function (err) {
          if (error) {
            return reject(err);
          }

          return resolve();
        });
      });
    });
  }

  async receiveSubscriptionMessage(topic, subscription) {
    return new Promise((resolve, reject) => {
      this.serviceBus.receiveSubscriptionMessage(topic, subscription, function (error, message) {
        if(error) {
          return reject(error);
        }

        return resolve(message);
      });
    });
  }

  async sendTopicMessage(topic, message) {
    return new Promise((resolve, reject) => {
      this.serviceBus.sendTopicMessage(topic, JSON.stringify(message), function(error) {
        if (error) {
          return reject(error);
        }

        return resolve();
      });
    });
  }
}

module.exports = ServiceBusClient;
