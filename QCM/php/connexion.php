<?php
session_start();


if(isset($_POST['login']) && isset($_POST['mdp'])) {
    if ($_POST['login'] == 'test' && $_POST['mdp'] == 'test') {
        $_SESSION['user_id'] = 'test';
        echo json_encode(true);
    } else {
        echo json_encode(false);
    }
}
