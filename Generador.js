function generadorIds() {

  var ss = SpreadsheetApp.openById(ssId);
  var sheeta = ss.getSheetByName(respuestas);
  var LastR = sheeta.getLastRow();
 
  var ahora = new Date();
  var hora = ahora.getHours();
  var minutos = ahora.getMinutes();
  var milisegundos = ahora.getMilliseconds();
  var dia = ahora.getDay();
  var mes = ahora.getUTCMonth();
  var year = ahora.getFullYear();
  var estado = "Abierto";
  var id = `${hora}${minutos}${milisegundos}${dia}${mes}${year}`;
   sheeta.getRange(LastR, 2).setValue(id);
   sheeta.getRange(LastR, 3).setValue(estado);
 

}