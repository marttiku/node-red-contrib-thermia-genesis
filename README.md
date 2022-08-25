# node-red-contrib-thermia

Node-red node to integrate with Thermia Genesis heat-pumps. Based on webapp  https://www.online-genesis.thermia.se/

## Quick start

Install the component

## Configuration

Enter your credentials for https://www.online-genesis.thermia.se/ in node configuration screen. It would be a good practice to create a sepearate user for the component. 

If you have severeal pumps 

## Inputs

### msg.action

setTemperature - set point for the room temperature. Parms in payload

```
msg = {
    action: 'setTemperature', 
    payload: 22               // set point for the room temperature
}
```

setHotWater - set boiler status

```
msg = {
    action: 'setHotWater', 
    payload: false               // turn boiler off
}
```

### Any other input

Status update

## Outputs

Status of the heat pump

```
msg.payload = {
    hotWaterTemperature: 54,        // current hot water temperature
    heatingEffect: 22,              // current set point for the room temperature
    outdoorTemperature: 29,         // outdoor sensor value
    hotWaterStatus: false           // boiler off
}
```
