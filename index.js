const div = document.createElement('div');
    document.body.appendChild(div);

    // Data di inizio - 7 Giorni
    function subtractDaysFromDate(currentDate, daysToSubtract) {
        daysToSubtract = daysToSubtract || 0
    
        // Instantiate a new object based on the current Date
        const pastDate = new Date(currentDate)
    
        // Subtract  the number of days
        pastDate.setDate(pastDate.getDate() - daysToSubtract)
    
        return pastDate
    }

    var date = new Date();
    function formatDate(date) {
        const year = date.getFullYear();
        const month = '0' + date.getMonth() + 1;
        const day = date.getDate();
      
        const formattedDate = `${year}-${month}-${day}-t00:00:00`;
        return formattedDate;
      }
      
      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);
    //   console.log(formattedDate);
      const result = date.toISOString();
      const fineData = result.substring(0, result.length - 5);
      const risultato = subtractDaysFromDate(new Date(), 7).toISOString();
      const initDate = risultato.substring(0, result.length - 5);
      var url = 'https://webservices.ingv.it/fdsnws/event/1/query?starttime=' + initDate + '&endtime=' + fineData;


/* Chat GPT COdice */
var request = new XMLHttpRequest();
request.open("GET", url, true);
request.responseType = 'document';
request.overrideMimeType('text/xml');

request.onload = function () {
  if (request.readyState === request.DONE) {
    if (request.status === 200) {
      var xml = request.responseXML;
      var events = xml.getElementsByTagName("event");

      for (var i = 0; i < events.length; i++) {
        // Variabili principali
        var indice = [i+1];
        var terremoti = events[i];
        var descrizione = terremoti.getElementsByTagName("description");
        var magnitudine = terremoti.getElementsByTagName("magnitude");
        var origine = terremoti.getElementsByTagName("origin");

        // Controllo se 'origine' esiste e ha abbastanza elementi
        if (origine.length > 0) {
          var lat = origine[0].querySelector("latitude")?.textContent || "N/A";
          var lon = origine[0].querySelector("longitude")?.textContent || "N/A";
          // var tempo = origine[0].querySelector("time > value")?.textContent || "N/A";
          var tempo = origine[0]['children'][2]['children'][0]['textContent'] || 'N/A';
          var res = tempo.substring(0, tempo.length - 7);
        }

        // Troviamo il valore della magnitudo in modo dinamico
        var valore = "N/A"; // Valore di default se non viene trovato
        if (magnitudine.length > 0) {
          for (let j = 0; j < magnitudine[0].children.length; j++) {
            if (magnitudine[0].children[j].querySelector("value")) {
              valore = magnitudine[0].children[j].querySelector("value").textContent;
              break; // Prendiamo il primo valido e usciamo
            }
          }
        }

        var desc = descrizione[0]?.querySelector("text")?.textContent || "Descrizione non disponibile";

        // Creazione elementi nel DOM
        const card = document.createElement("div");
        const n = document.createElement("p");
        const d = document.createElement("p");
        const m = document.createElement("p");
        const la = document.createElement("p");
        const lo = document.createElement("p");
        const t = document.createElement("p");
        

        // Assegna classi CSS in base al valore della magnitudo
        if (valore !== "N/A" && parseFloat(valore) >= 3 && valore !== "N/A" && parseFloat(valore) <=4.9) {
          m.classList.add('giallo')
        } else if(valore !== "N/A" && parseFloat(valore) >= 5) {
          m.classList.add('magnitudo');
        } else{
          m.classList.add('magnitudoLeggero');
        }

        // Popoliamo il contenitore con i dati trovati
        div.classList.add("contenitore");
        card.classList.add("card");
        la.innerHTML = "<b>Latitudine:</b> " + lat;
        lo.innerHTML = "<b>Longitudine:</b> " + lon;
        t.textContent = res;
        d.textContent = desc;
        n.textContent = indice;
        d.classList.add("luogo");

        card.appendChild(n);
        card.appendChild(t);
        card.appendChild(d);
        card.appendChild(la);
        card.appendChild(lo);
        card.appendChild(m);
        div.appendChild(card);

        m.innerHTML = valore;

        console.log("Evento elaborato:", {
          latitudine: lat,
          longitudine: lon,
          tempo: res,
          descrizione: desc,
          magnitudo: valore,
        });
      }
    }
  }
};
request.send(null);


// Fissare la leggenda 

const navBar = document.getElementById("my-nav");
const backtotop = document.getElementById("top");

const offset = 80;
const offset2 = 200;

window.addEventListener("scroll", () => {
    if (window.scrollY >= offset){
        navBar.classList.remove("nascosto")
    } else {
        navBar.classList.add("nascosto")
    }
})
window.addEventListener("scroll", () => {
  if (window.scrollY >= offset2){
      backtotop.classList.remove("nascosto")
  } else {
      backtotop.classList.add("nascosto")
  }
})
backtotop.addEventListener('click', function topFunction() {
  $('html, body').animate({scrollTop:0}, 'slow');
  // window.scrollTo({top: 0, behavior: 'smooth'}); // For Chrome, Firefox, IE and Opera
});

