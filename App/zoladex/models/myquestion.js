steal('jquery/model', function () {

    Zoladex.Models.WebSqlModel('Zoladex.Models.MyQuestion',
  {
      findAll: function (params) {
          var sql = 'SELECT * FROM MyQuestions';
          return localStorageDB.getRows(sql, this);
      },

      findOne: function (id) {

          var result = localStorageDB.getSingleRow('SELECT * FROM MyQuestions WHERE id =' + id, this);
          steal.dev.log("result is:");
          steal.dev.log(result);
          return result;
      },
      tableName: "MyQuestions"
  },
  {
});
})