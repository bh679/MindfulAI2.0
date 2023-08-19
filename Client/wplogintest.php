<?php
// Include the WordPress environment to access WP functionalities
require('../wp-blog-header.php');

// Check if the user is logged in
if (is_user_logged_in()) {
    $current_user = wp_get_current_user();
    $roles = implode(', ', $current_user->roles);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check WP Login Status</title>
</head>
<body>
    <div>
        <?php if (is_user_logged_in()): ?>
            <p>Logged in as <?php echo $current_user->display_name; ?> with roles: <?php echo $roles; ?></p>
        <?php else: ?>
            <p>Not logged in. <a href="<?php echo wp_login_url(); ?>">Log in</a></p>
        <?php endif; ?>
    </div>
</body>
</html>
