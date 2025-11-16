<?php

/** @var \App\Model\CameraPTZ $camera */
/** @var \App\Service\Router $router */

$title = 'Create Camera PTZ';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Camera PTZ</h1>
    <div id="camera-create-container">
        <form action="<?= $router->generatePath('camera-create') ?>" method="post" class="edit-form">

            <label for="name">Name</label>
            <input type="text" name="camera[name]" id="cname" value="<?= $camera ? $camera->getName() : '' ?>" required>

            <label for="price">Price</label>
            <input type="number" step="0.01" name="camera[price]" id="price" value="<?= $camera ? $camera->getPrice() : 0 ?>" required>

            <label for="pan">Pan (Horizontal Rotation)</label>
            <input type="number" name="camera[pan]" id="pan" value="<?= $camera ? $camera->getPan() : '' ?>" required>

            <label for="tilt">Tilt (Vertical Rotation)</label>
            <input type="number" name="camera[tilt]" id="tilt" value="<?= $camera ? $camera->getTilt() : '' ?>" required>

            <label for="zoom">Zoom</label>
            <input type="number" name="camera[zoom]" id="zoom" value="<?= $camera ? $camera->getZoom() : '' ?>" required>

            <label for="description">Description</label>
            <textarea name="camera[description]" id="description" required><?= $camera ? $camera->getDescription() : '' ?></textarea>

            <input type="hidden" name="action" value="camera-create">

            <button type="submit">Create Camera</button>
        </form>
    </div>

    <a href="<?= $router->generatePath('camera-index') ?>">Back to Camera List</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
