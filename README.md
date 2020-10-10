# slack-docker-compose

A Slack integration to notify Docker compose events. Inspired by [slack-docker] (https://github.com/int128/slack-docker)

Optimized for monitoring docker compose events (network creation, network removal and specific container restart).

## How to Run

Set up [an incoming WebHook integration](https://my.slack.com/services/new/incoming-webhook) and get the Webhook URL.

Run a container as follows:

```sh
# Docker
docker run -d -e webhook=URL -v /var/run/docker.sock:/var/run/docker.sock sobolmisha/slack-docker-compose

# Docker Compose
curl -O https://raw.githubusercontent.com/varvar/docker-compose-slack/master/docker-compose.yml
docker-compose up -d
```

## Contribution

Please let me know an issue or pull request.
