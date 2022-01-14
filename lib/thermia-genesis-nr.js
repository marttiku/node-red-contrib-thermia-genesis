const thermia = require('./thermia-genesis')

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
            
            if (thermia.installations === null) 
                await thermia.getInstallationInfo()

            if (msg.action && thermia[msg.action])
                await thermia[msg.action](msg.payload)

            await thermia.getStatus()
            msg.payload = (({hotWaterTemperature, heatingEffect})=>({hotWaterTemperature, heatingEffect}))(thermia.status)
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