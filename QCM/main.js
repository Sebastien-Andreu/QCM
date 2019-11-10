function erreurCritique() {
    $('body').html('Erreur critique.');
}

function refresh() {
    window.location.reload(true);
}


function genererQCM(divQCM){
    var idQuestion = 0;
    divQCM.showDiv.show();
        divQCM.divJumbotron.fadeOut(0).fadeIn(200).append(
                $('<div />').addClass('text-center').append(
                    $('<form />').attr('action','').attr('method','POST').attr('id','formulaireQCM').append(
                        $('<h2 />').html('Titre'),
                        $('<div />').addClass('input-group mb-3').append(

                            $('<input />').attr('name','Titre').attr('type','text').attr('placeholder','Titre du QCM').addClass('form-control'),

                            $('<div />').addClass('input-group-append').append(
                                $('<button />').attr('type', 'button').addClass('btn btn-dark').html('Ajouter question').click(function () {
                                    const question = new questionQCM(++idQuestion);
                                    $('#formulaireQCM').append(question.showQuestion.fadeOut(0).fadeIn(200));
                                    $('#B'+question.idQuestion).click(function () {
                                        const reponse = new reponseQCM(question.idQuestion, question.idReponse);
                                        $('#Q' + question.idQuestion).append(reponse.showReponse.fadeOut(0).fadeIn(200));
                                    })

                                })
                            )
                        )
                    )
                ),

                $('<div />').addClass('mx-auto jumbotron text-center margin0').append(
                    $('<input />').attr('type','submit').addClass('btn btn-dark btn-lg').html('Créer le QCM').click(function () {
                        console.log($('#formulaireQCM'));
                        $.ajax({
                            url: 'php/ajoutQCM.php',
                            method: 'POST',
                            dataType: 'json',
                            data: $('#formulaireQCM').serialize()
                        })
                            .done(function() {
                                refresh();
                            })
                            .fail(erreurCritique);
                        return false;
                    })
                )
    );
}

function showAllQCM(){
    const showAllQCM = new divContainer('divAllQCM');

    $.getJSON('fichier.json', function (data) {
        if (data != null){
            $('#zoneButtonAllQCM').append ( showAllQCM.showDiv);
            console.log(data);
            var idQCM = 0;
            for (i = 0; i < data.length; ++i){
                var incrementTableau = 0;
                var tableau = [];
                tableau[incrementTableau] = data[i]['titreQCM'];

                var estFini = false;
                var idQ = 0;
                while (!estFini){
                    if (data[i]['Question' + ++idQ]){
                        tableau[++incrementTableau] = data[i]['Question' + idQ];
                    }
                    else{
                        estFini = true;
                    }
                }

                const qcm = new QCM(++idQCM,tableau);

                showAllQCM.divJumbotron.append(qcm.showButtonQCM.fadeOut(0).fadeIn(250));
                $('#QCMB' + qcm.id).click(function () {
                    qcm.showQCM;
                });
            }
        }
    });
}

let estCreer = false;

class QCM {
    constructor (id, tableau){
        this.taille = tableau.length;
        this.titre = tableau[0];
        this.id = id;
        this.contenue = tableau;
    }

    get showButtonQCM() {
        return $('<button />').attr('id', 'QCMB' + this.id).css('margin-bottom', '1em').css('margin-right', '1em').addClass('btn btn-dark').html(this.titre);
    }

    get showQCM(){
        $('#zoneShowQCM').fadeIn();
        $('#zoneShowQCM').empty();
        this.div = new divContainer('divShowQCM');
        $('#zoneShowQCM').append(this.div.showDiv.fadeOut(0).fadeIn(200));

        this.div.divJumbotron.addClass('text-center').append($('<form />').attr('id', 'QCM'));

        $('#QCM').append(
            $('<h1/>').html(this.titre)
        );
        for (var i = 1; i < this.contenue.length; ++i){
            const question = new questionQCM(i);
            $('#QCM').append(
                question.showQuestion,
                question.buttonAddReponse.hide(),
                question.inputQ.hide(),
                question.inputQ.removeAttr('name')
            );
            question.divCenter.append(
                $('<h2 />').html(this.contenue[i][0])
            );
            for (var j = 1; j < this.contenue[i].length; ++j){
                var tableauReponse = this.contenue[i][j];
                var id = 0;
                for (var k = 0; k < tableauReponse.length; k+=2){
                    const reponse = new reponseQCM(i, ++id);
                    reponse.input.attr('value',tableauReponse[k]);
                    reponse.input.attr('disabled','disabled');
                    question.divCenter.append(
                        reponse.showReponse
                    )
                }
            }
        }
        $('#QCM').append(
            $('<div />').addClass('mx-auto jumbotron text-center margin0').append(
                $('<input />').attr('name', 'id').attr('value',this.id).attr('type','text').hide(),
                $('<input />').attr('type','submit').addClass('btn btn-dark btn-lg').html('Créer le QCM').click(function () {
                    $.ajax({
                        url: 'php/verifierQCM.php',
                        method: 'POST',
                        dataType: 'json',
                        data: $('#QCM').serialize()
                    })
                        .done(function(data) {
                            $('#QCM').empty();
                            $('#QCM').append(
                                $('<div />').addClass('alert alert-primary').html('votre score :  ' + data).css('font-size', '30px').delay(5000).fadeOut(1000)
                            );
                            $('#zoneShowQCM').delay(5000).fadeOut();
                        })
                        .fail(erreurCritique);
                    return false;
                })
            )
        )
    }
}

class questionQCM {
     constructor(idQ){
        this.divQ = $('<div />').addClass('mx-auto jumbotron change dark').attr('id','Q'+ idQ);
        this.inputQ = $('<input />').attr('id', 'inputQ' + idQ).attr('name','Q'+idQ).attr('type','text').attr('placeholder','Question n°'+idQ).addClass('form-control');
        this.titreQ = $('<h4 />').html('Question n°' + idQ);
        this.buttonAddReponse = $('<button />').attr('type', 'button').attr('id','B'+idQ).addClass('btn btn-dark').html('Ajouter réponse');

        this.idR = 0;
        this.idQues = idQ;
     }

    get showQuestion(){
        this.divContainerInput = $('<div />').addClass('input-group mb-3').append(this.inputQ, this.buttonAddReponse);
        this.divContainerTitre = $('<div />').addClass('form-group mb-2').append(this.titreQ);
        this.divCenter = $('<div />').addClass('text-center').append(this.divContainerTitre, this.divContainerInput);
        this.divQ.append(this.divCenter);

        return this.divQ
    }

    get idReponse(){
        return ++this.idR;
    }
    get idQuestion(){
         return this.idQues;
    }
}

class reponseQCM {
    constructor(idQ, idR){
        this.hidden = $('<input />').attr('type', 'hidden').attr('name', 'HC'+idQ+''+idR).attr('value', 'off');
        this.checkbox = $('<input />').attr('name','C'+idQ +''+ idR).attr('type','checkbox').attr('value', 'on').attr('placeholder','validiter').addClass('changeCheckbox' + idQ)
            .click(function () {
                $('.changeCheckbox'  + idQ).not(this).prop('checked', false)
            });
        this.input = $('<input />').attr('name','R'+idQ +''+ idR).attr('type','text').addClass('form-control').attr('placeholder','Réponse '+ idR)
    }

    get showReponse(){
        this.divCheckbox = $('<div />').addClass('input-group-text').append(this.checkbox, this.hidden);
        this.containerCheckbox = $('<div />').addClass('input-group-prepend').append(this.divCheckbox);
        this.containerReponse =  $('<div />').addClass('input-group mb-3 reponse').append(this.containerCheckbox, this.input);

        return this.containerReponse;
    }
}

class divContainer {
    constructor(id){
        this.divJumbotron = $('<div />').addClass('col-lg-8 mx-auto jumbotron');
        this.divRow = $('<div />').addClass('row').append(this.divJumbotron);
        this.divMain = $('<div />').attr('id', id).addClass('container').append(this.divRow);
    }

    get showDiv(){
        return this.divMain;
    }
}


class inputConnexion {
    constructor(labelHtml,inputType, inputName, inputPlaceholder){
        this.input =  $('<input />').attr('type', inputType).attr('name', inputName).attr('placeholder', inputPlaceholder).addClass('form-control');
        this.divInput = $('<div />').addClass('col-sm-10').append(this.input);
        this.divLabel = $('<label />').attr('for', inputName).html(labelHtml).addClass('col-sm-2 col-form-label');
        this.container = $('<div />').addClass('form-group row').append(this.divLabel, this.divInput);
    }
    get showInput(){
        return this.container;
    }
}


$(document).ready(function () {
    $.ajax({
        url: 'php/verifierConnexion.php',
        dataType: 'json',
    }).done(function(data) {
        const divMain = new divContainer('divMain');
        const divDeco = new divContainer('divDeco');
        $('body').append(
            $('<h1 />').html('Création QCM').addClass('text-center white'),
            divMain.showDiv,
            $('<div />').attr('id','zoneQCM'),
            $('<div />').attr('id','zoneButtonAllQCM'),
            $('<div />').attr('id','zoneShowQCM'),
            divDeco.showDiv.hide()
        );
        if (data === false) {
            const inputLogin = new inputConnexion('Login', 'text', 'login', 'Login');
            const inputMdp = new inputConnexion('Password', 'password', 'mdp', 'Password');

            divMain.divJumbotron.append(
                $('<div />').attr('id','connexion').addClass('text-center').append(
                    $('<h3 />').html('Connexion'),

                    $('<form />').append(
                        $('<div />').attr('id', 'errorConnection'),

                        inputLogin.showInput,
                        inputMdp.showInput,

                        $('<input />').attr('type','submit').addClass('btn btn-dark btn-lg').html('Confirmer')
                    ).submit(function (data) {
                        $.ajax({
                            url: 'php/connexion.php',
                            method: 'post',
                            dataType: 'json',
                            data: $(this).serialize()
                        })
                            .done(function(data) {
                                if(data === true) {
                                    refresh();
                                } else {
                                    $('#errorConnection')
                                        .addClass('alert alert-warning')
                                        .html('Login ou Password incorrect.')
                                }
                            })
                            .fail(erreurCritique);
                        return false;
                    })

                )

            );
        } else {
            divMain.divJumbotron.append(
                $('<div />').attr('id','addQCM').addClass('text-center').append(
                    $('<h4 />').html('Créer un QCM'),

                    $('<button />').attr('type', 'button').attr('id', 'creerQCM').addClass('btn btn-dark btn-lg').html('Créer').click(function () {
                        if (!estCreer){
                            estCreer = true;

                            const divQCM = new divContainer('divFormulaire');
                            $('#zoneQCM').append(divQCM.showDiv);

                            genererQCM(divQCM);
                            $(this).html('Annuler');
                        }else{
                            estCreer = false;

                            $('#divFormulaire').remove();

                            idQuestion = 1;
                            $(this).html('Créer');
                        }
                    })
                )
            );

            showAllQCM();

            divDeco.showDiv.show();
            divDeco.divJumbotron.append(
                $('<div />').attr('id','deconnexion').addClass('text-center').append(
                    $('<h3 />').html('Deconnexion'),

                    $('<form />').addClass('text-center').attr('action', 'php/deconnexion.php').attr('method', 'post').append(
                        $('<button />').attr('type', 'submit').html('Deconnexion').addClass('btn btn-dark btn-lg'),
                    ).submit(function(data) {
                        $.ajax({
                            url: $(this).attr('action'),
                            method: $(this).attr('method'),
                            dataType: 'json',
                            data: $(this).serialize()
                        })
                            .done(function(data) {
                                refresh();
                            })
                            .fail(erreurCritique);
                        return false;
                    })

                )
            )
        }
    }).fail(erreurCritique);
});
