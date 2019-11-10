<?php

$boxArray = file_get_contents('../fichier.json');
$jonRecuperer = json_decode($boxArray, true);

$tab = array();
$qcm = array();
$verification = array();

foreach ($_POST as $key => $value) {
    $tab[$key] = $value;
}

$qcm =  $jonRecuperer[end($tab)-1];
$resultat = 0;
$nbQuestion = 0;

foreach ($tab as $key => $value){
    if ('C' == $key[0]) {
        $verification = $qcm['Question' . $key[1]][1][($key[2] + ($key[2] - 1))];
        ++$nbQuestion;
    }
    if ($verification === 'on'){
        ++$resultat;
    }
    $verification = [];
}

$final = $resultat . ' / ' . $nbQuestion;

echo json_encode($final);