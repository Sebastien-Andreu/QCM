<?php

$tab = array();
$question = array();
$reponse = array();

$qcm = [];
$idQ = 0;
$verifierCheckbox = true;
$json = array();
$juste ="";

foreach ($_POST as $key => $value) {
    if ('Q' == $key[0]) {
        if (sizeof($reponse) > 0){
            array_push($question, $reponse);
            $qcm['Question' . ++$idQ] = $question;
        }
        $reponse = array();
        $question = array();
        $question[] = $value;
    }
    else{
        if ('C' == $key[0]){
            $juste = 'on';
            $verifierCheckbox = false;
        }else if('H' == $key[0]){
            if (!$verifierCheckbox){
                $verifierCheckbox = true;
            }else{
                $juste = 'off';
            }
        }
        if ('R' == $key[0]) {
            $reponse[] = $value;
            array_push($reponse, $juste);
        }
        else {
            if ('T' == $key[0]){
                $qcm['titreQCM'] = $value;
            }
        }
    }
}
array_push($question, $reponse);
$qcm['Question' . ++$idQ] = $question;

$containerQCM[] = $qcm;

$boxArray = file_get_contents('../fichier.json');
if (json_decode($boxArray)){
    $getdata = json_decode($boxArray);

    $combinedData = array_merge($containerQCM, $getdata);
    $json = json_encode($combinedData);
}else{
    $json = json_encode($containerQCM);
}

$nom_du_fichier = '../fichier.json';

$fichier = fopen($nom_du_fichier, 'w+');

fwrite($fichier, $json);

fclose($fichier);

echo json_encode($json);