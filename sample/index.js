const Thermia = require('../lib/thermia-genesis')

const credentials = {       // replace with your user name and password
    username:'user',        
    password:'password'
}

const thermia = new Thermia()

const main = async (login) => {

let connected = await thermia.login(login.username, login.password)
            
if (!connected) {
    console.log('connection failed')
    return
}
    console.log('connected')
    console.log(thermia.installations)
    console.log(thermia.status)
    await thermia.setTemperature(20)
    await thermia.setHotWater(true)
    console.log(await thermia.getStatus())
}
 
main(credentials)
