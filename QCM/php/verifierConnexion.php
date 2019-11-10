<?php
session_start();

$data = new stdClass();
$data->is_connected = false;

if (isset($_SESSION['user_id'])) {
    $data->is_connected = true;
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

echo json_encode($data->is_connected);
