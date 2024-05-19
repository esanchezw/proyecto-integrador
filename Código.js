//Recibe un estado y devuelve una matriz con los datos de cada fila
function request(estado1,estado2) {
  

  // var estado1="Abierto";
  // var estado2 = "En proceso"
  var spreadsheet = SpreadsheetApp.openById(ssId);
  var sheeta = spreadsheet.getSheetByName(respuestas);
  var LastR = sheeta.getLastRow();
  var datos = sheeta.getDataRange().getValues();
  var longitud = sheeta.getRange("B2:B" + LastR).getValues();
  var matriz = [];
  var datosCache = ShowValues();
  var sesionActiva = datosCache.name;
  var rolAdmon = datosCache.admon;
  var rolAP = datosCache.aprobador;
  
 // var listaCorreos = listas("admin");
 // var sesionActiva = "esanchez@sedic.com.co";

 

  for (var i = 1; i <= longitud.length; i++) {

    let fechaTicket = datos[i][0];
    let ticket = generadorId();
    let estadoBack = datos[i][2];
    let correo = datos[i][3];
    let nombre = datos[i][4];
    let tipoSolicitud = datos[i][7];
    let descripcion = datos[i][9];
    
    
  
if (estadoBack == estado1 || estadoBack==estado2) {

    if (rolAdmon == "x") {
        
        sesionActiva = "";
        let fechaTi = fechas(fechaTicket);
        var fila = [fechaTi, ticket, estadoBack, correo,nombre,tipoSolicitud,descripcion];
        matriz.push(fila);
        Logger.log("Ingresó admon")

     
      }else if(rolAP == "x" && estadoBack == "Resuelto") {
        
        sesionActiva = "";
        let fechaTick = fechas(fechaTicket);
        var fila =  [fechaTi, ticket, estadoBack, correo,nombre,tipoSolicitud,descripcion];
        matriz.push(fila);
        Logger.log("Ingresó aprobador")

      }else if(gestor == sesionActiva){

       let fechaTick = fechas(fechaTicket);
        var fila =  [fechaTi, ticket, estadoBack, correo,nombre,tipoSolicitud,descripcion];
        matriz.push(fila);
        Logger.log("Ingreso sesion")
      }
    }

  }
   Logger.log(matriz);
  return matriz;

}


function fechas(fecha) {

  if (fecha == "") {
    var fechaRes = "";
    return fechaRes;
  } else {
    var fechaRes = Utilities.formatDate(fecha, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'dd/MM/yyyy');
    return fechaRes;
  }
}



function listas(lista) {
  var ss = SpreadsheetApp.openById(ssId);
  var config = ss.getSheetByName(configuracion);

  //Numero de elementos por cada lista el +2 es para traer los valores directamente
  var nAdmin = config.getRange("B2").getValue() + 2;

  //listas
  var admin = config.getRange(1, 2, config.getLastRow()).getValues();
  //Logger.log(datosCorreo);

  //	var admin = config.getRange("B3:B" + nAdmin).getValues();

  //retorno
  switch (lista) {

    case "admin":
      Logger.log(admin)
      return admin
      break;
  }
}




//Permite traer las observaciones segun el id
function observaciones(id){
  var ss = SpreadsheetApp.openById(ssId);
  var obsBD = ss.getSheetByName(obsPage);
  var lastR = obsBD.getLastRow();
  var data = obsBD.getRange("A2:E"+lastR).getValues();
  var obsById = [];

  for(i=0;i<data.length;i++){
    if(data[i][0] == id){
      var fecha = Utilities.formatDate(data[i][2], SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'dd/MM/yyyy hh:mm')
      obsById.push([data[i][1],fecha,data[i][3],data[i][4]])
    }
  }
  
  return obsById
}

//Permite almacenar las observaciones
function obsToDB(obs,id,ap){
  var datosCache = ShowValues();
  var ss = SpreadsheetApp.openById(ssId);
  var obsBD = ss.getSheetByName(obsPage);
  var lastR = obsBD.getLastRow()+1;

  var fecha = new Date;
  var fechaObs = Utilities.formatDate(fecha, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'dd/MM/yyyy hh:mm')
  if(ap == true){
    var data = [[id,obs,fechaObs,datosCache.name,"x"]]
    obsBD.getRange("A"+lastR+":E"+lastR).setValues(data)
  }else{
    var data = [[id,obs,fechaObs,datosCache.name]]
    obsBD.getRange("A"+lastR+":D"+lastR).setValues(data)
  }
}

//permite llevar el primer esatdo a la BD
function statusToDB(idSol,estado){
  var ss = SpreadsheetApp.openById(ssId);
  var dataBase = ss.getSheetByName(respuestas);
  var datos = dataBase.getDataRange().getValues();
  var index = 0;

  for(i=0;i<datos.length;i++){
    var id = datos[i][2];
    if(id == idSol){
      index = i + 1;
      break
    }
  }

  if(estado == "Cancelado" || estado == "Resuelto"){
    var fecha = new Date;
    var fechaFor = Utilities.formatDate(fecha, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'dd/MM/yyyy hh:mm:ss');
    dataBase.getRange("R"+index).setValue(fechaFor);

    //Colocamos el estado Global
    if(estado == "Resuelto"){
      dataBase.getRange("C"+index).setValue(estado);

      //Enviamos el correo a los aprobadores notificando que hay tickets resueltos
      // correoResuelto(index)
    }

  }else{
    dataBase.getRange("R"+index).setValue("");
  }

  dataBase.getRange("O"+index).setValue(estado)
}

//Permite llevar el segundo estado a la BD
function statusAP(idSol,estado,obs){
  var ss = SpreadsheetApp.openById(ssId);
  var dataBase = ss.getSheetByName(respuestas);
  var datos = dataBase.getDataRange().getValues();
  var index = 0;

  for(i=0;i<datos.length;i++){
    var id = datos[i][13];
    if(id == idSol){
      index = i + 1;
      break
    }
  }

  dataBase.getRange("Z"+index).setValue(estado);
  estadoGlobal(idSol,estado,obs);
}

function correoResuelto(index){
  //Traemos algunos datos de la solicitud de la BD
  var n = index - 1;
  var ss = SpreadsheetApp.openById(ssId);
  var dataBase = ss.getSheetByName(respuestas);
  var config = ss.getSheetByName(configuracion);
  var datos = dataBase.getDataRange().getValues();
  var destinatarios = [];

  let fechaTicket = datos[n][2];
  var fechaT = fechas(fechaTicket)
  let ticket = datos[n][1];
  let servicioReq = datos[n][3];
  let ciudad = datos[n][4];
  let especificacion = datos[n][5];
  let gestor = datos[n][6];
  let observaciones = datos[n][7];
  let estadoBack = datos[n][14];
  let dias = datos[n][24];
  
  //configuración del html
  var plantilla = HtmlService.createTemplateFromFile("resueltoMail");
  
  //exportamos las variables al html
  plantilla.fechaTicket = fechaT;
  plantilla.ticket = ticket;
  plantilla.servicioReq = servicioReq;
  plantilla.ciudad = ciudad;
  plantilla.gestor = gestor;
  plantilla.especificacion = especificacion;
  plantilla.observaciones = observaciones;
  plantilla.estadoBack = estadoBack;
  plantilla.dias = dias;
  
  //traemos el contenido del html
  var cuerpo = plantilla.evaluate().getContent();

  //Obtenemos los destinatarios
  var n = config.getRange("E2").getValue() + 1;
  var correos = config.getRange("A2:A"+n).getValues();
  var aprobadores = config.getRange("H2:H"+n).getValues();

  //Obtenemos los correos de los aprobadores
  for(i=0;i<correos.length;i++){
    if(aprobadores[i][0] != ""){
      destinatarios.push(correos[i][0])
    }
  }

  var toEmails = destinatarios.join(",");


  // Envio de correos
  MailApp.sendEmail({to:toEmails, subject:"Requerimiento Resuelto", 
                      htmlBody: cuerpo, name: "Solicitudes Claro"});

}

function estadoGlobal(codigo, estadoAP,obs) {

  //var codigo = "20210308103202";
  //var estadoAP = "Rechazado";
  var ss = SpreadsheetApp.openById(ssId);
  var sheeta = ss.getSheetByName(respuestas);
  var LastR = sheeta.getLastRow();
  var datos = sheeta.getDataRange().getValues();
  var longitud = sheeta.getRange("B2:B" + LastR).getValues();
  var colum = 27;
  var columEst = 15;

 
  for (var i = 0; i <= longitud.length; i++) {

    let global = "";
    let estado = "";
    let estadoBack = datos[i][26];
    let idRegistro = datos[i][13];


    if (codigo == idRegistro) {
      if (estadoBack == "Resuelto" && estadoAP == "Aprobado") {

        global = "Finalizado";
        estado = "Resuelto";
        var fila = i + 1;
        sheeta.getRange(fila, colum).setValue(global);
        sheeta.getRange(fila, columEst).setValue(estado);

        //Se envia correo a facturación
        enviarCorreo(codigo,global,obs) 
        Logger.log("Finalizado estado Global")
        break;


      } else if (estadoBack == "Resuelto" && estadoAP == "Rechazado" || estadoBack == "Cancelado" && estadoAP == "Rechazado") {

        global = "Reabierto";
        estado = "Abierto";
        var fila = i + 1;
        sheeta.getRange(fila, colum).setValue(global);
        sheeta.getRange(fila, columEst).setValue(estado);
        Logger.log("Reabierto")
        break;

      }
    }
  }
}

function enviarCorreo(idRegistro, global, obs) {

  Logger.log("entra a enviar correo")
  Logger.log(idRegistro)

  // var global = "Finalizado";
  // var idRegistro = "20210308103202";
  // var obs = "Algo"
  var ss = SpreadsheetApp.openById(ssId);
  var sheeta = ss.getSheetByName(respuestas);
  var config = ss.getSheetByName(configuracion);
  var nFact = config.getRange("K2").getValue()+2;
  var LastR = sheeta.getLastRow();
  var datos = sheeta.getDataRange().getValues();
  var longitud = sheeta.getRange("B2:B" + LastR).getValues();
  var correos = config.getRange("K3:K"+nFact).getValues();
  var arrayCorreos = []

  for(i=0;i<nFact-2;i++){
    arrayCorreos.push(correos[i][0])
  }


  for (var i = 0; i < datos.length; i++) {

    let ticket = datos[i][1];
    let gestor = datos[i][6];
    let fechaC = datos[i][17];
    let codigo = datos[i][13];

    Logger.log(codigo)

    if (codigo == idRegistro) {


      Logger.log("el codigo es " + codigo)

      var plantillaU = HtmlService.createTemplateFromFile("Plantilla");
      var fechaCierre = fechas(fechaC)


      plantillaU.ticket = ticket;
      plantillaU.estado = global;
      plantillaU.observaciones = obs;
      plantillaU.gestor = gestor;
      plantillaU.fechaCierre = fechaCierre;

      var cuerpoCorreo = plantillaU.evaluate().getContent();
      var asunto = "Ticket aprobado";

      MailApp.sendEmail({
        to: arrayCorreos.join(","),
        subject: asunto,
        htmlBody: cuerpoCorreo,
        name: "Informe facturación"
      });
    }
  }
}

function generadorId() {

  var ahora = new Date();
  var hora = ahora.getHours();
  var minutos = ahora.getMinutes();
  var milisegundos = ahora.getMilliseconds();
  var dia = ahora.getDay();
  var mes = ahora.getUTCMonth();
  var year = ahora.getFullYear();

  var id = `${hora}${minutos}${milisegundos}${dia}${mes}${year}`;
  return id;

}





