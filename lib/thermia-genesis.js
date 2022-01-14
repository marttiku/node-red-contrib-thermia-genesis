const axios = require('axios')

const REGISTER_TEMP = 3
const REGISTER_HOTWATER = 1059
const Uuid = "e5e16b36-e130-4d6d-886b-94f5087d5a30"

const thermia = {
    connection: null,
    installations: null,
    status: null,
    uiUrl: 'https://thermia-auth-api.azurewebsites.net/api/v1/Jwt/login',
    apiUrl: 'https://online-genesis-serviceapi.azurewebsites.net/api/v1',

    login: async function(user, pass) {
        let response = await axios.post(this.uiUrl,
            { 
                userName: user, 
                password: pass, 
                rememberMe: false
            }
        )
        if (response.data.isAuthenticated) {
            this.connection = response.data
        }
        return response.data.isAuthenticated
    },
    headers: function() {
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
    },
    getInstallationInfo: async function() {
        let response = await axios.get(
            this.apiUrl + '/installationsInfo?offset=0&limit=10'
            ,
            {
                headers: this.headers()
            }
        )
        this.installations = response.data.installations
        return response
    },
    getStatus: async function(id = 0) {
        let response = await axios.get(
            this.apiUrl + '/installationstatus/'+this.installations[id].id+'/status'
            ,
            {
                headers: this.headers()
            }
        )
        this.status = response.data
        return response
    },

    setRegister: async function(register, value, installationID = 0) {
        let response = await axios.post(
            this.apiUrl + '/Registers/Installations/'+this.installations[installationID].id+'/Registers',
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
    },

    setTemperature: async function(temp) {
        let response = await this.setRegister(REGISTER_TEMP, temp)
        return response
    },
    
    setHotWater: async function(status) {
        let response = await this.setRegister(REGISTER_HOTWATER, status?1:0)
        return response
    },
}

module.exports = thermia
