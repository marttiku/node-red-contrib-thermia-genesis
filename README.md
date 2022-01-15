# node-red-contrib-thermia

Node-red node to integrate with Thermia Genesis heat-pumps. Based on webapp  https://www.online-genesis.thermia.se/

## Quick start

Install the component

## Configuration

Input your credentials for https://www.online-genesis.thermia.se/ in node configuration screen. It would be a good practice to create a sepearate user for the component.

## Inputs

### msg.action

setTemperature - set point for the room temperature. Parms in payload

`msg = {
    action: 'setTemperature', 
    payload: 22               // set point for the room temperature
}`

### Any other input

Status update

## Outputs

Status of the heat pump

`msg.payload = {
    hotWaterTemperature: 54,        // current hot water temperature
    heatingEffect: 22               // set point for the room temperature
}`
