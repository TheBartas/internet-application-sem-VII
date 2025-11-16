<?php

/** @var \App\Model\PTZCamera[] $cameras */
/** @var \App\Service\Router $router */

$title = 'Camera List';

ob_start(); ?>
    <h1>Camera List</h1>

    <a href="<?= $router->generatePath('camera-create') ?>">Add new PTZ Camera</a>

    <ul class="index-list">
        <?php foreach ($cameras as $camera): ?>
            <li><h3><?= $camera->getName() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('camera-show', ['id' => $camera->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('camera-edit', ['id' => $camera->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
