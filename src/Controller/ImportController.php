<?php

namespace App\Controller;

use App\Entity\Enum\ImportFileStructure;
use App\Entity\Enum\ShopType;
use App\Form\Type\ImportFormType;
use App\Message\ProcessImportMessage;
use App\Service\ImportService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

final class ImportController extends AbstractController
{
    // Importer le fichier
    #[Route('/import', name: 'app_import')]
    public function import(Request $request, ImportService $importService, MessageBusInterface $bus): JsonResponse
    {
        $form = $this->createForm(ImportFormType::class);
        $form->handleRequest($request);

        if (!$form->isSubmitted() || !$form->isValid()) {
            return new JsonResponse([
                'message' => 'Fichier invalide ou manquant.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $file = $form->get('file')->getData();
        $fileimport = $importService->importFile($file);
        // $importService->processFile($fileimport->getId());

        $bus->dispatch(new ProcessImportMessage($fileimport->getId()));

        return new JsonResponse([
            'message' => 'Import ajouté',
        ]);
    }

    // Modèle d'import
    #[Route('/import-template', name: 'app_import_template')]
    public function template(): Response
    {
        $data = ImportFileStructure::HEADER;

        $response = new StreamedResponse();

        $response->setCallback(function () use ($data) {
            $handle = fopen('php://output', 'wb');

            foreach ($data as $row) {
                fputcsv($handle, $row);
            }
            fclose($handle);
        });

        $response->setStatusCode(Response::HTTP_OK);
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="template.csv"');

        return $response;
    }

    // Liste de types corrects de magasin
    #[Route('/import-shop-types', name: 'app_import_shop_types')]
    public function shoptypes(TranslatorInterface $translator): Response
    {
        $data = [
            ['Types'],
        ];
        foreach (ShopType::cases() as $type) {
            $data[] = [
                $translator->trans('shop.'.$type->value),
            ];
        }
        $response = new StreamedResponse();

        $response->setCallback(function () use ($data) {
            $handle = fopen('php://output', 'wb');

            foreach ($data as $row) {
                fputcsv($handle, $row);
            }
            fclose($handle);
        });

        $response->setStatusCode(Response::HTTP_OK);
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="shoptypes.csv"');

        return $response;
    }
}
