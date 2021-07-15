<template>
  <div id="search-ip">
    <div>
      
      <div>
        <input @click="getIp" type="button" value="IPを取得">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SearchIp',
    methods: {
      getIp() {
        this.axios.get('https://httpbin.org/get')
          .then((response) => {
            alert(response.data.origin);
          })
          .catch((e) => {
            alert(e);
          });
      }
    }
  }
</script>

