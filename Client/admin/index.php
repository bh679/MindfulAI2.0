<?php
// Include the WordPress environment to access WP functionalities
require('../../wp-blog-header.php');

// If the user isn't logged in, redirect them to the login page
if (!is_user_logged_in()) {
    $redirect_url = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    wp_redirect(wp_login_url($redirect_url));
    exit;
}

$current_user = wp_get_current_user();
$roles = implode(', ', $current_user->roles);
?>

<!DOCTYPE html>
<html lang="en">
<head>

    <script src="../modules/NodeJSON/NodeJSON.js"></script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check WP Login Status</title>
</head>
<body>
    <div>
        <p>Logged in as <?php echo $current_user->display_name; ?> with roles: <?php echo $roles; ?></p>

        <h1>Gallery Data Viewer</h1>

        <div id="buttonsContainer"></div>

        <h2>Gallery Data Output:</h2>
        <pre id="output"></pre>

        <script type="module" src="DataManager.js"></script>
    </div>
</body>
</html>
