<template>
  <div class="hello">
    <input type="button" @click="get" value="ボタン">
    {{ todolist }}
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      todolist: null
    }
  },
  methods: {
    get() {
      this.axios.get("http://localhost:3000/todolist").then(res => {
        console.log(res);
        this.todolist = res["data"][0];
      }).catch(err => {
        console.log(err);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
