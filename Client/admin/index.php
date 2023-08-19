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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js"></script>

    <script src="./GalleryDisplay.js"></script>
    <script src="../js/GalleryDataManager.js"></script>

    <script src="./DataManager.js"></script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check WP Login Status</title>

    <link rel="stylesheet" type="text/css" href="../css/bootstrap.min.css">
</head>
<body>
    <div>
        <p>Logged in as <?php echo $current_user->display_name; ?> with roles: <?php echo $roles; ?></p>

        <h1>Gallery Data Viewer</h1>

        <div id="buttonsContainer"></div>

        <h2>Gallery Data Output:</h2>

        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="profile-tab"          data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="true">Visual</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="txtEditor-tab"               data-bs-toggle="tab" data-bs-target="#txtEditor" type="button" role="tab" aria-controls="txtEditor" aria-selected="false">Json</button>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <div id="visualEditor"></div>
            </div>
            <div class="tab-pane fade" id="txtEditor" role="tabpanel" aria-labelledby="txtEditor-tab">
                  <button id="saveButton">save</button>
                  <pre contenteditable="true" id="jsonEditor"></pre>
            </div>
        </div>

        

        <script>
            var editor = ace.edit("jsonEditor");
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/json");
            editor.getSession().setUseWrapMode(true);

            // Adjust the height initially
            adjustEditorHeightToScreen(editor);

            // Update the height every time the content changes
            /*editor.getSession().on('change', function() {
                adjustEditorHeightToScreen(editor);
            });*/


            var adminDataEditor = new AdminDataEditor(editor);
            adminDataEditor.Start();

            function adjustEditorHeightToScreen(editor) {
                var viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
                var editorOffset = editor.container.getBoundingClientRect().top;
                var availableHeight = viewportHeight - editorOffset;

                // Set the height
                editor.container.style.height = availableHeight + 'px';
                editor.resize();
            }



        </script>


        <!-- Add Bootstrap JS and Popper.js -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    </div>
</body>
</html>
