//Variables globales
var rutaWeb = ScriptApp.getService().getUrl();
//var rutaWeb = 'https://script.google.com/a/macros/americana.edu.co/s/AKfycbzfiJipvWYR2VnCwCwVTiUKvNDYl2u7ok6ki9D6_Qyn/dev;'
var ssId = "1ktdDNTQViCfke-pU6XEBGeIWYZ4h7pOpkP4dgy21IbU";
var respuestas = "Respuestas de formulario 1";
var configuracion = "config";
var obsPage = "Observaciones"
var datos = {}; 




//Esta funcion inicia la llamada de la pagina y recibe peticiones de tipo GET

function doGet(e) {  

  var page = e.parameter.p || 'index';
  PutValues("", "", "", "", "");
  
    var html = HtmlService.createTemplateFromFile(page);
  html.mensaje = "";

  return html.evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=yes')
    .setTitle('MESA DE AYUDA')
    .setFaviconUrl('https://drive.google.com/uc?id=16Mkl3gMk-UxVl_QlgZ4lNPkEqCEVuatJ#.ico');
  
  
}
//Close función doGet

function pru(){
   var datos = ShowValues();
  var bool = datos.login;
  console.log(bool); 
  //https://script.google.com/a/macros/americana.edu.co/s/AKfycbzfiJipvWYR2VnCwCwVTiUKvNDYl2u7ok6ki9D6_Qyn/dev?p=Solicitudes
}

//Esta funcion recibe peticiones y parametros de tipo POST
function doPost(e) {

  Logger.log(JSON.stringify(e));

  var user = e.parameter.username || " ";
  var password = e.parameter.password || " ";

  Logger.log(typeof (user));
  Logger.log(typeof (password));

  datos = checkLogin(user, password);
  Logger.log("estado return " + datos.sw);


  if (datos.sw) {

    //Enviamos los datos a la memoria cache
    PutValues(datos.correo, datos.nombre, datos.contrasena, datos.rolAdmon, datos.rolAprobador);
    ShowValues();

    var page = e.parameter.btnLogin || 'Gestion';

    var html = HtmlService.createTemplateFromFile(page);
    html.mensaje = "";
    return html.evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=yes')
      .setTitle('MESA DE AYUDA')
    .setFaviconUrl('https://drive.google.com/uc?id=16Mkl3gMk-UxVl_QlgZ4lNPkEqCEVuatJ#.ico');

  } else if (e.parameter.btnLogin != "") {

    var cacheVal = ShowValues();
    var datos = checkLogin(cacheVal.email, cacheVal.pass);
    Logger.log("El valor dentro del if es " + datos.sw);

    if (datos.sw && e.parameter.btnLogin == "index") {
      PutValues("", "", "", "", "");
      var page = 'index';

      var html = HtmlService.createTemplateFromFile(page);
      html.mensaje = "";
      return html.evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=yes')
        .setTitle('MESA DE AYUDA')
    .setFaviconUrl('https://drive.google.com/uc?id=16Mkl3gMk-UxVl_QlgZ4lNPkEqCEVuatJ#.ico');


    } else if (datos.sw && datos.rolAprobador == "x" && e.parameter.btnLogin == "Aprobacion") {

      var page = "Aprobacion";

      var html = HtmlService.createTemplateFromFile(page);
      html.mensaje = "";
      return html.evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=yes')
        .setTitle('MESA DE AYUDA')
    .setFaviconUrl('https://drive.google.com/uc?id=16Mkl3gMk-UxVl_QlgZ4lNPkEqCEVuatJ#.ico');

    } else if (datos.sw && datos.rolAprobador != "x" && e.parameter.btnLogin == "Aprobacion") {

      var page = "Pagina_Error";

      var html = HtmlService.createTemplateFromFile(page);
      html.mensaje = "";
      return html.evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=yes')
        .setTitle('MESA DE AYUDA')
    .setFaviconUrl('https://drive.google.com/uc?id=16Mkl3gMk-UxVl_QlgZ4lNPkEqCEVuatJ#.ico');
    } else if (datos.sw) {

      var page = e.parameter.btnLogin;

      var html = HtmlService.createTemplateFromFile(page);
      html.mensaje = "";
      return html.evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=yes')
       .setTitle('MESA DE AYUDA')
    .setFaviconUrl('https://drive.google.com/uc?id=16Mkl3gMk-UxVl_QlgZ4lNPkEqCEVuatJ#.ico');

    } else {

      var page = 'index';
      PutValues("", "", "", "", "");

      var html = HtmlService.createTemplateFromFile(page);
      html.mensaje = "";
      return html.evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=yes')
        .setTitle('MESA DE AYUDA')
    .setFaviconUrl('https://drive.google.com/uc?id=16Mkl3gMk-UxVl_QlgZ4lNPkEqCEVuatJ#.ico');


    }

  } else if (datos.sw == false && user == " " || password == " ") {

    var page = 'index';
    PutValues("", "", "", "", "");


    var html = HtmlService.createTemplateFromFile(page);
    html.mensaje = "";
    return html.evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=yes')
      .setTitle('MESA DE AYUDA')
    .setFaviconUrl('https://drive.google.com/uc?id=16Mkl3gMk-UxVl_QlgZ4lNPkEqCEVuatJ#.ico');

  } else {

    var page = 'index';
    PutValues("", "", "", "", "");

    var html = HtmlService.createTemplateFromFile(page);
    html.mensaje = "Usuario o contraseña incorrectos";
    return html.evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=yes')
      .setTitle('MESA DE AYUDA')
    .setFaviconUrl('https://drive.google.com/uc?id=16Mkl3gMk-UxVl_QlgZ4lNPkEqCEVuatJ#.ico');
  }
}
//Close función POST



//Esta función referncia las los archivos declarados como html
function include(filename) {

  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
//Close include


//Esta funcion valida si el usuario y la contraseña ingresados en el input son iguales a los de la base de datos
function checkLogin(user, password) {

  var spreadsheet = SpreadsheetApp.openById(ssId);
  var sheeta = spreadsheet.getSheetByName(configuracion);
  var LastR = sheeta.getLastRow();
  var datos = sheeta.getDataRange().getValues();
  var longitud = sheeta.getRange("A2:A" + LastR).getValues();
  //var user = "Edwin";
  //var password = "Medellin123";
  var sw = false;

  for (var i = 0; i <= longitud.length; i++) {


    let correo = datos[i][0];
    let nombre = datos[i][1];
    let contrasena = datos[i][2];
    let rolAdmon = datos[i][6];
    let rolAprobador = datos[i][7];

    var obj = {
      correo: correo,
      nombre: nombre,
      sw: sw,
      contrasena: contrasena,
      rolAdmon: rolAdmon,
      rolAprobador: rolAprobador
    };



    if (correo != "" && user != "" && password != "" && contrasena != "") {
      //if (usuario.toUpperCase() == user.toUpperCase() && password == contrasena) {
      if (correo == user && password == contrasena) {

        sw = true;
        break;
      }
    } else {

      obj.sw = false;
    }
  } //Close for

  if (sw == true) {


    obj.sw = sw;

    return obj;

  } else {

    obj.sw = sw;
    return obj;
  }
}
//Close checkLogin



//Esta función envia los datos obtenidos por parametros y los guarda en la memoria cahce
function PutValues(email, name, password, rolAdmon, rolAprobador) {

  var cache = CacheService.getUserCache();
  // var cache = CacheService.getScriptCache();
  //Se guardan los datos en cache durante 1 hora
  cache.put("EMAIL", email, 3600);
  cache.put("NAME", name, 3600);
  cache.put("PASS", password, 3600);
  cache.put("ADMON", rolAdmon, 3600);
  cache.put("APROB", rolAprobador, 3600);


}
//Close putValues



//Esta función obtiene los datos guardados en la memoria cahce
function ShowValues() {
  var cache = CacheService.getUserCache();
  //var cache = CacheService.getScriptCache();

var email = cache.get("EMAIL");
  var name = cache.get("NAME");
  var pass = cache.get("PASS");
  var admon = cache.get("ADMON");
  var aprobador = cache.get("APROB");
  Logger.log(email + " : " + name + " : " + pass + " : " + admon + " : " + aprobador);

  var objVal = {
    login: true,
    email: email,
    name: name,
    pass: pass,
    admon: admon,
    aprobador, aprobador


  };
  return objVal;
  
  
}
//Close ShowValues




//Esta función envia los datos obtenidos en memoria cache y los envia al front
function allValues() {
  var datosUser = ShowValues();
  return datosUser;

}