<?php

/** @var \App\Model\PTZCamera $camera */
/** @var \App\Service\Router $router */

$title = "{$camera->getName()} ({$camera->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $camera->getName() ?></h1>
    <article>
        <p><strong>Price:</strong> <?= $camera->getPrice() ?></p>
        <p><strong>Pan:</strong> <?= $camera->getPan() ?></p>
        <p><strong>Tilt:</strong> <?= $camera->getTilt() ?></p>
        <p><strong>Zoom:</strong> <?= $camera->getZoom() ?></p>

        <hr>

        <p><strong>Description:</strong> <?= $camera->getDescription() ?></p>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('camera-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('camera-edit', ['id'=> $camera->getId()]) ?>">Edit</a></li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
