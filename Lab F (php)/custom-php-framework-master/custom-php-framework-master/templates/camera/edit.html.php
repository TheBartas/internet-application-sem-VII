<?php

/** @var \App\Model\PTZCamera $camera */
/** @var \App\Service\Router $router */

$title = "Edit camera {$camera->getName()} ({$camera->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <div id="camera-create-container">
        <form action="<?= $router->generatePath('camera-edit') ?>" method="post" class="edit-form">
            <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
            <button type="submit">Edit Camera</button>
            <input type="hidden" name="action" value="camera-edit">
            <input type="hidden" name="id" value="<?= $camera->getId() ?>">
        </form>
    </div>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('camera-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('camera-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="camera-delete">
                <input type="hidden" name="id" value="<?= $camera->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';