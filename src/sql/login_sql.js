const queryLoginAccess = () => {
    let data = "SELECT idUser FROM hnt_Users " +
        "WHERE nameUser = @nameUser  AND password =  @password "
    return data;
}
const queryModules = (user) => {
    let data = "SELECT B.* FROM hnt_ConfigPermissions A " +
        "LEFT JOIN hnt_ConfigModules B ON A.idModules = B.idModules " +
        "LEFT JOIN hnt_Users C ON C.idRole = A.idRole " +
        "WHERE C.idRole =" + user.idUser;
    console.log(data);
    return data;
}
module.exports = { queryLoginAccess, queryModules };
