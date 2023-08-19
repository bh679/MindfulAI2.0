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
    <script src="DataManager.js"></script>



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
        <button id="saveButton">save</button>
        <pre contenteditable="true" id="jsonEditor"></pre>

        <script>
            var editor = ace.edit("jsonEditor");
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/json");
            editor.getSession().setUseWrapMode(true);

            // Adjust the height initially
            adjustEditorHeightToScreen(editor);

            // Update the height every time the content changes
            editor.getSession().on('change', function() {
                adjustEditorHeight(editor);
            });


            var adminDataEditor = new AdminDataEditor(editor);
            adminDataEditor.Start();

           //document.addEventListener('DOMContentLoaded', function() {
           // });

//            var jsonContent = editor.getValue();
//            editor.setValue('{"example": "value"}', -1);  // -1 sets the cursor position to the start after setting value
            /*function adjustEditorHeight(editor) {
                var session = editor.getSession();
                var newHeight = 0;
                var lineHeight = editor.renderer.lineHeight;
                
                var editorWidth = editor.container.clientWidth;
                var screenColumns = Math.floor(editorWidth / editor.renderer.characterWidth);
                var lines = session.getDocument().getAllLines();
                
                for (var i = 0; i < lines.length; i++) {
                    var screenRowsForLine = Math.ceil(lines[i].length / screenColumns);
                    newHeight += screenRowsForLine * lineHeight;
                }

                // Set the height
                editor.container.style.height = newHeight.toString() + 'px';
                editor.resize();
            }*/

            function adjustEditorHeightToScreen(editor) {
                var viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
                var editorOffset = editor.container.getBoundingClientRect().top;
                var availableHeight = viewportHeight - editorOffset;

                // Set the height
                editor.container.style.height = availableHeight + 'px';
                editor.resize();
            }


        </script>
    </div>
</body>
</html>
