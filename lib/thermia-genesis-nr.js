const Thermia = require('./thermia-genesis')
const thermia = new Thermia()

module.exports = function(RED) {
    function thermiaNode(config) {
        RED.nodes.createNode(this,config)
        const node = this
        node.on('input', async function(msg) {
            let connected = await thermia.login(this.credentials.username, this.credentials.password)
            
            if (connected) 
                this.status({fill:"green",shape:"dot",text:"connected"})
            else
                {
                    this.status({fill:"red",shape:"ring",text:"disconnected"})
                    this.error("Login failed");
                    return
                }
            
            if (msg.action && thermia[msg.action]) {
                await thermia[msg.action](msg.payload, this.installationid)
            }

            await thermia.getStatus(this.installationid)
            let hotWaterStatus = await thermia.getHotWaterStatus(this.installationid)
            msg.payload = (({outdoorTemperature, hotWaterTemperature, heatingEffect})=>({outdoorTemperature, hotWaterTemperature, heatingEffect}))(thermia.status)
            msg.payload.hotWaterStatus = !!hotWaterStatus.data[0].registerValue
            node.send(msg)
        })
    }
    RED.nodes.registerType("thermia-genesis",thermiaNode,{
        credentials: {
            username: {type:"text"},
            password: {type:"password"}
        }
    });
}