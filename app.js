const docker = require('dockerode');
const dockerEvents = require('docker-events');
const { IncomingWebhook } = require('@slack/webhook');
const networkEventsPlaceholders = require('./network-events');

const imageRegExp = new RegExp(process.env.image_regexp);
const dockerInstance = new docker({socketPath: '/var/run/docker.sock'});

const slackWebhook = new IncomingWebhook(process.env.webhook,{
  username: 'docker',
  iconEmoji: ':whale:',
});

const emitter = new dockerEvents({
  docker: dockerInstance
});

async function sendEvent(event) {
  console.info(event);
  hostname_string = '';
  if (process.env.include_hostname) {
    hostname_string = '@ ' + process.env.HOSTNAME
  }

  if (imageRegExp.test(event.from)) {
    const networkEvent = networkEventsPlaceholders[`${event.Type}_${event.Action}`];
    if (networkEvent) {
      const notification = networkEvent(event);
      if (notification) {
        await slackWebhook.send({
          username: `docker ${event.Type} ${event.Actor.Attributes.name} ${hostname_string}`,
          attachments: [notification],
        });
      }
    }
  }
}

async function eventsEmitter() {
  emitter.start();

  emitter.on("connect", async () => {
    const version = await dockerInstance.version();
    await slackWebhook.send({
      text: `Docker is running and connected to API. Engine version: ${version.Version}`,
      color: 'good',
    });
  });

  emitter.on("disconnect", function() {
    console.log(`Disconnected from docker api.`);
  });

  emitter.on("_message", (message) => {
    sendEvent(message).catch(handleError)
  });
}

async function init() {
  await eventsEmitter();
}

function handleError(e) {
  console.error(e);
  slackWebhook.send({
    text: `${e.message}`,
    color: 'warning',
  }).catch(console.error);
}

function exitHandler(options, err) {
  slackWebhook.send({
    text: `${err.message}`,
    color: 'warning',
  }).catch(console.error);
  if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
  slackWebhook.send({
    text: `${err.message}`,
    color: 'warning',
  }).catch(console.error);
});

init().catch(handleError);
