module.exports.container_restart = event => ({
  color: 'warning',
  text: `Restarted container \`${event.Actor.Attributes.name}\``,
  mrkdwn_in: ['text'],
  fields: [
    {short: true, title: 'Image', value: event.Actor.Attributes.image},
    {title: 'Container ID', value: event.Actor.ID}
  ]
});

module.exports.network_create = event => ({
  color: 'good',
  text: `Created network \`${event.Actor.Attributes.name}\``,
  mrkdwn_in: ['text']
});

module.exports.network_destroy = event => ({
  color: 'warning',
  text: `Removed network \`${event.Actor.Attributes.name}\``,
  mrkdwn_in: ['text']
});
