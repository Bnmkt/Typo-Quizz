var Quizz = function(container) {
  var container = document.getElementById(container)
  var score;
  var round;
  var previousFont;
  var element;
  var difficulty;
  var previousDifficulty;
  var gametype;
  var gameMix = 0;
  const famillyBaseT = '["DIDONE", "FRACTURE", "GARALDE", "MANUAIRE", "INCISE", "REALE", "HUMANE", "SCRIPTE", "MECANE"]'
  const famillyBaseLT = '["LINEALE DE TRANSITION", "LINEALE GEOMETRIQUE", "LINEALE HUMANISTIQUE", "LINEALE CONTEMPORAINE"]'
  var famillyBase = JSON.parse(famillyBaseT)
  var famillyBaseL = JSON.parse(famillyBaseLT)
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
  if( !window.XMLSerializer ){
     window.XMLSerializer = function(){};

     window.XMLSerializer.prototype.serializeToString = function( XMLObject ){
        return XMLObject.xml || '';
     };
  }
  this.textToSVG = function(txt){
    let text = txt.toString().split(",")[0].toString();
    var fontsize;
    var textl = text.length
    if(textl<=8){
      fontsize = "30";
    }else if(textl<=13){
      fontsize = "24";
    }else if(textl<=17){
      fontsize = "20";
    }else{
      fontsize = "14"
    }
    var svg = $.parseXML("<svg xmlns='http://www.w3.org/2000/svg' height='86' width='270'><text text-anchor='middle' style='font-size:"+fontsize+"px; width:100%; font-family:Futura_Bold, sans-serif; font-weight:bold; color:white;' x='50%' y='50%' fill='white'>"+text+"</text></svg>");
    let image = new XMLSerializer();
    let imageSVG = window.btoa(image.serializeToString(svg))
    var img = '<img src="data:image/svg+xml;base64,'+imageSVG +'" alt="'+txt+'">';
    return img;
  }
  var reset = function(trueReset) {
    if (trueReset) {
      localStorage.removeItem("difficulty")
      localStorage.removeItem("score")
      localStorage.removeItem("round")
      localStorage.removeItem("cFam")
      localStorage.removeItem("cFamL")
    }
    score = (localStorage.getItem("score")) ? JSON.parse(localStorage.getItem("score")) : [0,0]
    currentFont = null
    previousFont = []
    round = (localStorage.getItem("round")) ? parseInt(localStorage.getItem("round")) : 0
    difficulty = (localStorage.getItem("difficulty")) ? parseInt(localStorage.getItem("difficulty")) : 4
    checkedFamilly = (localStorage.getItem("cFam")) ? JSON.parse(localStorage.getItem("cFam")) : ["DIDONE", "FRACTURE", "GARALDE", "MANUAIRE", "INCISE", "REALE", "HUMANE", "SCRIPTE", "MECANE"]
    checkedFamillyL = (localStorage.getItem("cFamL")) ? JSON.parse(localStorage.getItem("cFamL")) : ["LINEALE DE TRANSITION", "LINEALE GEOMETRIQUE", "LINEALE HUMANISTIQUE", "LINEALE CONTEMPORAINE"]
  }
  var listTypo = function() {
    var localTypo = [];
    $.each(typos, function(key, val) {
      if (checkedFamilly.indexOf(key) + 1 || checkedFamillyL.indexOf(key) + 1) {
        $.each(val, function(key2, val2) {
          if(val2 != previousFont){
            val3 = [val2[0], val2[1], key]
            if(val2[2]){
              val4 = val2[2].toString().toUpperCase()
              val3.push(val4.split(","))
            }
            localTypo.push(val3)
          }
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
      case 2: // RandomTypo
        resp = [alltypo[nb][0]]
        previousFont = alltypo[nb]
        while (resp.length < difficulty) {
          var nbChoix = Math.floor(Math.random() * alltypo.length);
          var choix = alltypo[nbChoix][0];
          if (choix != resp[0] && choix) {
            resp.push(choix)
            alltypo[nbChoix][0] = undefined;
          }
        }
        break;
      case 3: // Random artist
        resp = [alltypo[nb][3].sort(function() { return 0.5 - Math.random() })[0]]
        previousFont = alltypo[nb]
        alltypo[nb][0] = resp[0];
        while (resp.length < difficulty) {
          var nbChoix = Math.floor(Math.random() * alltypo.length);
          var choix = alltypo[nbChoix][3];
          if (choix != resp[0] && choix) {
            resp.push(choix)
            alltypo[nbChoix][3] = undefined;
          }
        }
        break;
      default: // RandomFamilly
        let famille = JSON.parse(famillyBaseT)
        previousFont = alltypo[nb]
        resp = [alltypo[nb][2]]
        if (resp[0].indexOf('LINEALE') + 1) {
          famille = JSON.parse(famillyBaseLT)
          previousDifficulty = difficulty;
          if (difficulty > 0) {
            difficulty = 4;
            element.attr("difficulty", 4)
          }
        }
        while (resp.length < difficulty) {
          var nbChoix = Math.floor(Math.random() * famille.length);
          var choix = famille[nbChoix];
          if (choix != resp[0] && choix) {
            resp.push(choix)
            famille.splice(nbChoix, 1);
          }
        }
    }
    resp.sort(function() {
      return 0.5 - Math.random()
    });
    if(previousDifficulty){
      difficulty = previousDifficulty;
      previousDifficulty = 0;
    }
    alltypo[nb][3] = resp
    if (difficulty == 0) {
      alltypo[nb].splice(3, 1)
    }
    return alltypo[nb];
  }
  this.changeWindow = function(windowName) {
    $(element).empty();
    $(element).attr('difficulty', difficulty)
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
        $("div.game").effect("slide");
        element.append("<h1 id=\"Titre\">Typo Quizz</h1>");
        $(".home").remove()
        element.append("<p class=\"infor\">Le livre <a href=\"https://www.petitpoisson.be/projets/choixtypo\" target=\"_blank\">Choix typographique</a> est recommandé pour avoir une explication sur les différences entre les polices.</p>");
        element.append("<div class='buttons'>");
        $("div.buttons").append('<div class="qQlist" order="0"><a class="qqlist">JOUER</a></div>')
        $("div.buttons").append('<div class="qScore" order="2"><a class="score">SCORE</a></div>')
        $("div.buttons").append('<div class="qList" order="2"><a class="list">LISTE</a></div>')
        $("div.buttons").append('<div class="qSetting" order="2"><a class="setting">OPTION</a></div>')
        element.append("<p class=\"infor\">Cette app est conçue pour aider les étudiants du cours de typographie de M. Spirlet à l'Inpress (HEPL) à Seraing.</p>");
        $(".list").click(function() {
          $("#game").fadeOut(250, function() {
            quizz.changeWindow("list");
            $("#game").fadeIn(150, function() {});
          });
          //
        });
        $(".qqlist").click(function() {
          $("#game").fadeOut(250, function() {
            quizz.changeWindow("quizzList");
            $("#game").fadeIn(150, function() {});
          });
          //
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
            $("#game").fadeIn(100, function() {});
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
          let displayname = "<b>"+val[0]+"</b>";
          if(val[3]){
            displayname+=" - "+val[3]
          }
          $("#fontlist").append("<ol>" + displayname + " <img src='./img/font/" + val[2] + "/" + val[1] + "'></ol>");
        })
        break;
      case 'quizzList':
        element.append("<h1>Mode de jeu</h1>")
        if (checkedFamilly.length + checkedFamillyL.length < 4) {
          disable = "disable"
        } else {
          disable = ""
        }
        if (disable == "disable") {
          element.append("<p class=\"infor err\">Vous n'avez pas 4 familles de polices acceptées, vous nous pouvez donc pas réaliser les Quizz mixtes et les Quizz familles</p>");
        }
        element.append("<div class='buttons'>");
        $("div.buttons").append('<div class="qQuizzMix" order="0"><a class="launch3" ' + disable + '>Mixte</a></div>')
        $("div.buttons").append('<div class="qQuizzTyp" order="2"><a class="launch4" ' + disable + '>Typographe</a></div>')
        $("div.buttons").append('<div class="qQuizz" order="2"><a class="launch">Polices</a></div>')
        $("div.buttons").append('<div class="qQuizzFam" order="2"><a class="launch2" ' + disable + '>Familles</a></div>')
        $("div.buttons").hide()
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
        $(".launch4").click(function() {
          gameMix = 0;
          $("#game").fadeOut(250, function() {
            quizz.changeWindow("quizzTyp");
            $("#game").fadeIn(150, function() {});
          });
        });
        setTimeout(function(){ $("div.buttons").show("scale",{origin:["middle","center"], easing:"easeOutBack"},200); }, 100)
        break;
      case 'quizzFam':
        gametype = 1;
        element.append("<h1>Quelle famille ?</h1>")
        var ty = randomFont();
        var reponse = ty[2];
        element.append("<div id='fontlist'>")
        element.append("<div id='score'>")
        scored = Math.round(score[0] * 100) / 100
        $("#score").text(scored)
        var game = $("div#fontlist")
        game.addClass("gameQuizz")
        game.append("<div id=\"imgpl\"><img src='./img/font/" + ty[2] + "/" + ty[1] + "' class=\"imgFontPres\" alt=\"\" /></div>")
        $("#imgpl").hide();
        setTimeout(function(){$("#imgpl").effect("slide")},100)
        game.append("<div class=\"iflin\"></div>")
        game.append("<div class='buttons'>");
        if (ty[3]) {
          if (reponse.indexOf("LINEALE") + 1) {
            for (var i = 0; i < ty[3].length; i++) {
              ty[3][i] = ty[3][i].split("LINEALE")[1];
            }
            $(".iflin").append("<p><i><small>La difficulté est mise en normale pour les linéale</small></i></p>")
          }
          for (var i = 0; i < ty[3].length; i++) {
            $("div.buttons").append('<div class="dchoix qBtnR' + i + '"><a class="choix" data-reponse="'+ty[3][i]+'">' + this.textToSVG(ty[3][i]) + '</a></div>')
          }
          $("a.choix").click(function(e) {
            var content = $(this).attr("data-reponse");
            if (reponse.indexOf("LINEALE") + 1) {
              content = "LINEALE" + content;
            }
            previousFont = ty;
            if (content == reponse || (reponse.indexOf(content) > -1 && content.length > 3)) {
              $("#game").fadeOut(650, function() {
                quizz.changeWindow("victory");
                $("#game").fadeIn(150, function() {});
              });
            } else {
              $("div.buttons").effect("shake");
              $("#game").fadeOut(650, function() {
                quizz.changeWindow("defeat");
                $("#game").fadeIn(150, function() {});
              });
            }
          })
        } else {
          $("div.buttons").append("<input type=\"text\" id=\"inputResp\" placeholder=\"Réponse\"/>")
          $("div.buttons").append("<input type=\"submit\" value=\"Valider\" id=\"inputSubmit\" />")
          $("#inputSubmit").click(function() {
            var inputVal = $("#inputResp").val();
            if (inputVal != "" && inputVal.length >= 3) {
              content = inputVal.toUpperCase();
              previousFont = ty
              if (content == reponse || (reponse.indexOf(content) > -1 && content.length > 3)) {
                $("#game").fadeOut(650, function() {
                  quizz.changeWindow("victory");
                  $("#game").fadeIn(150, function() {});
                });
              } else {
                $("div.buttons").effect("shake");
                $("#game").fadeOut(650, function() {
                  quizz.changeWindow("defeat");
                  $("#game").fadeIn(150, function() {});
                });
              }
            }
          })
        }
        break;
      case 'quizz':
        gametype = 2
        element.append("<h1>Quelle police ?</h1>")
        var ty = randomFont(2);
        element.append("<div id='fontlist'>")
        element.append("<div id='score'>")
        scored = Math.round(score[0] * 100) / 100
        $("#score").text(scored)
        var game = $("div#fontlist")
        game.addClass("gameQuizz")
        game.append("<div id=\"imgpl\"><img src='./img/font/" + ty[2] + "/" + ty[1] + "' class=\"imgFontPres\" alt=\"\" /></div>")
        $("#imgpl").hide();
        setTimeout(function(){$("#imgpl").effect("slide")},100)
        game.append("<div class='buttons'>");
        var reponse = ty[0];
        if (ty[3]) {
          for (var i = 0; i < ty[3].length; i++) {
            $("div.buttons").append('<div class="dchoix qBtnR' + i + '"><a class="choix" data-reponse="'+ty[3][i]+'">' + this.textToSVG(ty[3][i]) + '</a></div>')
          }
          $("a.choix").click(function(e) {
            var content = $(this).attr("data-reponse");
            previousFont = ty;
            if (content == reponse || (reponse.indexOf(content) > -1 && content.length > 3)) {
              $("#game").fadeOut(450, function() {
                quizz.changeWindow("victory");
                $("#game").fadeIn(150, function() {});
              });
            } else {
              $("div.buttons").effect("shake");
              $("#game").fadeOut(450, function() {
                quizz.changeWindow("defeat");
                $("#game").fadeIn(150, function() {});
              });
            }
          })
        } else {
          $("div.buttons").append("<input type=\"text\" id=\"inputResp\" placeholder=\"Réponse\"/>")
          $("div.buttons").append("<input type=\"submit\" value=\"Valider\" id=\"inputSubmit\" />")
          $("#inputSubmit").click(function() {
            var inputVal = $("#inputResp").val();
            if (inputVal != "" && inputVal.length >= 3) {
              content = inputVal.toUpperCase();
              previousFont = ty
              if (content == reponse || (reponse.indexOf(content) > -1 && content.length > 3)) {
                $("#game").fadeOut(650, function() {
                  quizz.changeWindow("victory");
                  $("#game").fadeIn(150, function() {});
                });
              } else {
                $("div.buttons").effect("shake");
                $("#game").fadeOut(650, function() {
                  quizz.changeWindow("defeat");
                  $("#game").fadeIn(150, function() {});
                });
              }
            }
          })
        }
        break;
      case 'quizzTyp':
        gametype = 3
        element.append("<h1>Quelle typographe ?</h1>")
        var ty = randomFont(3);
        element.append("<div id='fontlist'>")
        element.append("<div id='score'>")
        scored = Math.round(score[0] * 100) / 100
        $("#score").text(scored)
        var game = $("div#fontlist")
        game.addClass("gameQuizz")
        game.append("<div id=\"imgpl\"><img src='./img/font/" + ty[2] + "/" + ty[1] + "' class=\"imgFontPres\" alt=\"\" /></div>")
        $("#imgpl").hide();
        setTimeout(function(){$("#imgpl").effect("slide")},100)
        game.append("<div class='buttons'>");
        var reponse = ty[0];
        if (ty[3]) {
          for (var i = 0; i < ty[3].length; i++) {
            $("div.buttons").append('<div class="dchoix qBtnR' + i + '"><a class="choix" data-reponse="'+ty[3][i]+'">' + this.textToSVG(ty[3][i]) + '</a></div>')
          }
          $("a.choix").click(function(e) {
            var content = $(this).attr("data-reponse");
            previousFont = ty;
            if (content == reponse || (reponse.indexOf(content) > -1 && content.length > 3)) {
              $("#game").fadeOut(450, function() {
                quizz.changeWindow("victory");
                $("#game").fadeIn(150, function() {});
              });
            } else {
              $("div.buttons").effect("shake");
              $("#game").fadeOut(450, function() {
                quizz.changeWindow("defeat");
                $("#game").fadeIn(150, function() {});
              });
            }
          })
        } else {
          $("div.buttons").append("<input type=\"text\" id=\"inputResp\" placeholder=\"Réponse\"/>")
          $("div.buttons").append("<input type=\"submit\" value=\"Valider\" id=\"inputSubmit\" />")
          $("#inputSubmit").click(function() {
            var inputVal = $("#inputResp").val();
            if (inputVal != "" && inputVal.length >= 3) {
              content = inputVal.toUpperCase();
              previousFont = ty
              if (content == reponse || (reponse.indexOf(content) > -1 && content.length > 3)) {
                $("#game").fadeOut(650, function() {
                  quizz.changeWindow("victory");
                  $("#game").fadeIn(150, function() {});
                });
              } else {
                $("div.buttons").effect("shake");
                $("#game").fadeOut(650, function() {
                  quizz.changeWindow("defeat");
                  $("#game").fadeIn(150, function() {});
                });
              }
            }
          })
        }
        break;
      case 'quizzMix':
        var w = false;
        do {
          w = false;
          if (gametype) {
            switch (gametype) {
              case 3:
                $("#game").fadeOut(10, function() {
                  quizz.changeWindow("quizzTyp");
                  $("#game").fadeIn(10, function() {});
                });
                break;
              case 2:
                $("#game").fadeOut(10, function() {
                  quizz.changeWindow("quizzFam");
                  $("#game").fadeIn(10, function() {});
                });
                break;
              case 1:
              $("#game").fadeOut(10, function() {
                quizz.changeWindow("quizzFam");
                $("#game").fadeIn(10, function() {});
              });
                break;
            }
          } else {
            gametype = Math.round(Math.random()) + 1;
            w = true;
          }
        } while (w == true);
        break;
      case "victory":
        $("div#game").effect("slide",{direction:"left", easing:"easeOutBack"})
        if (gametype == 2) {
          var t = "quizz";
          var text = "Quizz Polices"
          i = 0
        } else if (gametype == 3) {
          var t = "quizzTyp";
          var text = "Quizz Typographe"
          i = 0
        } else if (gametype == 1) {
          var t = "quizzFam";
          var text = "Quizz Familles"
          i = 2
        }
        if (gameMix) {
          t = "quizzMix";
          var text = "Quizz Mixtes"
        }
        round++;
        score[0]++;
        element.append('<div class="victory launch"><br><b>' + previousFont[i] + '</b><br><img src="./img/font/' + previousFont[2] + '/' + previousFont[1] + '" class="imgFontPres"><br>Continuer ' + text + '</div>')
        $(".launch").click(function() {
          $("#game").fadeOut(250, function() {
            quizz.changeWindow(t);
            $("#game").fadeIn(150, function() {});
          });
        });
        break;
      case "defeat":
        $("div#game").effect("slide",{direction:"right", easing:"easeOutBack"})
        if (gametype == 2) {
          var t = "quizz";
          var text = "Quizz Polices"
          i = 0
        } else if (gametype == 3) {
          var t = "quizzTyp";
          var text = "Quizz Typographe"
          i = 0
        } else if (gametype == 1) {
          var t = "quizzFam";
          var text = "Quizz Familles"
          i = 2
        }
        round++;
        score[1]++;
        if (gameMix) {
          t = "quizzMix";
          var text = "Quizz Mixtes"
        }
        element.append('<div class="defeat launch"><br><b>' + previousFont[i] + '</b><br><img src="./img/font/' + previousFont[2] + '/' + previousFont[1] + '" class="imgFontPres">Continuer ' + text + '</div>')
        $(".launch").click(function() {
          $("#game").fadeOut(250, function() {
            quizz.changeWindow(t);
            $("#game").fadeIn(150, function() {});
          });
        });
        break;
      case 'score':
        var correct = score[0];
        var incorrect = score[1];
        element.append("<h1>Panneau des scores</h1>")
        scorer = Math.floor((((correct-(incorrect/5))/round)*20)*100)/100
        var text = "";
        if (scorer < 0 && round) {
          text = "Dommage";
        } else if (scorer < 8 && scorer > 0) {
          text = "Il y a encore du travail... Courage !";
        } else if (scorer < 12 && scorer > 7) {
          text = "Tu y es presque, tu vas réussir !";
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
        element.append('<div class="scoreContainer" data-score="'+scorer+'"><div class="percent"><span class="data-r" data-r="'+correct+'">RC</span></div><span class="data-r abs" data-r="'+incorrect+'">RI</span></div>')
        element.append('<p class="infor">'+text+'</p>')
        element.append('<p class="infor op05">Barème +1 / -0.2</p>')
        element.append('<p class="infor op05">Calcul des points : RC - ( RI/5 )</p>')
        $(".percent").animate({"width":scorer*5 +"%"}, {duration:1000, easing:"easeOutBack"})
        break;
      case 'setting':
        element.append("<h1>Paramètres</h1>")
        element.append("<h2 id=\"setFamTitle\" class=\"titleSetting\"> > (Dé)sélectionner</h2>")
        element.append("<div id=\"settingFam\" class=\"settingElement\"><p>Familles disponibles dans les quizz</p></div>")
        var settingFam = $("div#settingFam")
        $.each(typos, function(fam, arrFnt) {
          if (checkedFamilly.indexOf(fam) + 1 || checkedFamillyL.indexOf(fam) + 1) {
            checked = "checked=\"checked\"";
          } else {
            checked = "";
          }
          settingFam.append("<div class=\"famElement\"><input type=\"checkbox\" " + checked + " value=\"" + fam + "\" id=\"inp" + fam + "\" /><label for=\"inp" + fam + "\">" + fam + "</label></div>")
        })
        element.append("<h2 id=\"setDifficulty\" class=\"titleSetting\"> > Changer la difficulté</h2>")
        element.append("<div id=\"settingDifficulty\" class=\"settingElement\"></div>")
        $("#settingDifficulty").append("<select id=\"selectDif\"></select>")
        $("#settingDifficulty").append("<p>Difficulté actuelle : " + difficulty + "Choix</p>")
        $("#selectDif").append("<option value=\"2\" class=\"dif2\">Facile (2 choix)</option>")
        $("#selectDif").append("<option value=\"4\" class=\"dif4\">Moyen (4 choix)</option>")
        $("#selectDif").append("<option value=\"6\" class=\"dif6\">Difficile (6 choix)</option>")
        $("#selectDif").append("<option value=\"0\" class=\"dif0\">Impossible (Donner la réponse)</option>")
        $(".dif" + difficulty).attr("selected", "selected")
        $("#selectDif").change(function(handler) {
          difficulty = $(this).val();
          quizz.changeWindow("setting")
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
        element.append("<h2 id=\"setReset\" class=\"titleSetting\"> > Réinitialisation</h2>")
        element.append("<div id=\"settingReset\" class=\"settingElement\"><button id='tReset'>true reset</button></div>")
        $("settingReset").prepend("<div class='infor err'>Attention, le bouton ci dessous va supprimer toutes les données sauvegardée (Score, Familles séléctionnée ci dessus) en cliquant dessus, vous perdrez toutes les données relatives à l'application</div>")
        $("#tReset").click(function(handler) {
          if (confirm("Attention cette action va remettre à ZERO toutes vos stats, êtes vous sur de vouloir TOUS remettre à zero ?")) {
            if (confirm("On est jamais trop sûr... tu as bien cliqué sur \"Oui\" ?")) {
              alert("Que grand bien te fasse...")
              reset(1);
              quizz.changeWindow("index")
            } else {
              alert("Ouf... tes données sont sauvegardées");
            }
          }
        });
        element.append("<h2 id=\"setApropos\"> > À propos</h2>")
        let texta = "Cette application à été développée par Sean Ferrara,&#8239;étudiant à là Haute École de la Province de Liège<br>"
            texta+= "Les sources disponnibles sur github sont libres de droit à quiconque veut les utiliser<br>"
            texta+= "Les images utilisée viennent du cours <br>de typographie de M.&#8239;Spirlet,&nbsp;elles sont également disponnibles sur <a href=\"https://www.petitpoisson.be/projets/choixtypo\" target=\"_blank\">petitpoisson.be</a>"
        let textb = "Cette application est codée en html5/css3 et javascript et utilise Cordova pour être rendue disponnible sur les supports mobile"
        element.append("<div id=\"settingapropos\" class=\"settingElement\"><p class=\"infor\">"+texta+"</p><p class=\"infor\">"+textb+"</p></div>")
        $("#setFamTitle").click(function() {
          $('.settingElement').slideUp();
          if (!$('div#settingFam').is(":visible")) {
            $('div#settingFam').slideToggle()
          }
        })
        $("#setDifficulty").click(function() {
          $('.settingElement').slideUp();
          if (!$('div#settingDifficulty').is(":visible")) {
            $('div#settingDifficulty').slideToggle()
          }
        })
        $("#setReset").click(function() {
          $('.settingElement').slideUp();
          if (!$('div#settingReset').is(":visible")) {
            $('div#settingReset').slideToggle()
          }
        })
        $("#setApropos").click(function() {
          $('.settingElement').slideUp();
          if (!$('div#settingapropos').is(":visible")) {
            $('div#settingapropos').slideToggle()
          }
        })
        $('.settingElement').slideUp();
        break;
      default:
        $(element).append("<p>Salut, si tu vois ce message, retient bien ce que tu as fait et viens me le dire</p>")
    }
    element.append("<p class=\"infor flaticon\"><a href=\"https://play.google.com/store/apps/details?id=net.bnmkt.typoquizz&hl=fr\" target=\"_blank\"><img src=\"./img/google-play.svg\" width=\"48\" height=\"48\" alt=\"\" /></a><a href=\"https://github.com/Bnmkt/Typo-Quizz\" target=\"_blank\"><img src=\"./img/github-logo.svg\" width=\"48\" height=\"48\" alt=\"\" /></a></p>");

    localStorage.setItem("difficulty", difficulty);
    localStorage.setItem("score", JSON.stringify(score));
    localStorage.setItem("round", round);
    localStorage.setItem("cFam", JSON.stringify(checkedFamilly));
    localStorage.setItem("cFamL", JSON.stringify(checkedFamillyL));
    window.scrollTo(0, 0);
    // element.append("<p class=\"infor copyleft\">App codée par Sean Ferrara (2285)</p>")
      $("a").click(function(){ $(this).effect("puff",function(){ $(this).show() }) })
  }
}
