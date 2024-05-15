
const queryTokenAccess = () => {
    let data = "SELECT * FROM hnt_Users "+
                "WHERE nameUser = @nameUser AND password = @password"
  return data;
}

module.exports = { queryTokenAccess };
