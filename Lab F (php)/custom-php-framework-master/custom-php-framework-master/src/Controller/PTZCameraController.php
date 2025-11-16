<?php

namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\PTZCamera;
use App\Service\Router;
use App\Service\Templating;

class PTZCameraController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $cameras = PTZCamera::findAll();
        return $templating->render('camera/index.html.php', [
            'cameras' => $cameras,
            'router' => $router,
        ]);
    }
    public function createAction(?array $requestCamera, Templating $templating, Router $router): ?string
    {
        if ($requestCamera) {
            $camera = PTZCamera::fromArray($requestCamera);
            $camera->save();

            $path = $router->generatePath('camera-index');
            $router->redirect($path);
            return null;
        } else {
            $camera = new PTZCamera();
        }

        return $templating->render('camera/create.html.php', [
            'camera' => $camera,
            'router' => $router,
        ]);
    }
    public function showAction(int $cameraId, Templating $templating, Router $router): ?string
    {
        $camera = PTZCamera::find($cameraId);
        if (! $camera) {
            throw new NotFoundException("Missing camera with id $cameraId");
        }

        return $templating->render('camera/show.html.php', [
            'camera' => $camera,
            'router' => $router,
        ]);
    }
    public function editAction(int $cameraId, ?array $requestCamera, Templating $templating, Router $router): ?string
    {
        $camera = PTZCamera::find($cameraId);
        if (! $camera) {
            throw new NotFoundException("Missing camera with id $cameraId");
        }

        if ($requestCamera) {
            $camera->fill($requestCamera);
            $camera->save();

            $path = $router->generatePath('camera-index');
            $router->redirect($path);
            return null;
        }

        return $templating->render('camera/edit.html.php', [
            'camera' => $camera,
            'router' => $router,
        ]);
    }
    public function deleteAction(int $cameraId, Router $router): ?string
    {
        $camera = PTZCamera::find($cameraId);
        if (! $camera) {
            throw new NotFoundException("Missing camera with id $cameraId");
        }

        $camera->delete();
        $path = $router->generatePath('camera-index');
        $router->redirect($path);
        return null;
    }
}