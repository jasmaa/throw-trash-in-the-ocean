# Notes

## Overview
  - Let players connect to a shared world where they can profit at the cost of polluting the world
  - World automatically recovers over time
  - If pollution surpasses a threshold, world is permanently destroyed
  - A player cannot single-handedly destroy the world

## Models
  - world
    - name
    - pollution_level
    - pollution_threshold
    - is_dead

  - player
    - player_id
    - name

  - event
    - event_type
    - description

## Actions

### Client Actions
  - join: join room
  - pollute: contribute 1 pollution unit
  - change_name: change player_name
  - leave: leave room

### Server Actions
  - log, {event}: log event
  - sync, {...}: sync world stats and state

## Backend
  - Client sends WebSocket commands to server, server syncs with all clients periodically
  - Deal with bots + throttle pollute??

## Client
  - React client
  - Client acts similarly to cookie clicker
  - UI
    - Pollution UI
    - Event log
    - view and stats of the world

