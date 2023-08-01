<template>
  <div  style="display: inline-flex;">
    <div class="left-panel">
      <h3 class="title">Devices</h3>
      <div v-for="device in devices" v-bind:key="device.id"  >
        <p class="device-select">
          <button v-on:click="selectDevice(device.id)" >
            {{ device.vendor }} {{device.model}}
          </button>
        </p>
      </div>
      <hr/>
      <div style="">
      <h4 class="">Linked Devices</h4>
      <div v-for="device in devices" v-bind:key="device.id"  >
        <p class="device-select">
          <button v-on:click="selectDevice(device.id)" >
            {{ device.vendor }} {{device.model}}
          </button>
        </p>
      </div>
      </div>
    </div>
    <div class="center-panel" >
     <h3>{{ selectedDevice.vendor }} {{selectedDevice.model}}</h3>
     <h5 class="">IMEI: {{selectedDevice.imeiOne}}</h5>
     <h5 class="curr_status">{{currStatus}}</h5>
     <h5 class="battery">Battery {{deviceStatus.batteryLife}}%</h5>
     <div style="margin-bottom: 20px;">
        <button v-on:click="commandDevice('lock')" >
          Lock
        </button>
        <button v-on:click="commandDevice('ring')" >
          Ring
        </button>
        <button v-on:click="commandDevice('erase')" >
          Erase
        </button>
      </div>
     <hr/>
      <div>
        <button v-on:click="getContacts()" >
          Find
        </button>
        <button v-on:click="getContacts()" >
          Contacts
        </button>
        <button v-on:click="getMessages()" >
          Messages
        </button>
         <button v-on:click="getCallLogs()" >
          Call logs
        </button>
      </div>
      <hr/>
      <div>
        {{backup_message}}
        {{contactBackup}}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default{
  name: 'DeviceDetails',
  mounted () {
    this.getDevices()
  },
  data () {
    return {
      devices: [],
      selectedDevice: {},
      deviceId: null,
      deviceStatus: {},
      contactBackup: null,
      callLogBackup: {},
      textBackup: {},
      backup_message: '',
      backupDisplay: 'çontacts'
    }
  },
  computed: {
    currStatus () {
      if (this.deviceStatus.currentStatus === 'offline') {
        return 'last seen: ' + this.deviceStatus.lastActive
      } else {
        return this.deviceStatus.currentStatus
      }
    }
  },
  methods: {
    getDevices () {
      axios.get('http://localhost:8080/device/user/85d0e55c-bd4c-4e06-9921-ab38a1c78c0f')
        .then((response) => {
          this.devices = response.data
          this.selectedDevice = response.data[0]
          this.deviceId = this.selectedDevice.deviceId
          this.deviceStatus = this.selectedDevice.status[0]
          this.getContacts()
        })
        .catch((error) => {
          console.log('GET call unsuccessful :(', error)
        })
    },
    selectDevice (id) {
      this.selectedDevice = this.devices.find(device => device.id === id)
      this.deviceId = this.selectedDevice.deviceId
      this.deviceStatus = this.selectedDevice.status[0]
      this.getContacts()
    },
    getContacts () {
      axios.get('http://localhost:8080/backup/contacts/' + this.deviceId)
        .then((response) => {
          if (response.status === 404) {
            this.backup_message = 'No contact backup'
          } else {
            this.contactBackup = response.data
          }
        })
        .catch((error) => {
          console.log('GET call unsuccessful :(', error)
          this.backup_message = 'No contact backup'
        })
    },
    getMessages () {

    },
    getCallLogs () {

    },
    commandDevice (command) {
      const commandObj = {
        'command': command,
        'status': 'active',
        'extraText': null
      }
      axios.post('http://localhost:8080/device/command/' + this.deviceId, commandObj)
        .then((response) => {
          console.log(response.data)
        })
        .catch((error) => {
          console.log('GET call unsuccessful :(', error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .left-panel, .center-panel {
    border: 1px solid gray;
    padding: 20px;
    text-align: center;
  }
  .device-select {
    margin-top: 25px;
    border-radius: 3px;
  }
  .device-select > button {
    padding: 6px;
  }
</style>
