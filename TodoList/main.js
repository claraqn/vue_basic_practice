// https://kr.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = "todos-vuekr-demo";
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    todos.forEach(function (todo, index) {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },
};

var app = new Vue({
  el: "#app",
  data: {
    // 사용할 데이터
    todos: [],
    options: [
      { value: -1, label: "전체" },
      { value: 0, label: "작업 중" },
      { value: 1, label: "완료" },
    ],
    // 선택되어 있는 options의 value를 저장하기 위한 데이터
    // 초깃값은 -1(따라서 "전체")
    current: -1,
  },
  methods: {
    // 사용할 메서드
    // Todo추가
    doAdd: function (event, value) {
      var comment = this.$refs.comment;
      if (!comment.value.length) {
        return;
      }
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0,
      });
      comment.value = "";
    },
    doChangeState: function (item) {
      item.state = item.state ? 0 : 1;
    },
    doRemove: function (item) {
      var index = this.todos.indexOf(item);
      this.todos.splice(index, 1);
    },
    watch: {
      todos: {
        handler: function (todos) {
          todoStorage.save(todos);
        },
        // deep옵션으로 내부 데이터까지 감시
        deep: true,
      },
    },
    created() {
      this.todos = todoStorage.fetch();
    },
  },
  computed: {
    computedTodos: function () {
      // 데이터 current가 -1이라면 전체 출력
      // 이 이외의 경우에는 current와 state의 상태를 기반으로 필터링
      return this.todos.filter(function (el) {
        return this.current < 0 ? true : this.current === el.state;
      }, this);
    },
    labels() {
      return this.options.reduce(function (a, b) {
        return Object.assign(a, { [b.value]: b.label });
      }, {});

      // options 데이터기반으로 value를 label로 변환
      // 키를 기반으로 쉽게 볼 수 있도록 다음과 같이 변환합니다.
      // {0: '작업 중', 1: '완료', -1: '전체'}
    },
  },
});
