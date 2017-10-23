var Quizz = function(container) {
  var container = document.getElementById(container)
  var score;
  var playing;
  var round;
  var currentFont;
  var previousFont;
  var element;
  var gametype;
  var gameMix = 0;
  var famillyBase = ["DIDONE", "FRACTURE", "GARALDE", "MANUAIRE", "INCISE", "REALE", "HUMANE", "SCRIPTE", "MECANE"]
  var famillyBaseL = ["LINEALE DE TRANSITION", "LINEALE GEOMETRIQUE", "LINEALE HUMANISTIQUE", "LINEALE CONTEMPORAINE"]
  var checkedFamilly;
  var checkedFamillyL;
  this.init = function() {
    reset();
    if (!container) {
      $("body").append("<div id='game'>")
      element = $("div#game")
    } else {
      element = container;
    }
    $(element).addClass('game')
  }
  var reset = function(trueReset) {
    if(trueReset){
      localStorage.removeItem("score")
      localStorage.removeItem("round")
      localStorage.removeItem("cFam")
      localStorage.removeItem("cFamL")
    }
    score = (localStorage.getItem("score")) ? parseInt(localStorage.getItem("score"))  : 0;
    currentFont = null;
    previousFont = [];
    round = (localStorage.getItem("round")) ? parseInt(localStorage.getItem("round"))  : 0;
    checkedFamilly  = (localStorage.getItem("cFam")) ? JSON.parse(localStorage.getItem("cFam")) : ["DIDONE", "FRACTURE", "GARALDE", "MANUAIRE", "INCISE", "REALE", "HUMANE", "SCRIPTE", "MECANE"];
    checkedFamillyL = (localStorage.getItem("cFamL")) ? JSON.parse(localStorage.getItem("cFamL")) : ["LINEALE DE TRANSITION", "LINEALE GEOMETRIQUE", "LINEALE HUMANISTIQUE", "LINEALE CONTEMPORAINE"];
  }
  var listTypo = function() {
    var localTypo = [];
    $.each(typos, function(key, val) {
      if(checkedFamilly.indexOf(key)+1 || checkedFamillyL.indexOf(key)+1){
        $.each(val, function(key2, val2) {
          val3 = [val2[0], val2[1], key]
          localTypo.push(val3)
        })
      }
    })
    return localTypo;
  }
  this.listTypo = function() {
    return listTypo();
  }
  this.element = function() {
    return element;
  }
  var randomFont = function(t) {
    var alltypo = listTypo();
    var nb = Math.floor(Math.random() * alltypo.length);
    var resp;
    switch (t) {
      case 2:
        resp = [alltypo[nb][0]]
        while (resp.length < 4) {
          var nbChoix = Math.floor(Math.random() * alltypo.length);
          var choix = alltypo[nbChoix][0];
          if (choix != resp[0] && choix) {
            resp.push(choix)
            alltypo[nbChoix][0] = undefined;
          }
        }
        break;
      default:
        var famille = ["DIDONE", "FRACTURE", "GARALDE", "MANUAIRE", "INCISE", "REALE", "HUMANE", "SCRIPTE", "MECANE", "LINEALE"]
        resp = [alltypo[nb][2]]
        if (resp[0].indexOf('LINEALE') + 1) {
          famille = ["LINEALE DE TRANSITION", "LINEALE GEOMETRIQUE", "LINEALE HUMANISTIQUE", "LINEALE CONTEMPORAINE"]
        }
        while (resp.length < 4) {
          var nbChoix = Math.floor(Math.random() * famille.length);
          var choix = famille[nbChoix];
          if (choix != resp[0] && choix) {
            resp.push(choix)
            famille[nbChoix] = undefined;
          }
        }
    }

    resp.sort(function() {
      return 0.5 - Math.random()
    });
    alltypo[nb][3] = resp
    return alltypo[nb];
  }
  this.changeWindow = function(windowName) {
    $(element).empty();
    windowName = (!windowName) ? "index" : windowName;
    element.append("<div class='home'><img src=\"./img/homeicon.svg\" with=\"50\" height=\"50\" alt=\"\" /></div>");
    $(".home").click(function() {
      $("#game").fadeOut(250, function() {
        quizz.changeWindow("index");
        $("#game").fadeIn(150, function() {});
      });
    });
    switch (windowName) {
      case 'index':
        if(checkedFamilly.length + checkedFamillyL.length < 4){
          disable = "disable"
        }else{
          disable = ""
        }
        element.append("<h1 id=\"Titre\">Typo Quizz</h1>");
        $(".home").remove()
        element.append("<p class=\"infor\">Le livre <a href=\"https://www.petitpoisson.be/projets/choixtypo\" target=\"_blank\">Choix typographique</a> est recommandé pour avoir une explication sur les différences entre les polices.</p>");
        element.append("<p class=\"infor\">Il contient également des informations sur l'histoire de celles-ci.</p>");
        if(disable == "disable"){
          element.append("<p class=\"infor err\">Vous n'avez pas 4 familles de polices acceptées, vous nous pouvez donc pas réaliser les Quizz mixtes et les Quizz familles</p>");
        }
        element.append("<div class='buttons'>");
        $("div.buttons").append('<div class="qQuizzMix"><a class="launch3" '+disable+'>Mixte</a></div>')
        $("div.buttons").append('<div class="qQuizz"><a class="launch">Polices</a></div>')
        $("div.buttons").append('<div class="qQuizzFam"><a class="launch2" '+disable+'>Familles</a></div>')
        $("div.buttons").append('<div class="qScore"><a class="score">SCORE</a></div>')
        $("div.buttons").append('<div class="qList"><a class="list">LISTE</a></div>')
        $("div.buttons").append('<div class="qSetting"><a class="setting">OPTION</a></div>')
        element.append("<p class=\"infor\">Cette app est conçue pour aider les étudiants du cours de typographie de M. Spirlet à l'Inpress (HEPL) à Seraing.</p>");
        element.append("<p class=\"infor\">Je précise également que cette application ne sert pas d'antisèche, c'est avant tous un support d'<b>étude&nbsp;!</b>.</p>");
        element.append("<p class=\"infor flaticon\"><a href=\"https://play.google.com/store/apps/details?id=net.bnmkt.typoquizz&hl=fr\" target=\"_blank\"><img src=\"./img/google-play.svg\" width=\"48\" height=\"48\" alt=\"\" /></a><a href=\"https://github.com/Bnmkt/Typo-Quizz\" target=\"_blank\"><img src=\"./img/github-logo.svg\" width=\"48\" height=\"48\" alt=\"\" /></a></p>");
        // element.append("<p class=\"infor\">Une alternative web existe pour les utilisateurs d'IOS sur <a href=\"typo.bnmkt.net\" target=\"_blank\">typo.bnmkt.net</a>, n'hésitez pas à la leur conseiller&nbsp;!n</p>");
        $("[disable]").removeClass("launch2")
        $("[disable]").removeClass("launch3")
        $(".list").click(function() {
          $("#game").fadeOut(250, function() {
            quizz.changeWindow("list");
            $("#game").fadeIn(150, function() {});
          });
          //
        });
        $(".launch").click(function() {
          gameMix = 0
          $("#game").fadeOut(250, function() {
            quizz.changeWindow("quizz");
            $("#game").fadeIn(150, function() {});
          });
        });
        $(".launch2").click(function() {
          gameMix = 0
          $("#game").fadeOut(250, function() {
            quizz.changeWindow("quizzFam");
            $("#game").fadeIn(150, function() {});
          });
        });
        $(".launch3").click(function() {
          gameMix = 1;
          $("#game").fadeOut(250, function() {
            quizz.changeWindow("quizzMix");
            $("#game").fadeIn(150, function() {});
          });
        });
        $(".setting").click(function() {
          $("#game").fadeOut(250, function() {
            quizz.changeWindow("setting");
            $("#game").fadeIn(150, function() {});
          });
        });
        $(".score").click(function() {
          $("#game").fadeOut(250, function() {
            quizz.changeWindow("score");
            $("#game").fadeIn(150, function() {});
          });
        });
        break;
      case 'list':
        var lastfamily = "";
        element.append("<h1>Liste des polices</h1>")
        element.append("<p><i>L'application compte en tout <b>" + this.listTypo().length + "/86</b> polices</i></p>")
        element.append("<ul id='fontlist'>");
        $.each(this.listTypo(), function(key, val) {
          if (lastfamily != val[2]) {
            $("#fontlist").append("<ol class='title'>" + val[2] + "</ol>");
            lastfamily = val[2]
          }
          $("#fontlist").append("<ol>" + val[0] + " <img src='./img/font/" + val[2] + "/" + val[1] + "'></ol>");
        })
        break;
      case 'quizzFam':
        gametype = 1;
        playing = 1;
        element.append("<h1>Quelle famille ?</h1>")
        var ty = randomFont();
        var reponse = ty[2];
        element.append("<div id='fontlist'>")
        element.append("<div id='score'>")
        score = Math.round(score * 100) / 100
        $("#score").text(score)
        var game = $("div#fontlist")
        game.addClass("gameQuizz")
        game.append("<img src='./img/font/" + ty[2] + "/" + ty[1] + "' class=\"imgFontPres\" alt=\"\" />")
        if (reponse.indexOf("LINEALE") + 1) {
          ty[3][1] = ty[3][1].split("LINEALE")[1];
          ty[3][2] = ty[3][2].split("LINEALE")[1];
          ty[3][3] = ty[3][3].split("LINEALE")[1];
          ty[3][0] = ty[3][0].split("LINEALE")[1];
          game.append("<p>Linéale...</p>")
        }
        game.append("<div class='buttons'>");
        $("div.buttons").append('<div class="dchoix qBtnR1"><a class="choix">' + ty[3][1] + '</a></div>')
        $("div.buttons").append('<div class="dchoix qBtnR2"><a class="choix">' + ty[3][2] + '</a></div>')
        $("div.buttons").append('<div class="dchoix qBtnR3"><a class="choix">' + ty[3][3] + '</a></div>')
        $("div.buttons").append('<div class="dchoix qBtnR4"><a class="choix">' + ty[3][0] + '</a></div>')
        $("a.choix").click(function(e) {
          var content = $(this).text();
          if (reponse.indexOf("LINEALE") + 1) {
            content = "LINEALE" + content;
          }
          previousFont = ty[2];
          round++;
          if (content == reponse) {
            if (playing) {
              score += 1;
              playing = 0;
            }
            $("#game").fadeOut(650, function() {
              quizz.changeWindow("victory");
              $("#game").fadeIn(150, function() {});
            });
          } else {
            if (playing) {
              score -= .2;
              playing = 0;
            }
            $("#game").fadeOut(650, function() {
              quizz.changeWindow("defeat");
              $("#game").fadeIn(150, function() {});
            });
          }
        })
        break;
      case 'quizz':
        gametype = 2
        element.append("<h1>Quelle police ?</h1>")
        var ty = randomFont(2);
        element.append("<div id='fontlist'>")
        element.append("<div id='score'>")
        score = Math.round(score * 100) / 100
        $("#score").text(score)
        var game = $("div#fontlist")
        game.addClass("gameQuizz")
        game.append("<img src='./img/font/" + ty[2] + "/" + ty[1] + "' class=\"imgFontPres\" alt=\"\" />")
        game.append("<div class='buttons'>");
        var reponse = ty[0];
        $("div.buttons").append('<div class="dchoix qBtnR1"><a class="choix">' + ty[3][1] + '</a></div>')
        $("div.buttons").append('<div class="dchoix qBtnR2"><a class="choix">' + ty[3][2] + '</a></div>')
        $("div.buttons").append('<div class="dchoix qBtnR3"><a class="choix">' + ty[3][3] + '</a></div>')
        $("div.buttons").append('<div class="dchoix qBtnR4"><a class="choix">' + ty[3][0] + '</a></div>')
        $("a.choix").click(function(e) {
          var content = $(this).text();
          previousFont = ty[0];
          round++;
          if (content == reponse) {
            if (playing) {
              score += 1;
              playing = 0;
            }
            $("#game").fadeOut(450, function() {
              quizz.changeWindow("victory");
              $("#game").fadeIn(150, function() {});
            });
          } else {
            if (playing) {
              score -= .2;
              playing = 0;
            }
            $("#game").fadeOut(450, function() {
              quizz.changeWindow("defeat");
              $("#game").fadeIn(150, function() {});
            });
          }
        })
        break;
      case 'quizzMix':
        var w = false;
        do{
          w=false;
          if(gametype){
            console.log("Oui");
            switch (gametype) {
              case 1:
                quizz.changeWindow("quizzFam")
                break;
              case 2:
                quizz.changeWindow("quizz")
                break;
            }
          }else{
            console.log("non");
            gametype = Math.round(Math.random())+1;
            w=true;
          }
        }while(w==true);
        break;
      case "victory":
        if (gametype == 2) {
          var t = "quizz";
          var text = "Quizz Polices"
        } else if(gametype == 1){
          var t = "quizzFam";
          var text = "Quizz Familles"
        }
        if(gameMix){
          t = "quizzMix";
          var text = "Quizz Mixte"
        }
        element.append('<div class="victory launch">VICTOIRE :)<br>La bonne réponse était : ' + previousFont + '<br><br>Appuie ici pour continuer ' + text + '</div>')
        $(".launch").click(function() {
          $("#game").fadeOut(250, function() {
            quizz.changeWindow(t);
            $("#game").fadeIn(150, function() {});
          });
        });
        break;
      case "defeat":
        if (gametype == 2) {
          var t = "quizz";
          var text = "Quizz Polices"
        } else if(gametype == 1){
          var t = "quizzFam";
          var text = "Quizz Familles"
        }
        if(gameMix){
          t = "quizzMix";
          var text = "Quizz Mixte"
        }
        element.append('<div class="defeat launch">RATÉ :(<br>La bonne réponse était : ' + previousFont + '<br><br>Appuie ici pour continuer ' + text + '</div>')
        $(".launch").click(function() {
          $("#game").fadeOut(250, function() {
            quizz.changeWindow(t);
            $("#game").fadeIn(150, function() {});
          });
        });
        break;
      case 'score':
        element.append("<h1>Panneau des score (WIP)</h1>")
        element.append("<p>Vous avez un score de " + score + " sur " + round + " (+1 / -0.2)</p>")
        scorer = Math.round((score / round) * 20 * 100) / 100
        var text = "";
        if (scorer < 0) {
          text = "";
        } else if (scorer < 8 && scorer > 0) {
          text = "Il y a encore du travail... Courage!";
        } else if (scorer < 12 && scorer > 7) {
          text = "Tu y es presque, tu vas réussir";
        } else if (scorer < 15 && scorer > 11) {
          text = "Tu as l'air de bien connaitre les polices !";
        } else if (scorer < 18 && scorer > 14) {
          text = "Beau travail !";
        } else if (scorer > 17) {
          text = "Es-tu vraiment humain ?";
        }
        if (isNaN(scorer)) {
          scorer = 0;
        }
        element.append("<p>celà te fais " + scorer + "/20...<br>" + text + "</p>")
        break;
      case 'setting':
        element.append("<h1>Paramètres</h1>")
        element.append("<div id=\"settingFam\"><p>Familles disponibles dans les quizz</p></div>")
        var settingFam = $("div#settingFam")
        $.each(typos, function(fam, arrFnt) {
          if (checkedFamilly.indexOf(fam) + 1 || checkedFamillyL.indexOf(fam) + 1) {
            checked = "checked=\"checked\"";
          } else {
            checked = "";
          }
          settingFam.append("<div><input type=\"checkbox\" " + checked + " value=\"" + fam + "\" id=\"inp" + fam + "\" /><label for=\"inp" + fam + "\">" + fam + "</label></div>")
        })
        $("input[type=checkbox]").change(function(handler) {
          if ($(this).prop("checked")) {
            if (!checkedFamilly.indexOf($(this).attr("value")) + 1 && famillyBase.indexOf($(this).attr("value")) + 1) {
              checkedFamilly = checkedFamilly.concat([$(this).attr("value")]);
            }
            if (!checkedFamillyL.indexOf($(this).attr("value")) + 1 && famillyBaseL.indexOf($(this).attr("value")) + 1) {
              checkedFamillyL = checkedFamillyL.concat([$(this).attr("value")]);
            }
          } else {
            if (checkedFamilly.indexOf($(this).attr("value")) + 1) {
              checkedFamilly.splice(checkedFamilly.indexOf($(this).attr("value")), 1);
            }
            if (checkedFamillyL.indexOf($(this).attr("value")) + 1) {
              checkedFamillyL.splice(checkedFamillyL.indexOf($(this).attr("value")), 1);
            }
          }
          quizz.changeWindow("setting")
        })
        element.append("<div class='infor err'>Attention, le bouton ci dessous va supprimer toutes les données sauvegardée (Score, Familles séléctionnée ci dessus) en cliquant dessus, vous perdrez toutes les données relatives à l'application</div>")
        element.append("<div><button id='tReset'>true reset</button></div>")
        $("#tReset").click(function(handler) {
          if(confirm("Attention cette action va remettre à ZERO toutes vos stats, êtes vous sur de vouloir TOUS remettre à zero ?")){
            if(confirm("On est jamais trop sûr... tu as bien cliqué sur \"Oui\" ?")){
              alert("Que grand bien te fasse...")
              reset(1);
              quizz.changeWindow("index")
            }else{
              alert("Ouf... tes données sont sauvegardées");
            }
          }
        });
        break;
      default:
        $(element).append("<p>Salut, si tu vois ce message, retient bien ce que tu as fait et viens me le dire</p>")
    }
    localStorage.setItem("score", score);
    localStorage.setItem("round", round);
    localStorage.setItem("cFam", JSON.stringify(checkedFamilly));
    localStorage.setItem("cFamL", JSON.stringify(checkedFamillyL));
    window.scrollTo(0, 0);
  }
}
