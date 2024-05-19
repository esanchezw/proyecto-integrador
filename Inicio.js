var ss= SpreadsheetApp.openById("1ktdDNTQViCfke-pU6XEBGeIWYZ4h7pOpkP4dgy21IbU");
var config= ss.getSheetByName("Config");
var ncorreos= config.getRange("E2").getValue();
var respuestas= ss.getSheetByName("Respuestas de formulario 5");


function registro(e) {

Logger.log("form "+e)
  var tiempo = e.values[0];
  var tclaro=e.values[4];
  
  var lastrow = respuestas.getLastRow();
  var conten=[tiempo,tclaro,lastrow];
  var conscorreo=crearconsecutivo(conten);
  

   respuestas.getRange("B9").setValue(conscorreo[1]);
   respuestas.getRange("C9").setValue("Abierto");
  
/*
  //configuración del html
  var plantilla = HtmlService.createTemplateFromFile("correo");
  
  //exportamos las variables al html
  plantilla.consecutivo = conscorreo[1];
  plantilla.tclaro = tclaro;
  plantilla.fclaro = fclaro;
  plantilla.servicio = servicio;
  plantilla.ciudad = ciudad;
  plantilla.espec=espec;
  
  //traemos el contenido del html
  var cuerpo = plantilla.evaluate().getContent();

  // Envio de correos

      respuestas.getRange("P"+lastrow).setValue(conscorreo[0]);
      respuestas.getRange("N"+lastrow).setValue(conscorreo[1]);
      MailApp.sendEmail({to:conscorreo[0], subject:"Tienes un nuevo requerimiento", 
                           htmlBody: cuerpo, name: "Solicitudes Claro"});  //, inlineImages:{logo:logoBlob}
      respuestas.getRange("Q"+lastrow).setValue("Enviado");
      respuestas.getRange("O"+lastrow).setValue("Abierto");
  */
}


function crearconsecutivo(conten){
  var tiempo = conten[0]; 
  var gestor = conten[6];
  //extraigo la fecha de las celdas de columna 0 y separo la fecha por año , mes y día
    var d= tiempo.substr(0,2);
    if (isNaN(d)==false){
      var d= tiempo.substr(0,2);
      var m= tiempo.substr(3,2);
        if (isNaN(m)==false){
          var a= tiempo.substr(6,4);
        }
        else{
          var m=  '0' + tiempo.substr(3,1);
          var a= tiempo.substr(5,4);
        }
    }
    else {
      var d=  '0' + tiempo.substr(0,1); 
      var m= tiempo.substr(2,2);
        if (isNaN(m)==false){
          var a= tiempo.substr(5,4);
        }
        else{
          var m=  '0' + tiempo.substr(2,1);
          var a= tiempo.substr(4,4);
        }
    }
   
   // Buscamos dentro de los correos configurados el que corresponda al personal asginado
   ncorreos=ncorreos+1;
   var correos=config.getRange("A2:D"+ncorreos).getValues();
   for(i=0;i<correos.length;i++){
      
      var persona = correos[i][1];
      
      //Cuando encontramos el correo enviamos el mensaje con la info de la solicitud
      if(persona == gestor){
        var correo = correos[i][3];
        var codg= correos[i][3];
        break;
      }
    }
  coda=codale();
// Retornamos un array que tiene el correo y el consecutivo
   var consecutivo=a+m+d+coda+conten[7];
   var cc=[correo,consecutivo];

return cc;
}

function codale(){


   var cod1= Math.floor(Math.random()*(80 -(10 -1))) + 10;
   
  return cod1;
}




