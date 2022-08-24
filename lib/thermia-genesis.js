const axios = require('axios')
const REGISTER_HOTWATER = 1059
const GROUP_HOTWATER = 'REG_GROUP_HOT_WATER'
const Uuid = "e5e16b36-e130-4d6d-886b-94f5087d5a30"

function Thermia() {

    this.connection = null
    this.installations = null
    this.status = null
    this.register_hotwater = REGISTER_HOTWATER
    this.register_temp = null
    this.uiUrl = 'https://thermia-auth-api.azurewebsites.net/api/v1/Jwt/login'
    this.apiUrl = 'https://online-genesis-serviceapi.azurewebsites.net/api/v1'


    this.login = async function(user, pass) {
        let response
        try {
            response = await axios.post(this.uiUrl,
                { 
                    userName: user, 
                    password: pass, 
                    rememberMe: false
                }
            )
        }
        catch(e) {
            this.status = e
        }
        finally {
            if (response?.data?.isAuthenticated) {
                this.connection = response.data
                await this.getInstallationInfo()
                await this.getStatus()
                this.register_temp = this.status.heatingEffectRegisters[1]
                return true
            }
            return false
        }

    }
    
    this.headers = function() {
        const headers = {
            'accept': 'application/json, text/plain, */*',
            'sec-ch-ua':'" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': "macOS",
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'origin': 'https://www.online-genesis.thermia.se',
            'referer': 'https://www.online-genesis.thermia.se/',
            'authorization': 'Bearer '+this.connection.token
        }
        return headers
    }
   
    this.getInstallationInfo = async function() {
        let response = await axios.get(
            this.apiUrl + '/installationsInfo?offset=0'
            ,
            {
                headers: this.headers()
            }
        )
        this.installations = response.data.items
        return this.installations
    }

    this.getStatus = async function(id = null) {
        let response = await axios.get(
            `${this.apiUrl}/installationstatus/${id?id:this.installations[0].id}/status`,
            {
                headers: this.headers()
            }
        )
        this.status = response.data
        return  this.status
    }

    this.setRegister = async function(register, value, id = 0) {
        let response = await axios.post(
            `${this.apiUrl}/Registers/Installations/${id?id:this.installations[0].id}/Registers`,
            {
                registerIndex: register, 
                registerValue: value, 
                clientUuid: Uuid

            }, 
            {
                headers: this.headers()
            }
        )
        return response
    }

    this.getRegisterGroup = async function(group, id = 0) {
        let response = await axios.get(
            `${this.apiUrl}/Registers/Installations/${id?id:this.installations[0].id}/Groups/${group}`,
            {
                headers: this.headers()
            }
        )
        return response
    }

    this.setTemperature = async function(temp, id = 0) {
        let response = await this.setRegister(this.register_temp, temp, id)
        return response
    }
    
    this.setHotWater = async function(status, id = 0) {
        let response = await this.setRegister(this.register_hotwater, status?1:0, id)
        return response
    }

    this.getHotWaterStatus = async function(id = 0) {
        let response = await this.getRegisterGroup(GROUP_HOTWATER, id)
        return response
    }
}

module.exports = Thermia
